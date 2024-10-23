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

export function AdminCommandMenu() {
  const tasks = useQuery(api.tasks.get);
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
    if (value == "Dashboard") {
      router.push("/admin");
      setOpen(!open);
    } else {
      const path = value.toLowerCase();
      router.push(`/admin/${path}`);
      setOpen(!open);
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={(value) => handleSelect(value)}>
            Dashboard
          </CommandItem>
          <CommandItem onSelect={(value) => handleSelect(value)}>
            Clientele
          </CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Tasks">
          {tasks?.map(({ _id, text }) => (
            <CommandItem key={_id}>{text}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
