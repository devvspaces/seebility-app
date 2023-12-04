import SpeakerButton from "@/components/speaker";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  HStack,
  Heading,
  IconButton,
  Image,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { FaApple, FaMinus, FaPlus } from "react-icons/fa";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useState } from "react";
import { RiVisaLine } from "react-icons/ri";
import { SiMastercard } from "react-icons/si";

export default function Page() {
  const [paymentMethod, setPaymentMethod] = useState("1");
  return (
    <Box>
      <Head>
        <title>Seebility - Checkout</title>
      </Head>

      <Container>
        <HStack py={"1rem"} align={"center"} mb={5}>
          <Box fontSize={"1.6rem"}>
            <MdOutlineKeyboardBackspace />
          </Box>
          <Heading ml={4} size={"lg"} color={"#363636"}>
            Checkout
          </Heading>
        </HStack>

        <Stack
          boxShadow={"0px 1px 1px 0px rgba(0, 0, 0, 0.11);"}
          spacing={"1rem"}
          p={"1rem"}
          rounded={"md"}
          mb={"2rem"}
          bg={"#fff"}
        >
          <HStack justify={"space-between"}>
            <Text>Sub total (3 items)</Text>
            <Text>$500</Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Text>Delivery Fee</Text>
            <Text>$500</Text>
          </HStack>

          <HStack justify={"space-between"}>
            <Text>Service Fee</Text>
            <Text>$500</Text>
          </HStack>

          <HStack justify={"space-between"} mt={3} fontWeight={"bold"}>
            <Text>Total</Text>
            <Text>$500</Text>
          </HStack>
        </Stack>

        <Heading size={"sm"} ml={4} mb={4}>
          Payment Method
        </Heading>
        <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
          <Stack
            boxShadow={"0px 1px 1px 0px rgba(0, 0, 0, 0.11);"}
            rounded={"md"}
            mb={"2rem"}
            bg={"#fff"}
          >
            <HStack
              justify={"space-between"}
              p={"1rem"}
              py={".8rem"}
              onClick={() => setPaymentMethod("1")}
            >
              <HStack align={"center"}>
                <span>
                  <FaApple />
                </span>
                <Text>Apple Pay</Text>
              </HStack>
              <Radio value="1" />
            </HStack>
            <Divider />
            <HStack
              justify={"space-between"}
              p={"1rem"}
              py={".8rem"}
              onClick={() => setPaymentMethod("2")}
            >
              <HStack align={"center"}>
                <span>
                  <RiVisaLine />
                </span>
                <Text>Visa</Text>
              </HStack>
              <Radio value="2" />
            </HStack>
            <Divider />
            <HStack
              justify={"space-between"}
              p={"1rem"}
              py={".8rem"}
              onClick={() => setPaymentMethod("3")}
            >
              <HStack align={"center"}>
                <span>
                  <SiMastercard />
                </span>
                <Text>MasterCard</Text>
              </HStack>
              <Radio value="3" />
            </HStack>
          </Stack>
        </RadioGroup>

        <Button colorScheme="blue" w={"100%"} rounded={".2rem"}>
          Proceed to Checkout
        </Button>
      </Container>
    </Box>
  );
}
