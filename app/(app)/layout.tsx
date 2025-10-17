import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TRPCReactProvider } from "@/trpc/react";
import { PageProviders } from "./page-providers";

export default async function DocumentLayout({
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
    <>
      <div className="root">
        <TRPCReactProvider>
          <PageProviders user={user}>
            <SidebarProvider>
              <AppSidebar user={user} />
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
          </PageProviders>
        </TRPCReactProvider>
      </div>
    </>
  );
}
