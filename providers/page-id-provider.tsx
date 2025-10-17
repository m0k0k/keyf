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

interface PageIdContextType {
  id: string;
  type: "document" | "provisional" | "shared" | "project" | "context" | "app";
  refreshDocumentID: () => void;
}

const PageIdContext = createContext<PageIdContextType | undefined>(undefined);

type PageId = {
  id: string;
  type: "document" | "provisional" | "shared" | "project" | "context" | "app";
};

export function PageIdProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const provisionalPageIdRef = useRef<string>(generateUUID());

  // Compute final id and type directly from pathname and state
  const { id, type } = useMemo<PageId>(() => {
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

    if (pathname === "/app") {
      return {
        id: provisionalPageIdRef.current,
        type: "provisional",
      };
    }

    if (pathname?.startsWith("/project")) {
      return {
        id: pathname.replace("/project/", ""),
        type: "project",
      };
    }
    if (pathname?.startsWith("/context")) {
      return {
        id: pathname.replace("/context/", ""),
        type: "context",
      };
    }
    if (pathname?.startsWith("/app")) {
      return {
        id: pathname.replace("/app/", ""),
        type: "app",
      };
    }

    const urlDocumentId = pathname.replace("/video/", "");
    if (urlDocumentId === provisionalPageIdRef.current) {
      // Id was provisional and now the url has been updated

      // Generate a new provisional id for a potential new chat
      provisionalPageIdRef.current = generateUUID();

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
    provisionalPageIdRef.current = generateUUID();
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
    <PageIdContext.Provider value={value}>{children}</PageIdContext.Provider>
  );
}

export function usePageId() {
  const context = useContext(PageIdContext);
  if (context === undefined) {
    throw new Error("usePageId must be used within a PageIdProvider");
  }
  return context;
}
