"use client";
import { HeroSection } from "@/components/components/lander";
import { Editor } from "@/components/editor";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="font-corp">
      {session && <Link href="/project/1">choose project 1</Link>}
      {/* {!session && <Editor id="1" chats={[]} initialMessages={[]} />} */}
      <HeroSection />
    </div>
  );
}
