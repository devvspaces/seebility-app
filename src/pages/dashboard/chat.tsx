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
import { useState } from "react";
import { FiMic, FiPaperclip } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import styles from "@/styles/chat.module.css";
import { useSpeechRecognition } from "react-speech-kit";

export default function Home() {
  const [isVoice, setIsVoice] = useState(true);
  const [searchValue, setTextValue] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const toast = useToast();

  const { listen, listening, stop, supported } = useSpeechRecognition({
    onResult: (result: any) => {
      setTextValue((prev) => prev + result);
      setIsSpeaking(false);
    },
  });

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

      <Stack padding={"1rem"} spacing={"1rem"} paddingBottom={"5rem"}>
        <HStack align={"flex-start"}>
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
              Hello! How can i help you today?
            </Box>
            <Text
              color={"rgba(121, 124, 123, 0.50)"}
              fontSize={".7rem"}
              textAlign={"right"}
            >
              09:25 AM
            </Text>
          </Box>
        </HStack>
        <Box>
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
            I would like to get a laptop
          </Box>
          <Text
            color={"rgba(121, 124, 123, 0.50)"}
            fontSize={".7rem"}
            textAlign={"right"}
          >
            09:25 AM
          </Text>
        </Box>
        <HStack align={"flex-start"}>
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
              Hello! How can i help you today?
            </Box>
            <Text
              color={"rgba(121, 124, 123, 0.50)"}
              fontSize={".7rem"}
              textAlign={"right"}
            >
              09:25 AM
            </Text>
          </Box>
        </HStack>
        <Box>
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
            I would like to get a laptop
          </Box>
          <Text
            color={"rgba(121, 124, 123, 0.50)"}
            fontSize={".7rem"}
            textAlign={"right"}
          >
            09:25 AM
          </Text>
        </Box>

        <HStack align={"flex-start"}>
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
              Hello! How can i help you today?
            </Box>
            <Text
              color={"rgba(121, 124, 123, 0.50)"}
              fontSize={".7rem"}
              textAlign={"right"}
            >
              09:25 AM
            </Text>
          </Box>
        </HStack>
        <Box>
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
            I would like to get a laptop
          </Box>
          <Text
            color={"rgba(121, 124, 123, 0.50)"}
            fontSize={".7rem"}
            textAlign={"right"}
          >
            09:25 AM
          </Text>
        </Box>
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
              listen({ interimResults: false});
            }
            setIsSpeaking(!isSpeaking);
          }}
        >
          <FiMic />
        </Box>
        <span className={styles.send}>
          <IoMdSend />
        </span>
      </Box>
    </Box>
  );
}
