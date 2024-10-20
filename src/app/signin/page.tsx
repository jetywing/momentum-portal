"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignIn } from "@/components/sign-in";

export default function LogIn() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <ThemeToggle />
        <SignIn />
      </div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Button>Useless Button</Button>
      </main>
    </div>
  );
}
