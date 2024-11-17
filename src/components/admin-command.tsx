"use client";

import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const routes = [
  {
    name: "Dashboard",
    value: "/admin",
  },
  {
    name: "Clientele",
    value: "/admin/clientele",
  },
  {
    name: "Students",
    value: "/admin/students",
  },
  {
    name: "Classes",
    value: "/admin/classes",
  },
];

export function AdminCommandMenu() {
  const clients = useQuery(api.users.clienteleList);

  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function handleSelect(value: string) {
    router.push(value);
    setOpen(!open);
  }

  function handleClientSelect(value: string) {
    router.push(`/admin/clientele/${value}`);
    setOpen(!open);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {routes?.map((item) => {
            return (
              <CommandItem
                key={item.name}
                onSelect={() => handleSelect(item.value)}
              >
                {item.name}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandGroup heading="Clientele">
          {clients?.map(({ _id, name }) => (
            <CommandItem key={_id} onSelect={() => handleClientSelect(_id)}>
              {name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
