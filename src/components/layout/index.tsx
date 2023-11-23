import { Box, Divider, HStack, Text } from "@chakra-ui/react";
import { FiHome, FiBell } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import styles from "./index.module.css";

export default function Layout({ children }: any) {
  return (
    <main>
      <Box className={styles.content}>{children}</Box>
      <Divider />
      <footer className={styles.footer}>
        <Box>
          <span>
            <FiHome />
          </span>
          <Text>Home</Text>
        </Box>
        <Box>
          <span>
            <HiOutlineShoppingCart />
          </span>
          <Text>Cart</Text>
        </Box>
        <Box>
          <span>
            <FiBell />
          </span>
          <Text>Notifications</Text>
        </Box>
        <Box>
          <span>
            <FaRegUserCircle />
          </span>
          <Text>Account</Text>
        </Box>
      </footer>
    </main>
  );
}
