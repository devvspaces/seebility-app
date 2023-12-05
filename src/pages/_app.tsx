import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "@/lib/themes";
import Layout from "@/components/layout";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { AuthProvider } from "@/utils/AuthContext";
import { WSProvider } from "@/components/ws";
import { Roboto, Inter } from 'next/font/google'
 
const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
})

const inter = Inter({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
})

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  let getLayout:
    | ((page: ReactElement<any, string>) => ReactNode)
    | undefined = (page: ReactNode) => <Layout>{page}</Layout>;

  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => {
      NProgress.start();
    };

    const handleStop = () => {
      NProgress.done();
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <AuthProvider>
      <style jsx global>
        {`
          :root {
            --font-main: ${roboto.style.fontFamily};
            --font-head: ${inter.style.fontFamily};
            --primary: #0970b5;
            --secondary: #66c2ff;
            --tertiary: #eff7fd;
            --bg: #f9fdff;
          }
        `}
      </style>
      <WSProvider>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </WSProvider>
    </AuthProvider>
  );
}
