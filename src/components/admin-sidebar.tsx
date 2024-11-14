"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Wrench,
  Settings2,
  Codesandbox,
  BookUser,
  NotebookText,
  ChartColumn,
  Users,
  Mail,
  ChevronsRight,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
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
          url: "/admin/clientele/create",
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
      icon: Users,
      items: [
        {
          title: "View All",
          url: "/admin/students",
        },
        {
          title: "Create",
          url: "/admin/students/create",
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
      title: "Messages",
      url: "#",
      icon: Mail,
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
              <a className="text-nowrap text-center text-lg font-semibold uppercase tracking-wide">
                <ChevronsRight size={64} color="#ce2128" />
                Momentum Portal
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
