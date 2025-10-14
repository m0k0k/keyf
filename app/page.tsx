"use client";
import { Lander } from "@/components/components/lander";
import { Editor } from "@/components/editor";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="font-corp">
      {/* {!session && <Editor id="1" chats={[]} initialMessages={[]} />} */}
      <Lander />
    </div>
  );
}
