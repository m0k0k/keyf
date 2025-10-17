import { useContext } from "react";
import { StateInitializedContext } from "./context-provider";
import { Spinner } from "@/components/ui/spinner";

export const WaitForInitialized = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialized = useContext(StateInitializedContext);
  // if (!initialized) {
  //   return (
  //     <div className="bg-editor-starter-bg flex h-full w-full items-center justify-center rounded-2xl">
  //       <Spinner className="h-4 w-4 text-neutral-600" />
  //     </div>
  //   );
  //   return null;
  // }

  return <>{children}</>;
};
