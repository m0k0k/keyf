"use client";

import { generateUUID } from "@/lib/utils";
import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

interface DocumentIdContextType {
  id: string;
  type: "document" | "provisional" | "shared";
  refreshDocumentID: () => void;
}

const DocumentIdContext = createContext<DocumentIdContextType | undefined>(
  undefined,
);

type DocumentId = {
  id: string;
  type: "document" | "provisional" | "shared";
};

export function DocumentIdProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const provisionalChatIdRef = useRef<string>(generateUUID());

  // Compute final id and type directly from pathname and state
  const { id, type } = useMemo<DocumentId>(() => {
    // Handle shared chat paths
    if (pathname?.startsWith("/share/")) {
      const sharedChatId = pathname.replace("/share/", "") || null;
      if (sharedChatId) {
        return {
          id: sharedChatId,
          type: "shared",
        };
      }
    }

    if (pathname === "/") {
      return {
        id: provisionalChatIdRef.current,
        type: "provisional",
      };
    }

    const urlDocumentId = pathname.replace("/edit/", "");
    if (urlDocumentId === provisionalChatIdRef.current) {
      // Id was provisional and now the url has been updated

      // Generate a new provisional id for a potential new chat
      provisionalChatIdRef.current = generateUUID();

      return {
        id: urlDocumentId,
        type: "provisional",
      };
    } else {
      return {
        id: urlDocumentId,
        type: "document",
      };
    }
  }, [pathname]);

  const refreshDocumentID = useCallback(() => {
    provisionalChatIdRef.current = generateUUID();
  }, []);

  const value = useMemo(
    () => ({
      id,
      type,
      refreshDocumentID,
    }),
    [id, type, refreshDocumentID],
  );

  return (
    <DocumentIdContext.Provider value={value}>
      {children}
    </DocumentIdContext.Provider>
  );
}

export function useDocumentId() {
  const context = useContext(DocumentIdContext);
  if (context === undefined) {
    throw new Error("useDocumentId must be used within a DocumentIdProvider");
  }
  return context;
}
