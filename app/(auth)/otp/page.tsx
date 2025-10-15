import { OTPForm } from "@/components/otp-form";
import Image from "next/image";

export default async function OTPPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const { email } = await searchParams;
  if (!email) {
    return <div>No email provided</div>;
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-black p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Image src="/logo-black.png" alt="logo" width={24} height={24} />
          </div>
          <span className="font-corp font-valve tracking-tight">Keyf</span>
        </a>
        <OTPForm email={email} />
      </div>
    </div>
  );
}
