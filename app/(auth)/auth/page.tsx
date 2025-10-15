import Link from "next/link";
import { Google } from "@/components/components/google";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-black p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image src="/logo-black.png" alt="logo" width={24} height={24} />
          </div>
          <span className="font-corp font-valve tracking-tight">Keyf</span>
        </a>
        <div className="flex w-full flex-col gap-3">
          {/* Continue with Google button */}
          <Google />
          {/* Continue with Email button */}

          <Button variant="secondary" asChild>
            <Link href="/login"> Continue with Email</Link>
          </Button>
        </div>
        <div className="mt-4 w-full text-center">
          <Link
            href="/signup"
            className="text-xs font-medium text-neutral-300 underline underline-offset-2 transition hover:text-white"
          >
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
}
