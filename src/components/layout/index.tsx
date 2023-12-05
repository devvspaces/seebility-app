import { Box, Divider, HStack, Text } from "@chakra-ui/react";
import { FiHome, FiBell } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import styles from "./index.module.css";
import routes from "@/lib/routes";
import { useRouter } from "next/router";

export default function Layout({ children }: any) {
  const router = useRouter();
  return (
    <main>
      <Box className={styles.content}>{children}</Box>
      <Divider />
      <footer className={styles.footer}>
        <Box onClick={() => router.push(routes.home)}>
          <span>
            <FiHome />
          </span>
          <Text>Home</Text>
        </Box>
        <Box onClick={() => router.push(routes.cart)}>
          <span>
            <HiOutlineShoppingCart />
          </span>
          <Text>Cart</Text>
        </Box>
        <Box onClick={() => router.push(routes.notifications)}>
          <span>
            <FiBell />
          </span>
          <Text>Notifications</Text>
        </Box>
        <Box onClick={() => router.push(routes.account)}>
          <span>
            <FaRegUserCircle />
          </span>
          <Text>Account</Text>
        </Box>
      </footer>
    </main>
  );
}
