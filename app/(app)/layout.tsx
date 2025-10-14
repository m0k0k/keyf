import { Header } from "@/components/header";
import Link from "next/link";
import Image from "next/image";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getContextsByUserId } from "@/lib/db/queries";
import { trpc } from "@/trpc/server";
import { useSuspenseQuery } from "@tanstack/react-query";

export default async function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/auth");
  }
  const user = session.user;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        {/* <div className="flex h-dvh w-full flex-row items-center gap-1 p-1.5">
      <div className="flex h-full flex-col items-center gap-1">
        <div className="flex h-9 w-full max-w-[190px] flex-row items-center gap-0.5 rounded-xl border bg-[linear-gradient(135deg,_#000_0%,_#000_30%,_#a259ff_40%,_#ff6f3c_50%,_#1fa2ff_100%)] p-1 px-3 text-sm">

          <Image src="/logo-black.png" alt="Keyf" width={20} height={20} />
          <Link href="/context" className="font-corp font-valve tracking-tight">
            Keyf
          </Link>
        </div>

        <div className="bg-editor-starter-panel flex h-full w-[190px] flex-row items-center gap-1 rounded-3xl"></div>
      </div>
      {children}
    </div> */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
