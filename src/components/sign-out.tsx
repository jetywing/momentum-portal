"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation"; // Import the useRouter hook

export function SignOut() {
  const { signOut } = useAuthActions();
  const router = useRouter(); // Initialize the router

  const handleSignOut = async () => {
    await signOut(); // Wait for sign out to complete
    router.push("/signin"); // Redirect to /signin
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
