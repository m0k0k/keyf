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
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
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

  return (
    <>
      <Sidebar className="border-none p-1.5" collapsible="icon" {...props}>
        <SidebarHeader className="flex h-9 w-full flex-row items-center justify-between rounded-xl border bg-[linear-gradient(135deg,_#000_0%,_#000_30%,_#a259ff_40%,_#ff6f3c_50%,_#1fa2ff_100%)] text-sm">
          {/* <Button
            className="bg-transparent p-0 text-white hover:bg-transparent"
            asChild
          >
            <Link href="/app">
              <Image src="/logo-black.png" alt="Keyf" width={20} height={20} />
              <span className="font-corp font-valve tracking-tight">Keyf</span>
            </Link>
          </Button> */}

          {contexts && !isLoading && <ContextSwitcher contexts={contexts} />}
        </SidebarHeader>
        <SidebarContent>
          {/* <NavMain items={data.navMain} /> */}
          <NavProjects projects={data.projects} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
