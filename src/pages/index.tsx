import {
  Box,
  HStack,
  Heading,
  Center,
  Image,
  Text,
  useToast,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";
import { FaMicrophone } from "react-icons/fa";
import styles from "@/styles/home.module.css";
import SpeakerButton from "@/components/speaker";
import { useWS } from "@/components/ws";
import { useEffect, useState } from "react";
import { getMediaUrl, speechToText } from "@/lib/llmAPI";
import { useRouter } from "next/router";
import routes from "@/lib/routes";

function Home() {
  const ws = useWS();
  const router = useRouter();

  const [current, setCurrent] = useState(
    "Hey, Tap your screen! Tell us what you want."
  );

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sentMessage, setSentMessage] = useState(0);
  const [playedWelcome, setPlayedWelcome] = useState(false);
  const [playedWaiting, setPlayedWaiting] = useState(false);
  const [count, setCount] = useState(0);

  function playSound(url: string) {
    const audio = new Audio(url);
    audio.play();
    return audio;
  }

  useEffect(() => {
    if (!ws) return;

    if (!playedWelcome) {
      const audio = playSound("/voices/welcome.mp3");
      audio.onended = function () {
        setPlayedWelcome(true);
      };
    }

    setTimeout(() => {
      console.log("Sent Message count");
      console.log(sentMessage);
      if (sentMessage !== 0 && !playedWaiting) {
        setCount((count) => count + 1);
        console.log("Playing waiting");
        console.log(sentMessage);
        console.log("Time since last sent message:")
        console.log((Date.now() - sentMessage)/1000)
        if (count > 5) {
          const audio = playSound("/voices/wait.mp3");
          audio.onended = function () {
            console.log("ended");
          };
          setCount(0);
          setPlayedWaiting(true);
        }
      }
    }, 1000);

    let context: AudioContext | null;
    let audioChunks: ArrayBuffer[] = [];

    function play() {
      if (audioChunks.length > 0 && !playing) {
        console.log("Playing");
        console.log(playing);
        playing = true;
        console.log("Updated Playing");
        console.log(playing);

        console.log(audioChunks);

        const buf = audioChunks.shift() as ArrayBuffer;
        let blob = new Blob([buf]);
        // Clear chunks after playing
        // audioChunks = [];
        let fileReader = new FileReader();

        fileReader.onload = function () {
          let arrayBuffer = this.result as ArrayBuffer;
          if (!arrayBuffer) return;
          if (!context) return;
          context.decodeAudioData(
            arrayBuffer,
            function (buffer) {
              if (!context) return;
              let source = context.createBufferSource();
              console.log("Creating buffer source");
              if (!source) return;
              source.buffer = buffer;
              source.connect(context.destination);
              source.start(0);
              console.log("Playing audio");
              setCurrent("Speaking...");
              setIsSpeaking(true);

              source.onended = function () {
                console.log("Audio ended");
                playing = false;
                setIsSpeaking(false);
                play();
              };
            },
            function (err) {
              playing = false;
              setIsSpeaking(false);
              console.log(err);
              play();
            }
          );
        };

        fileReader.readAsArrayBuffer(blob);
      } else {
        console.error("No audio chunks");
        playing = false;
        setIsSpeaking(false);
        setCurrent("Hey, Tap your screen! Tell us what you want.");
      }
    }

    ws.binaryType = "arraybuffer";
    let playing = false;
    ws.onmessage = function (e) {
      console.log("Got a message from the websocket");
      console.log(
        `Time since last sent message: ${
          (Date.now() - sentMessage) / 1000
        } seconds}`
      );
      setSentMessage(0);
      if (typeof e.data === "string") {
        const data = JSON.parse(e.data);
        const message = data.message;
        if (message) {
          console.log(message);
        }
      } else if (e.data instanceof ArrayBuffer) {
        console.log("Received audio");

        // Receive audio chunk as a Blob
        let receivedBlob = e.data;

        audioChunks.push(receivedBlob);

        if (!context) {
          context = new AudioContext();
        }

        if (!playing) {
          play();
        }
      }
      setWaitingForResponse(false);
    };
  }, [ws, sentMessage, playedWelcome, count, playedWaiting]);

  const toast = useToast();
  const [translating, setTranslating] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [recorder, setRecorder] = useState<any>(null);
  const [status, setStatus] = useState<"recording" | "stopped">("stopped");

  function stopRecording() {
    let blob = recorder.getBlob();
    const x = new FileReader();
    x.onload = async () => {
      const base64data = x.result as string;
      const record = base64data.split(",")[1];

      // Send the data to the API
      setTranslating(true);
      setCurrent("Translating...");
      console.log("sending for translation");
      const startTime = Date.now();
      const response = await speechToText(record);
      console.log(`Time taken: ${(Date.now() - startTime) / 1000} seconds`);
      console.log(response);
      console.log("received response");
      setTranslating(false);

      if (response.status === 200) {
        const text = response.data.text;
        console.log(text);

        setCurrent("Thinking...");

        // Send the text to the websocket
        setSentMessage(() => Date.now());
        ws?.send(
          JSON.stringify({
            message: text,
          })
        );

        // update the state to waiting for response
        setWaitingForResponse(true);
        setPlayedWaiting(false);
      } else {
        setCurrent("Hey, Tap your screen! Tell us what you want.");
        toast({
          title: "Error",
          description: "An error occurred while sending the audio",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    };
    x.readAsDataURL(blob);
  }

  async function startRecording() {
    // @ts-ignore
    const rtc = await import("../../node_modules/recordrtc");
    const RecordRTC = rtc.default;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(async (stream) => {
        console.log("got stream");
        const recorder = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm;codecs=pcm",
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 250,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
          bufferSize: 4096,
          audioBitsPerSecond: 128000,
        });
        console.log("recorder created");
        recorder.startRecording();
        playSound("/voices/recording.wav");
        setRecorder(recorder);
        setStatus("recording");
        console.log("recording");
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "You need to allow microphone access to use this app",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      });
  }

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isRightSwipe) {
      router.push(routes.chat);
    }
  };

  return (
    <>
      <Head>
        <title>Seebility</title>
      </Head>

      <Box
        textAlign={"center"}
        padding={"1rem"}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <HStack justify={"end"}>
          <SpeakerButton />
        </HStack>

        <Heading size={"lg"} mt={"2rem"}>
          {current}
        </Heading>

        <Center my={"4rem"}>
          <Button
            bg={
              status === "recording"
                ? "blue.500 !important"
                : "gray.500 !important"
            }
            color={"white"}
            className={styles.microphone}
            onClick={async (e) => {
              if (isSpeaking) {
                return;
              }

              if (status === "recording") {
                setStatus("stopped");
                recorder.stopRecording(stopRecording);
                console.log("stopped");
              } else {
                await startRecording();
              }
            }}
            isDisabled={translating || waitingForResponse}
            isLoading={translating || waitingForResponse}
          >
            <FaMicrophone />
          </Button>
        </Center>

        <Center>
          <Image src="/img/swipe.png" alt="swipe" />
        </Center>

        <Text
          fontWeight={"bold"}
          fontSize={"1.3rem"}
          mt={"1rem"}
          color={"var(--primary)"}
        >
          Swipe to visualize through chat
        </Text>
      </Box>
    </>
  );
}

// export default withAuth(Home)
export default Home;
