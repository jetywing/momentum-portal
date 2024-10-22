"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Frame,
  Wrench,
  Map,
  PieChart,
  Settings2,
  Codesandbox,
  MessageSquare,
  BookUser,
  NotebookText,
  ChartColumn,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// part of the example code, not sure what it was for
// import { title } from "process";

const data = {
  teams: [
    {
      name: "Admin",
      logo: Wrench,
      plan: "Admin",
    },
    {
      name: "Client",
      logo: AudioWaveform,
      plan: "Client",
    },
  ],
  navMain: [
    {
      title: "Clientele",
      url: "/admin/clientele",
      icon: BookUser,
      isActive: true,
      items: [
        {
          title: "View All",
          url: "/admin/clientele",
        },
        {
          title: "Create",
          url: "/admin/create",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Students",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "View All",
          url: "#",
        },
        {
          title: "Create",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Classes",
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
      title: "Billing",
      url: "#",
      icon: NotebookText,
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
      title: "Communications",
      url: "#",
      icon: MessageSquare,
      items: [
        {
          title: "Email",
          url: "#",
        },
        {
          title: "Text",
          url: "#",
        },
        {
          title: "Chat",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Analytics",
      url: "#",
      icon: ChartColumn,
      items: [
        {
          title: "Email",
          url: "#",
        },
        {
          title: "Text",
          url: "#",
        },
        {
          title: "Chat",
          url: "#",
        },
        {
          title: "Limits",
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
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a className="text-lg uppercase font-semibold tracking-wide text-center">
                <Codesandbox />
                Momentum Portal
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
