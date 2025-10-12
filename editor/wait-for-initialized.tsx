import { useContext } from "react";
import { StateInitializedContext } from "./context-provider";

export const WaitForInitialized = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialized = useContext(StateInitializedContext);
  // if (!initialized) {
  //   return (
  //     <div className="bg-editor-starter-bg flex h-full w-full items-center justify-center rounded-2xl">
  //       Loading...
  //     </div>
  //   );
  //   return null;
  // }

  return <>{children}</>;
};
