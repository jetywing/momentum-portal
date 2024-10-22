"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const router = useRouter();
  const user = useQuery(api.functions.currentUser);
  const role = user?.roles;

  useEffect(() => {
    if (role?.includes("admin")) {
      router.push("/admin");
    } else if (!role?.includes("admin")) {
      router.push("/client");
    } else {
      router.push("/signin"); // Redirect to login if not authenticated
    }
  }, [router, role]);

  return null; // Optionally show a loading spinner  ;
}
