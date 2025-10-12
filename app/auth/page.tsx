import { Google } from "@/components/components/google";
import { auth } from "@/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { UserCard } from "@/components/components/user-card";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  return (
    <div className="mx-auto flex h-dvh w-full flex-col items-center justify-center gap-4 text-xs">
      <Google />
      {session && <div>Logged in {session.user.email}</div>}
      {session && <UserCard />}
      <Link href="/">Go back</Link>
    </div>
  );
}
