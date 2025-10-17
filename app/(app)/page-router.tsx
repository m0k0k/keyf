"use client";

import { usePageId } from "@/providers/page-id-provider";
import { notFound } from "next/navigation";
import { DocumentPage } from "./video/[id]/document-page";

export function PageRouter() {
  const { id, type } = usePageId();

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
  // if (type === "provisional") {
  //   return <DocumentHome id={id} />;
  // }

  // if (type === "project") {
  //   return <ProjectPage id={id} />;
  // }

  // if (deferredType === "shared") {
  //   return <SharedChatPage id={deferredId} />;
  // }

  if (type === "document") {
    return <DocumentPage id={id} />;
  }

  return notFound();
}
