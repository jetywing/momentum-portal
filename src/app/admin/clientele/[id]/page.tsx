"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { getStudents, getUserData } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function UserPage({ params }: { params: { id: Id<"users"> } }) {
  const router = useRouter();

  const [user, setUser] = useState<any>(null); // Adjust type as needed
  const [students, setStudents] = useState<any[]>([]); // Adjust type as needed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch class data
        const resData = await getUserData(params.id);
        if (!resData?.value) {
          // router.push("/404"); // Redirect to a 404 page
          return;
        }
        setUser(resData.value);

        // Fetch associated students
        const studentsData = await getStudents([params.id]);
        setStudents(studentsData?.value || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/error"); // Redirect to a generic error page
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center space-x-4 p-20">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!user) {
    notFound(); // This will render a 404 page
  }

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Clientele", url: "/admin/clientele" },
        ]}
        currentPage={user.name}
      />
      <div className="flex flex-row items-end gap-6 p-12">
        <Avatar className="h-32 w-32 rounded-full">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback className="rounded-lg">
            <UserIcon size={64} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p>{user.email}</p>
        </div>
      </div>
      <Separator className="my-12 mb-8" />
      <div className="flex flex-col gap-4 px-20">
        <div className="flex flex-wrap gap-4">
          {students?.map(
            ({
              _id,
              firstName,
              lastName,
              team,
            }: {
              _id: Id<"students">;
              firstName: string;
              lastName: string;
              team: string[];
            }) => (
              <Link key={_id} href={`/admin/students/${_id}`}>
                <Card className="p-8 duration-150 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <p key={_id}>
                    {firstName} {lastName}
                  </p>
                  <Badge key={_id}>{team}</Badge>
                </Card>
              </Link>
            ),
          )}
        </div>
      </div>
    </>
  );
}
