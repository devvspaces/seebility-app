import SoundAmplitudeBars from "@/components/soundAmplitude/soundAmplitude";
import SpeakerButton from "@/components/speaker";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Container,
  Divider,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { CiCircleCheck } from "react-icons/ci";

export default function Page() {
  return (
    <Box>
      <Head>
        <title>Seebility - Notifications</title>
      </Head>

      <Container>
        <HStack py={"1rem"} justify={"space-between"} align={"center"} mb={4}>
          <Heading size={"lg"} color={"#363636"}>
            Notifications
          </Heading>
          <SpeakerButton />
        </HStack>
      </Container>

      <SoundAmplitudeBars />

      <Box>
        <Heading ml={"2rem"} mb={5} size={"sm"} color={"#344054"}>
          Today
        </Heading>
      </Box>
      <Stack color={"#1A3843"} mb={5}>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <>
              <HStack
                key={i}
                align={"flex-start"}
                spacing={".8rem"}
                px={"1.5rem"}
              >
                <Image src="/img/icon.png" alt="icon" />
                <Box>
                  <Text fontSize={".8rem"}>
                    Exclusive offer! Order now and get 20% off on your favorite
                    gadgets.
                  </Text>
                  <Text mt={2} fontSize={".7rem"}>
                    12:40 PM
                  </Text>
                </Box>
              </HStack>
              <Divider />
            </>
          ))}
      </Stack>

      <Box>
        <Heading ml={"2rem"} mb={5} size={"sm"} color={"#344054"}>
          Yesterday
        </Heading>
      </Box>
      <Stack color={"#1A3843"} mb={5}>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <>
              <HStack
                key={i}
                align={"flex-start"}
                spacing={".8rem"}
                px={"1.5rem"}
              >
                <Image src="/img/icon.png" alt="icon" />
                <Box>
                  <Text fontSize={".8rem"}>
                    Exclusive offer! Order now and get 20% off on your favorite
                    gadgets.
                  </Text>
                  <Text mt={2} fontSize={".7rem"}>
                    12:40 PM
                  </Text>
                </Box>
              </HStack>
              <Divider />
            </>
          ))}
      </Stack>
    </Box>
  );
}
