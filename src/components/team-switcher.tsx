"use client";

import * as React from "react";
import { ChevronsUpDown, Wrench } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const currentUser = useQuery(api.functions.currentUser);

  const roles = currentUser?.roles;

  function handleClick(role: string) {
    router.push(`/${role}`);
  }

  // TODO: hook in functionality to switch routes based on selection
  // extra points to only show active roles per account.
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="size-8 flex aspect-square items-center justify-center rounded-lg bg-black text-sidebar-primary-foreground">
                <Wrench className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Admin</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Role
            </DropdownMenuLabel>
            {roles?.map((role) => (
              <DropdownMenuItem key={role} onClick={() => handleClick(role)}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
