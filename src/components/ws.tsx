import { isBrowser } from "@/lib/utils";
import { useAuth } from "@/utils/AuthContext";
import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  ReactNode,
} from "react";

type WSProviderProps = { children: ReactNode };

const WSStateContext = createContext<WebSocket | null>(null);

function WSProvider({ children }: WSProviderProps): JSX.Element {
  const { state } = useAuth();
  const wsInstance = useMemo(
    () =>
      isBrowser
        ? new WebSocket(`${process.env.NEXT_PUBLIC_LLM_WS_BASE_URL}/ws/chat/1/`)
        : null,
    []
  );

  useEffect(() => {
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
