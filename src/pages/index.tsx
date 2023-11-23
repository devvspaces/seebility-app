import { Box, HStack, Heading, Center, Image, Text, Button } from "@chakra-ui/react";
import Head from "next/head";
import { FaMicrophone } from "react-icons/fa";
import styles from "@/styles/auth.module.css";
import SpeakerButton from "@/components/speaker";
import { FcGoogle } from "react-icons/fc";
import { Link } from "@chakra-ui/next-js";

export default function Home() {
  return (
    <>
      <Head>
        <title>Seebility - Sign Up</title>
      </Head>

      <Box textAlign={"center"} padding={"5rem 1rem"} bg={'var(--tertiary)'} minH={'100vh'}>
        <Heading size={'lg'} mb={3}>Sign up for a Seebility account!</Heading>
        <Text color={'#475467'}>
          Kindly provide the following details to enable us set up your account
        </Text>

        <Button leftIcon={<FcGoogle />} px={'4rem'} colorScheme={"gray"} border={'1px solid var(--primary)'} mt={'5rem'}>
          Sign up with Google
        </Button>
        <Text color={'#475467'} mt={5}>
          Already have an account? <Link color={'var(--primary)'} href={'/login'}>Login</Link>
        </Text>
      </Box>
    </>
  );
}
