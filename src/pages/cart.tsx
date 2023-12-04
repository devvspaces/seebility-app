import SpeakerButton from "@/components/speaker";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function Page() {
  return (
    <Box>
      <Head>
        <title>Seebility - Cart</title>
      </Head>

      <Container>
        <HStack
          py={"1rem"}
          justify={"space-between"}
          align={"center"}
          mb={5}
        >
          <Heading size={"lg"} color={'#363636'}>My Cart</Heading>
          <SpeakerButton />
        </HStack>

        <Stack spacing={"1rem"} mb={"2rem"}>
          <HStack p={".5rem"} bg={"#EFF7FD"} rounded={"1rem"}>
            <Box>
              <Image
                rounded={"1rem"}
                w={"80px"}
                h={"75px"}
                bgSize={"cover"}
                src="/img/cart.jpeg"
                alt="placeholder"
              />
            </Box>
            <Box>
              <Text fontSize={".8rem"} color={"#98A2B3"}>
                Apple
              </Text>
              <Text fontSize={".8rem"} mb={2}>
                Iphone 11 Black 256GB
              </Text>
              <Text color={"#0970B5"} fontSize={"1.1rem"} fontWeight={"600"}>
                $500
              </Text>
            </Box>
            <Box ml={"auto"}>
              <IconButton
                aria-label="Delete"
                icon={<DeleteIcon />}
                display={"block"}
                color={"red"}
                ml={"auto"}
                mb={3}
                variant={"ghost"}
              />
              <HStack
                spacing={"1rem"}
                bg={"#fff"}
                p={".5rem"}
                rounded={"5px"}
                fontSize={".8rem"}
              >
                <Text color={"#0970B5"}>
                  <FaMinus />
                </Text>
                <Text>2</Text>
                <Text color={"#0970B5"}>
                  <FaPlus />
                </Text>
              </HStack>
            </Box>
          </HStack>
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <HStack p={".5rem"} bg={"#EFF7FD"} rounded={"1rem"} key={i}>
                <Box>
                  <Image
                    rounded={"1rem"}
                    w={"80px"}
                    h={"75px"}
                    bgSize={"cover"}
                    src="/img/cart.jpeg"
                    alt="placeholder"
                  />
                </Box>
                <Box>
                  <Text fontSize={".8rem"} color={"#98A2B3"}>
                    Apple
                  </Text>
                  <Text fontSize={".8rem"} mb={2}>
                    Iphone 11 Black 256GB
                  </Text>
                  <Text
                    color={"#0970B5"}
                    fontSize={"1.1rem"}
                    fontWeight={"600"}
                  >
                    $500
                  </Text>
                </Box>
                <Box ml={"auto"}>
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    display={"block"}
                    color={"red"}
                    ml={"auto"}
                    mb={3}
                    variant={"ghost"}
                  />
                  <HStack
                    spacing={"1rem"}
                    bg={"#fff"}
                    p={".5rem"}
                    rounded={"5px"}
                    fontSize={".8rem"}
                  >
                    <Text color={"#0970B5"}>
                      <FaMinus />
                    </Text>
                    <Text>2</Text>
                    <Text color={"#0970B5"}>
                      <FaPlus />
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            ))}
        </Stack>

        <HStack justify={"space-between"} mt={4} mb={"2rem"}>
          <Heading fontSize={"1.2rem"}>Total</Heading>
          <Heading size={"lg"} color={"#0970B5"} fontSize={"1.3rem"}>
            $1000
          </Heading>
        </HStack>

        <Button colorScheme="blue" w={"100%"}>
          Checkout
        </Button>
      </Container>
    </Box>
  );
}
