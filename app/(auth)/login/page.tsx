import Image from "next/image";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-black p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image src="/logo-black.png" alt="logo" width={24} height={24} />
          </div>
          <span className="font-corp font-valve tracking-tight">Keyf</span>
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
