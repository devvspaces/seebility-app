import { isBrowser } from "@/lib/utils";
import { useAuth } from "@/utils/AuthContext";
import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
  useState,
} from "react";

type WSProviderProps = { children: ReactNode };

const WSStateContext = createContext<WebSocket | null>(null);

function WSProvider({ children }: WSProviderProps): JSX.Element {
  const { state } = useAuth();
  const [count, setCount] = useState(0);
  const wsInstance = useMemo(
    () =>
      isBrowser
        ? (console.log(count), new WebSocket(`${process.env.NEXT_PUBLIC_LLM_WS_BASE_URL}/ws/chat/1/`))
        : null,
    [count]
  );

  useEffect(() => {
    if (!wsInstance) return;

    wsInstance.onopen = function (e) {
      console.log("Chat socket opened");
    };

    wsInstance.onclose = function (e) {
      console.log("Chat socket closed");
      // Try to reconnect in 5 seconds
      setTimeout(() => {
        console.log("Reconnecting...");
        setCount((count) => count + 1);
      }, 5000);
    };
    return () => {
      if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        wsInstance.close();
      }
    };
  }, [wsInstance]);

  return (
    <WSStateContext.Provider value={wsInstance}>
      {children}
    </WSStateContext.Provider>
  );
}

function useWS(): WebSocket | null {
  const context = useContext(WSStateContext);

  if (context === undefined) {
    throw new Error("useWS must be used within a WSProvider");
  }

  return context;
}

export { WSProvider, useWS };
