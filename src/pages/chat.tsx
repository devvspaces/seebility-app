import {
  Box,
  HStack,
  Stack,
  Text,
  Switch,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import Head from "next/head";
import SpeakerButton from "@/components/speaker";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { FiMic, FiPaperclip } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import styles from "@/styles/chat.module.css";
import { useSpeechRecognition } from "react-speech-kit";
import { getChats, getMediaUrl, speechToText } from "@/lib/llmAPI";
import { ChatMessagePresenter } from "@/lib/api.types";
import { useWS } from "@/components/ws";
import { useRouter } from "next/router";
import moment from "moment";
import Markdown from "react-markdown";

export default function Home() {
  const [isVoice, setIsVoice] = useState(true);
  const [searchValue, setTextValue] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [dataChats, setDataChats] = useState<ChatMessagePresenter[]>([]);
  const toast = useToast();

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: (result: any) => {
      setTextValue((prev) => prev + result);
      setIsSpeaking(false);
    },
  });

  const ws = useWS();
  const router = useRouter();
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
    const rtc: any = (await import("../../node_modules/recordrtc")) as any;
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getChats("1").then((res) => {
      setDataChats(res.data);
      scrollToBottom();
    });
  }, []);

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
            setAiIsSpeaking(true);

            source.onended = function () {
              console.log("Audio ended");
              playing = false;
              setAiIsSpeaking(false);
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
          setDataChats((prev) => [
            ...prev,
            {
              message: message,
              ai: true,
              room_name: "1",
              created_at: new Date().toISOString(),
            },
          ]);
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

  function sendMessage() {
    if (searchValue === "") return;
    ws?.send(
      JSON.stringify({
        message: searchValue,
      })
    );
    setDataChats((prev) => [
      ...prev,
      {
        message: searchValue,
        ai: false,
        room_name: "1",
        created_at: new Date().toISOString(),
      },
    ]);
    setTextValue("");
    scrollToBottom();
  }

  return (
    <Box pos={"relative"}>
      <Head>
        <title>Seebility - Chat</title>
      </Head>

      <HStack justify={"space-between"} bg={"white"} padding={"1rem"}>
        <Box fontSize={"1.8rem"}>
          <MdOutlineKeyboardBackspace />
        </Box>
        <HStack gap={"2rem"}>
          <Switch
            id="voice-switch"
            isChecked={isVoice}
            onChange={() => setIsVoice(!isVoice)}
          />
          <SpeakerButton />
        </HStack>
      </HStack>

      <Stack id="chat" padding={"1rem"} spacing={"1rem"} paddingBottom={"5rem"}>
        {dataChats?.map((chat, index) =>
          chat.ai ? (
            <Box key={index}>
              <HStack align={"flex-start"} mb={2} alignItems={"center"}>
                <Box
                  display={"flex"}
                  width={"30px"}
                  height={"30px"}
                  rounded={"full"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  bg={"var(--primary)"}
                  fontWeight={"700"}
                  color={"white"}
                  fontSize={".8rem"}
                >
                  S
                </Box>
                <Box>
                  <Text fontSize={".8rem"}>Seebility</Text>
                </Box>
              </HStack>
              <Box w={"fit-content"} maxW={"350px"}>
                <Box
                  background={"var(--tertiary)"}
                  padding={"1rem"}
                  rounded={".6rem"}
                  borderTopLeftRadius={"0"}
                  mb={1}
                  fontSize={".85rem"}
                  className={styles.aiMessage}
                >
                  <Markdown>{chat.message}</Markdown>
                </Box>
                <Text
                  color={"rgba(121, 124, 123, 0.50)"}
                  fontSize={".6rem"}
                  textAlign={"right"}
                >
                  {moment(chat.created_at).day() === moment().day() ? (
                    <>{moment(chat.created_at).format("hh:mm A")}</>
                  ) : (
                    <>
                      {moment(chat.created_at).format(
                        "ddd, MMM D, YYYY hh:mm A"
                      )}
                    </>
                  )}
                </Text>
              </Box>
            </Box>
          ) : (
            <Box key={index}>
              <Box
                ml={"auto"}
                w={"fit-content"}
                maxW={"250px"}
                background={"var(--primary)"}
                color={"white"}
                padding={"1rem"}
                rounded={".6rem"}
                borderTopEndRadius={"0"}
                mb={1}
                fontSize={".9rem"}
              >
                {chat.message}
              </Box>
              <Text
                color={"rgba(121, 124, 123, 0.50)"}
                fontSize={".6rem"}
                textAlign={"right"}
              >
                {moment(chat.created_at).day() === moment().day() ? (
                  <>{moment(chat.created_at).format("hh:mm A")}</>
                ) : (
                  <>
                    {moment(chat.created_at).format("ddd, MMM D, YYYY hh:mm A")}
                  </>
                )}
              </Text>
            </Box>
          )
        )}
        <div ref={messagesEndRef} />
      </Stack>

      <Box className={styles.chatInput}>
        <span className={styles.clip}>
          <FiPaperclip />
        </span>
        <Box pos={"relative"}>
          <Text
            color={"#707070"}
            opacity={0.5}
            pos={"absolute"}
            left={"2px"}
            top={"50%"}
            transform={"translateY(-50%)"}
            display={searchValue ? "none" : "block"}
            className={styles.placeHolder}
          >
            Write a message
          </Text>
          <Textarea
            resize={"none"}
            className={styles.input}
            rows={1}
            value={searchValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            cols={50}
            isDisabled={aiIsSpeaking}
          />
        </Box>
        <Box
          className={styles.mic}
          color={isSpeaking ? "var(--primary)" : "#1d1717"}
          onClick={() => {
            if (!supported) {
              toast({
                title:
                  "Your browser doesn't support speech recognition.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
              });
              return;
            }
            if (isSpeaking) {
              stop();
            } else {
              listen({ interimResults: false });
            }
            setIsSpeaking(!isSpeaking);
          }}
        >
          <FiMic />
        </Box>
        <span
          className={styles.send}
          onClick={async (e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <IoMdSend />
        </span>
      </Box>
    </Box>
  );
}
