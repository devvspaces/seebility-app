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

  useEffect(() => {
    console.log("Websocket: ", ws);
    if (!ws) return;
    ws.onmessage = function (e) {
      const data = JSON.parse(e.data);
      const message = data.message;
      if (message) {
        console.log(message);
      }
      const audio = data.audio;
      if (audio) {
        const url = getMediaUrl(audio);
        const audioEl = new Audio(url);
        audioEl.play();
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
      console.log("sending for translation");
      const response = await speechToText(record);
      console.log(response);
      console.log("received response");
      setTranslating(false);

      if (response.status === 200) {
        const text = response.data.text;
        console.log(text);

        toast({
          title: "Success",
          description: "Audio processed successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });

        // Send the text to the websocket
        ws?.send(
          JSON.stringify({
            message: text,
          })
        );

        // update the state to waiting for response
        setWaitingForResponse(true);
      } else {
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
      router.push(routes.chat)
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
          Hey, Double tap your screen!
          <br />
          Tell us what you want.
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
              if (status === "recording") {
                setStatus("stopped");
                recorder.stopRecording(stopRecording);
                console.log("stopped");
              } else {
                await startRecording();
              }
            }}
            isDisabled={translating || waitingForResponse}
            isLoading={translating}
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
