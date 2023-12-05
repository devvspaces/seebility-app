import { Box, Divider, HStack, Text } from "@chakra-ui/react";
import { FiHome, FiBell } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import styles from "./index.module.css";
import routes from "@/lib/routes";
import { useRouter } from "next/router";

export default function Layout({ children }: any) {
  const router = useRouter();

  function isActive(route: string) {
    const group = {
      [routes.home]: [routes.home, routes.chat],
      [routes.cart]: [routes.cart, routes.checkout],
      [routes.notifications]: [routes.notifications],
      [routes.account]: [routes.account, routes.orders],
    };

    if (group[route].includes(router.pathname)) {
      return "active";
    }
    return "";
  }

  return (
    <main>
      <Box className={styles.content}>{children}</Box>
      <Divider />
      <footer className={styles.footer}>
        <Box
          onClick={() => router.push(routes.home)}
          data-status={isActive(routes.home)}
        >
          <span>
            <FiHome />
          </span>
          <Text>Home</Text>
        </Box>
        <Box
          onClick={() => router.push(routes.cart)}
          data-status={isActive(routes.cart)}
        >
          <span>
            <HiOutlineShoppingCart />
          </span>
          <Text>Cart</Text>
        </Box>
        <Box
          onClick={() => router.push(routes.notifications)}
          data-status={isActive(routes.notifications)}
        >
          <span>
            <FiBell />
          </span>
          <Text>Notifications</Text>
        </Box>
        <Box
          onClick={() => router.push(routes.account)}
          data-status={isActive(routes.account)}
        >
          <span>
            <FaRegUserCircle />
          </span>
          <Text>Account</Text>
        </Box>
      </footer>
    </main>
  );
}
