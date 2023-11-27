import {
  Box,
  HStack,
  Stack,
  Center,
  Image,
  Text,
  Switch,
  Input,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import Head from "next/head";
import { FaMicrophone } from "react-icons/fa";
import SpeakerButton from "@/components/speaker";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useEffect, useState } from "react";
import { FiMic, FiPaperclip } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import styles from "@/styles/chat.module.css";
import { useSpeechRecognition } from "react-speech-kit";
import useSWR from "swr";
import { getChats, getMediaUrl, speechToText, swrInsecureFetcher } from "@/lib/llmAPI";
import { ChatMessagePresenter } from "@/lib/api.types";
import { useWS } from "@/components/ws";
import { useRouter } from "next/router";
import moment from "moment";

export default function Home() {
  const [isVoice, setIsVoice] = useState(true);
  const [searchValue, setTextValue] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    const rtc = await import("../../../node_modules/recordrtc");
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

  function scrollToBottom() {
    const chat = document.getElementById("chat");
    if (chat) {
      chat.scrollTop = chat.scrollHeight;
    }
  }

  useEffect(() => {
    getChats('1').then((res) => {
      setDataChats(res.data);
    });
  }, []);

  useEffect(() => {
    console.log("Websocket: ", ws);
    if (!ws) return;
    ws.onmessage = function (e) {
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

  useEffect(() => {
    scrollToBottom();
  }, [dataChats]);

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
            <HStack align={"flex-start"} key={index}>
              <Box
                display={"flex"}
                width={"50px"}
                height={"50px"}
                rounded={"full"}
                justifyContent={"center"}
                alignItems={"center"}
                bg={"var(--primary)"}
                fontWeight={"700"}
                color={"white"}
              >
                S
              </Box>
              <Box>
                <Text mb={2}>Seebility</Text>
                <Box
                  w={"250px"}
                  ml={3}
                  background={"var(--tertiary)"}
                  padding={"1.5rem"}
                  rounded={"1rem"}
                  borderTopLeftRadius={"0"}
                  mb={1}
                >
                  {chat.message}
                </Box>
                <Text
                  color={"rgba(121, 124, 123, 0.50)"}
                  fontSize={".7rem"}
                  textAlign={"right"}
                >
                  {moment(chat.created_at).format("hh:mm A")}
                </Text>
              </Box>
            </HStack>
          ) : (
            <Box key={index}>
              <Box
                ml={"auto"}
                width={"250px"}
                textAlign={"right"}
                background={"var(--primary)"}
                color={"white"}
                padding={"1.5rem"}
                rounded={"1rem"}
                borderTopEndRadius={"0"}
                mb={1}
              >
                {chat.message}
              </Box>
              <Text
                color={"rgba(121, 124, 123, 0.50)"}
                fontSize={".7rem"}
                textAlign={"right"}
              >
                {moment(chat.created_at).format("hh:mm A")}
              </Text>
            </Box>
          )
        )}
      </Stack>

      <Box className={styles.chatInput}>
        <span className={styles.clip}>
          <FiPaperclip />
        </span>
        <Box pos={"relative"}>
          <Text
            color={"#707070"}
            pos={"absolute"}
            zIndex={1}
            left={"2px"}
            top={"50%"}
            transform={"translateY(-50%)"}
            display={searchValue ? "none" : "block"}
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
              }
            }}
            cols={50}
          />
        </Box>
        <Box
          className={styles.mic}
          color={isSpeaking ? "var(--primary)" : "#1d1717"}
          onClick={() => {
            if (!supported) {
              toast({
                title:
                  "Oh no, it looks like your browser doesn't support speech recognition.",
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
          }}
        >
          <IoMdSend />
        </span>
      </Box>
    </Box>
  );
}
