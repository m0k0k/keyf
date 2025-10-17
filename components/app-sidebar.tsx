"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { ContextSwitcher } from "@/components/context-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "better-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePageId } from "@/providers/page-id-provider";
import { DocumentsList } from "@/components/documents-list";
import { Spinner } from "./ui/spinner";
import { Finder } from "./finder";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Home",
      url: "/app",
      icon: Frame,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
}) {
  // const { data: contexts, isLoading } = useGetAllContexts();
  // function useGetAllContexts(limit?: number) {
  //   const trpc = useTRPC();
  //   // Memoize the tRPC query options to prevent recreation
  //   const getAllContextsQueryOptions = useMemo(() => {
  //     const options = trpc.context.getAllContexts.queryOptions();
  //     return {
  //       ...options,
  //       select: limit ? (data: any[]) => data.slice(0, limit) : undefined,
  //     };
  //   }, [trpc.context.getAllContexts, limit]);

  //   // Combined query for both authenticated and anonymous chats
  //   return useQuery(getAllContextsQueryOptions);
  // }
  const trpc = useTRPC();
  const { data: contexts, isLoading } = useQuery(
    trpc.context.getAllContexts.queryOptions(),
  );

  const { id, type } = usePageId();
  const { data: documents } = useQuery(
    trpc.document.getDocumentsByUserId.queryOptions({
      userId: user.id,
    }),
  );

  const mutation = useMutation(
    trpc.document.createNewDocument.mutationOptions({}),
  );

  return (
    <>
      <Sidebar
        className="border-none p-1 pr-0"
        collapsible="offcanvas"
        {...props}
      >
        <SidebarHeader className="flex h-9 w-full flex-row items-center justify-between overflow-hidden rounded-xl border bg-black text-sm">
          <Button
            className="bg-transparent px-1.5 text-white hover:bg-transparent"
            asChild
          >
            <Link href="#">
              <Image src="/logo-black.png" alt="Keyf" width={20} height={20} />
              <span className="font-corp font-valve tracking-tight">Keyf</span>
            </Link>
          </Button>

          {contexts && !isLoading && <ContextSwitcher contexts={contexts} />}
        </SidebarHeader>
        <SidebarContent>
          <div className="flex flex-row items-center justify-between">
            <h3 className="px-1 text-xs font-semibold text-neutral-300">
              Documents
            </h3>
            <Button
              size="icon"
              variant="ghost"
              className="glassBtn p-3"
              onClick={() =>
                mutation.mutate({
                  documentId: id,
                })
              }
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Spinner /> : "+"}
            </Button>
          </div>
          {/* {documents && <pre>{JSON.stringify(documents, null, 2)}</pre>} */}
          {/* <NavMain items={data.navMain} /> */}
          {/* <NavProjects projects={data.projects} /> */}

          {/* <div className="truncate p-1 text-xs text-neutral-400">
            {id && (
              <>
                {type} - {id}{" "}
              </>
            )}
          </div> */}

          {type === "document" && <DocumentsList documents={documents || []} />}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
