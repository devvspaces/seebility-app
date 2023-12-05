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
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

export default function Page() {
  const [paymentMethod, setPaymentMethod] = useState("1");
  return (
    <Box>
      <Head>
        <title>Seebility - Orders</title>
      </Head>

      <Container>
        <HStack justify={"space-between"} py={"1rem"} align={"center"} mb={5}>
          <Box fontSize={"1.6rem"}>
            <MdOutlineKeyboardBackspace />
          </Box>
          <SpeakerButton />
        </HStack>

        <Tabs isFitted>
          <TabList>
            <Tab>Pending Orders</Tab>
            <Tab>History</Tab>
          </TabList>

          <TabPanels bg={"#fff"}>
            <TabPanel>
              <Stack spacing={"3rem"} mb={"2rem"} pt={'1rem'}>
                <Box>
                  <Heading fontWeight={'900'} fontSize={"1rem"} mb={2} color={"#363636"}>
                    June 22, 2023
                  </Heading>
                  <Stack
                    spacing={0}
                    mb={"2rem"}
                    boxShadow={"0px 1px 0.6px 0px rgba(0, 0, 0, 0.25)"}
                    rounded={"1rem"}
                    overflow={"hidden"}
                  >
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <HStack
                          p={".5rem"}
                          bg={"#F9FDFF"}
                          key={i}
                          borderBottom={"0.5px solid #D0D5DD"}
                        >
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
                            <Text fontSize={"1rem"} color={"#98A2B3"}>
                              Apple
                            </Text>
                            <Text fontSize={"1rem"} mb={2}>
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
                        </HStack>
                      ))}
                  </Stack>
                  <Button mb={2} w={"100%"} colorScheme="blue">
                      Track Order
                  </Button>
                  <Button w={"100%"} colorScheme="blue" variant={"outline"}>
                    View Order Details
                  </Button>
                </Box>
                <Box>
                  <Heading fontWeight={'900'} fontSize={"1rem"} mb={2} color={"#363636"}>
                    June 12, 2021
                  </Heading>
                  <Stack
                    spacing={0}
                    mb={"2rem"}
                    boxShadow={"0px 1px 0.6px 0px rgba(0, 0, 0, 0.25)"}
                    rounded={"1rem"}
                    overflow={"hidden"}
                  >
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <HStack
                          p={".5rem"}
                          bg={"#F9FDFF"}
                          key={i}
                          borderBottom={"0.5px solid #D0D5DD"}
                        >
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
                            <Text fontSize={"1rem"} color={"#98A2B3"}>
                              Apple
                            </Text>
                            <Text fontSize={"1rem"} mb={2}>
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
                        </HStack>
                      ))}
                  </Stack>
                  <Button w={"100%"} colorScheme="blue">
                      Track Order
                  </Button>
                  <Button mb={2} w={"100%"} colorScheme="blue" variant={"outline"}>
                    View Order Details
                  </Button>
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing={"3rem"} mb={"2rem"} pt={'1rem'}>
                <Box>
                  <Heading fontWeight={'900'} fontSize={"1rem"} mb={2} color={"#363636"}>
                    June 12, 2021
                  </Heading>
                  <Stack
                    spacing={0}
                    mb={"2rem"}
                    boxShadow={"0px 1px 0.6px 0px rgba(0, 0, 0, 0.25)"}
                    rounded={"1rem"}
                    overflow={"hidden"}
                  >
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <HStack
                          p={".5rem"}
                          bg={"#F9FDFF"}
                          key={i}
                          borderBottom={"0.5px solid #D0D5DD"}
                        >
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
                            <Text fontSize={"1rem"} color={"#98A2B3"}>
                              Apple
                            </Text>
                            <Text fontSize={"1rem"} mb={2}>
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
                        </HStack>
                      ))}
                  </Stack>
                  <Button mb={2} w={"100%"} colorScheme="blue" variant={"outline"}>
                    View Order Details
                  </Button>
                  <Button w={"100%"} colorScheme="blue">
                    Download Receipt
                  </Button>
                </Box>
                <Box>
                  <Heading fontWeight={'900'} fontSize={"1rem"} mb={2} color={"#363636"}>
                    June 12, 2021
                  </Heading>
                  <Stack
                    spacing={0}
                    mb={"2rem"}
                    boxShadow={"0px 1px 0.6px 0px rgba(0, 0, 0, 0.25)"}
                    rounded={"1rem"}
                    overflow={"hidden"}
                  >
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <HStack
                          p={".5rem"}
                          bg={"#F9FDFF"}
                          key={i}
                          borderBottom={"0.5px solid #D0D5DD"}
                        >
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
                            <Text fontSize={"1rem"} color={"#98A2B3"}>
                              Apple
                            </Text>
                            <Text fontSize={"1rem"} mb={2}>
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
                        </HStack>
                      ))}
                  </Stack>
                  <Button mb={2} w={"100%"} colorScheme="blue" variant={"outline"}>
                    View Order Details
                  </Button>
                  <Button w={"100%"} colorScheme="blue">
                    Download Receipt
                  </Button>
                </Box>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}
