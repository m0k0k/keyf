import { auth } from "@/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { UserCard } from "@/components/components/user-card";
// import { getEditorsByUserId } from "@/lib/db/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/components/lander";
import { Header } from "@/components/header";

export default async function App() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // const editors = await getEditorsByUserId(session?.user.id);
  return (
    <div className="font-corp mx-auto max-w-4xl p-24">
      <Header />
      {session && <div>Logged in {session.user.email}</div>}
      {session && <UserCard />}
      Settings
      {/* <HeroSection /> */}
      <Link href="/app/new">New Project</Link>
      <Button>Settings</Button>
      <Button>Your subscription</Button>
      {/* <div className="flex flex-row gap-1">
        {editors.map((editor) => (
          <div
            className="flex h-24 flex-row rounded-2xl bg-neutral-900 p-1.5"
            key={editor.id}
          >
            <Link href={`/app/project/${editor.id}`}>{editor.title}</Link>
          </div>
        ))}
      </div> */}
    </div>
  );
}
