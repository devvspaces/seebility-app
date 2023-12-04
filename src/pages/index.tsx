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
    "Hey, Double tap your screen! Tell us what you want."
  );

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!ws) return;
    let context: AudioContext | null;
    let audioChunks: ArrayBuffer[] = [];

    function play() {
      if (audioChunks.length > 0 && !playing) {
        console.log("Playing");
        console.log(playing);
        playing = true;
        console.log("Updated Playing");
        console.log(playing);
        let blob = new Blob(audioChunks);
        // Clear chunks after playing
        audioChunks = [];
        let fileReader = new FileReader();

        fileReader.onload = function () {
          let arrayBuffer = this.result as ArrayBuffer;
          if (!arrayBuffer) return;
          if (!context) return;
          context.decodeAudioData(arrayBuffer, function (buffer) {
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
          });
        };

        fileReader.readAsArrayBuffer(blob);
      }
    }

    ws.binaryType = "arraybuffer";
    let playing = false;
    ws.onmessage = function (e) {
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

        play();
      }
      setWaitingForResponse(false);
    };

    ws.onopen = function (e) {
      console.log("Chat socket opened");
    };

    ws.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };
  }, [ws]);

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
      const response = await speechToText(record);
      console.log(response);
      console.log("received response");
      setTranslating(false);

      if (response.status === 200) {
        const text = response.data.text;
        console.log(text);

        setCurrent("Thinking...");

        // Send the text to the websocket
        ws?.send(
          JSON.stringify({
            message: text,
          })
        );

        // update the state to waiting for response
        setWaitingForResponse(true);
      } else {
        setCurrent("Hey, Double tap your screen! Tell us what you want.");
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
