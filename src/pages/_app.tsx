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

  getLayout = Component.getLayout ?? getLayout;

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
            --font-main: Helvetica;
            --primary: #0970b5;
            --secondary: #66c2ff;
            --tertiary: #eff7fd;
            --bg: #f9fdff;
          }
        `}
      </style>
      <ChakraProvider theme={theme}>
        {
          router.pathname.startsWith("/dashboard") ? getLayout(<Component {...pageProps} />) : <Component {...pageProps} />
        }
      </ChakraProvider>
    </AuthProvider>
  );
}
