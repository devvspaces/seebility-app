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
import { FaChevronRight } from "react-icons/fa";

export default function Page() {
  return (
    <Box>
      <Head>
        <title>Seebility - Account</title>
      </Head>

      <Container>
        <HStack py={"1rem"} justify={"space-between"} align={"center"} mb={4}>
          <Heading size={"lg"} color={"#363636"}>
            Profile
          </Heading>
          <SpeakerButton />
        </HStack>
      </Container>

      <Box height={'calc(100vh - 15rem)'} mb={'-1rem'} bg={'#fff'} boxShadow={'0px 0px 4.9px 0px rgba(0, 0, 0, 0.20);'} pos={'relative'} pt={'10rem'} mt={'8rem'}>
        <Box textAlign={'center'} pos={'absolute'} top={'-4.5rem'} left={'50%'} transform={'translateX(-50%)'}>
          <Image mb={4} src="/img/profile.jpeg" alt="profile" w={'120px'} h={'120px'} rounded={'full'} display={'block'} mx={'auto'} />
          <Text mb={2} fontSize={'1.1rem'}>Akin TheGreat</Text>
          <Button colorScheme="blue">View Full Profile</Button>
        </Box>

        <Stack>
          <HStack justify={'space-between'} px={'1rem'} py={'.5rem'}>
            <Text>My Orders</Text>
            <span>
              <FaChevronRight />
            </span>
          </HStack>
          <Divider />
          <HStack justify={'space-between'} px={'1rem'} py={'.5rem'}>
            <Text>Promocodes</Text>
            <span>
              <FaChevronRight />
            </span>
          </HStack>
          <Divider />
          <HStack justify={'space-between'} px={'1rem'} py={'.5rem'}>
            <Text>My Orders</Text>
            <span>
              <FaChevronRight />
            </span>
          </HStack>
          <Divider />
          <HStack justify={'space-between'} px={'1rem'} py={'.5rem'}>
            <Text>My Orders</Text>
            <span>
              <FaChevronRight />
            </span>
          </HStack>
          <Divider />
          <HStack justify={'space-between'} px={'1rem'} py={'.5rem'}>
            <Text>My Orders</Text>
            <span>
              <FaChevronRight />
            </span>
          </HStack>
          <Divider />
        </Stack>
      </Box>
    </Box>
  );
}
