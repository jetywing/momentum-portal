// "use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";

export function GitHubSignIn() {
  const { signIn } = useAuthActions();
  return (
    <Button variant={"outline"} onClick={() => void signIn("github")}>
      Sign in with GitHub
    </Button>
  );
}
