import SpeakerButton from "@/components/speaker";
import { DeleteIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { FaAngleDown, FaCheckCircle, FaMinus, FaPlus } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { IoIosArrowRoundDown } from "react-icons/io";

export default function Page() {
  return (
    <Box>
      <Head>
        <title>Seebility - Payment Successful</title>
      </Head>

      <Container>
        <Box
          mx={"auto"}
          w={"fit-content"}
          textAlign={"center"}
          mt={"10rem"}
        >
          <Text
            fontSize={"10rem"}
            color={"#0970B5"}
            w={"fit-content"}
            mx={"auto"}
          >
            <CiCircleCheck />
          </Text>
          <Heading size={"lg"} color={"#363636"}>
            Payment Successful
          </Heading>
          <Link href="/">Download Receipt</Link>

          <Button rounded={".3rem"} colorScheme="blue" w={"100%"} mt={'3rem'}>
            Done
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
