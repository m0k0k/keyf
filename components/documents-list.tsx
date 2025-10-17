"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { usePageId } from "@/providers/page-id-provider";
import Link from "next/link";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export function DocumentsList({ documents }: { documents: any[] }) {
  const { id, type } = usePageId();
  const [loading, setLoading] = useState<string | null>(null);
  return (
    <div>
      {documents &&
        documents.map((document) => (
          <Button
            className={clsx(
              "w-full items-center justify-start truncate rounded-md p-1 px-2 text-xs text-neutral-200 hover:bg-neutral-800",
              document.id === id ? "bg-neutral-800" : "bg-transparent",
            )}
            key={document.id}
            asChild
          >
            <Link
              href={`/video/${document.id}`}
              prefetch={false} // TODO: Restore the prefetching after solving conflict with ppr
              onClick={(e) => {
                setLoading(document.id);
                // Allow middle-click and ctrl+click to open in new tab
                if (e.button === 1 || e.ctrlKey || e.metaKey) {
                  return;
                }

                // Prevent default Link navigation for normal clicks
                e.preventDefault();

                // Use History API for client-side navigation
                window.history.pushState(null, "", `/video/${document.id}`);
              }}
            >
              <span className={cn(document.id === id && "truncate")}>
                {document.title}
              </span>
              {/* {loading && document.id !== id ? <Spinner /> : null} */}
            </Link>
          </Button>
        ))}
    </div>
  );
}
