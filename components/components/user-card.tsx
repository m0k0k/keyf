"use client";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DownloadIcon } from "@/editor/icons/download-state";
export const UserCard = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="flex h-9 flex-row rounded-xl bg-neutral-900 text-neutral-900">
      <div className="flex w-full flex-row items-center justify-center gap-2">
        {/* <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <Button
          variant="link"
          className="text-neutral-900"
          onClick={handleSignOut}
        >
          Sign out
        </Button> */}
        <Button className="font-valve w-full bg-neutral-900 text-sm text-neutral-200 hover:bg-neutral-300">
          Export
          <DownloadIcon />
        </Button>
      </div>
    </div>
  );
};
