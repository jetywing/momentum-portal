"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitHubSignIn } from "./github-sign-in";
import { Separator } from "./ui/separator";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function LoginForm() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signUp" | "signIn">("signIn");
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          {step === "signIn" ? "Sign in" : "Sign up"}
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              void signIn("password", formData);
              console.log(formData);
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="text"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input name="password" id="password" type="password" required />
              <Input name="flow" type="hidden" value={step} />
            </div>
            <Button asChild className="w-full">
              <button type="submit">
                {step === "signIn" ? "Sign in" : "Sign up"}
              </button>
            </Button>
          </form>
          <Separator />
          <GitHubSignIn />
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button
            variant={"link"}
            onClick={() => {
              setStep(step === "signIn" ? "signUp" : "signIn");
            }}
          >
            {step === "signIn" ? "Sign up instead" : "Sign in instead"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
