"use client";

import { WithSkeleton } from "@/components/ui/skeleton";
import { useDocumentId } from "@/providers/document-id-provider";
import { useDeferredValue } from "react";

import { notFound } from "next/navigation";

import { EditPage } from "./edit-page";
import { EditHome } from "../../edit-home";

export function DeferredEditPage() {
  const { id, type } = useDocumentId();

  const { id: deferredId, type: deferredType } = useDeferredValue({
    id,
    type,
  });

  if (!id) {
    return notFound();
  }

  // Show skeleton when deferred values don't match current values
  // if (deferredId !== id) {
  //   return (
  //     <div className="flex h-dvh w-full">
  //       <WithSkeleton isLoading={true} className="h-full w-full">
  //         <div className="flex h-dvh w-full" />
  //       </WithSkeleton>
  //     </div>
  //   );
  // }

  // Render appropriate page based on type
  if (deferredType === "provisional") {
    return <EditHome id={deferredId} />;
  }

  // if (deferredType === "shared") {
  //   return <SharedChatPage id={deferredId} />;
  // }

  if (deferredType === "document") {
    return <EditPage id={deferredId} />;
  }

  return notFound();
}
