import { Box, HStack, Heading, Center, Image, Text } from "@chakra-ui/react";
import Head from "next/head";
import { FaMicrophone } from "react-icons/fa";
import styles from "@/styles/home.module.css";
import SpeakerButton from "@/components/speaker";

export default function Home() {
  return (
    <>
      <Head>
        <title>Seebility</title>
      </Head>

      <Box textAlign={"center"} padding={'1rem'}>
        <HStack justify={"end"}>
          <SpeakerButton />
        </HStack>

        <Heading size={'lg'} mt={"2rem"}>
          Hey, Double tap your screen!
          <br />
          Tell us what you want.
        </Heading>

        <Center my={"4rem"}>
          <span className={styles.microphone}>
            <FaMicrophone />
          </span>
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
