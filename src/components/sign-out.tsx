"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function SignOut() {
  const { signOut } = useAuthActions();
  const router = useRouter(); // Initialize the router

  const handleSignOut = async () => {
    await signOut(); // Wait for sign out to complete
    router.push("/signin"); // Redirect to /signin
  };

  return (
    <Button
      variant={"ghost"}
      className="w-full justify-start px-2"
      onClick={handleSignOut}
    >
      <LogOut />
      Sign Out
    </Button>
  );
}
