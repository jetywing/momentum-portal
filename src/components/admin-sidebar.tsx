"use client";

import * as React from "react";
import {
  BookOpen,
  Settings2,
  BookUser,
  NotebookText,
  ChartColumn,
  Users,
  Mail,
  ChevronsRight,
  Coffee,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
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
import { ThemeToggle } from "./theme-toggle";

// part of the example code, not sure what it was for
// import { title } from "process";

const data = {
  navMain: [
    {
      title: "Accounts",
      url: "/admin/accounts",
      icon: BookUser,
      isActive: true,
      items: [
        {
          title: "View All",
          url: "/admin/accounts",
        },
        {
          title: "Create",
          url: "/admin/accounts/create",
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
      ],
    },
    {
      title: "Classes",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "View All",
          url: "/admin/classes",
        },
        {
          title: "Lessons",
          url: "#",
        },
        {
          title: "Create",
          url: "/admin/classes/create",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Staff",
      url: "/admin/staff",
      icon: Coffee,
      items: [
        {
          title: "View All",
          url: "/admin/staff",
        },
        {
          title: "Create",
          url: "/admin/staff/create",
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
      title: "Messaging",
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
      url: "/admin/analytics",
      icon: ChartColumn,
      items: [
        {
          title: "Overview",
          url: "/admin/analytics",
        },
        {
          title: "Logs",
          url: "/admin/analytics/logs",
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
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
