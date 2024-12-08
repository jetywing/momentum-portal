"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Header } from "@/components/header";
import { useEffect, useState, use } from "react";
import { getStudents, getUserData } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calcAge } from "@/lib/utils";

type User = {
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  email: string;
  image?: string;
};

type Student = {
  _id: Id<"students">;
  _creationTime: number;
  idx?: number;
  firstName: string;
  lastName: string;
  image?: string;
  status: boolean;
  birthday?: string;
  team?: ("mdp" | "mdp2" | "club")[];
  classes?: Id<"classes">[];
  account?: Id<"users">[];
  isAccHolder: boolean;
};

export default function UserPage(props: { params: Promise<{ id: Id<"users"> }> }) {
  const params = use(props.params);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null); // Adjust type as needed
  const [students, setStudents] = useState<Student[]>([]); // Adjust type as needed
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
      <div className="flex justify-center">
        <div className="flex max-w-7xl flex-1 flex-col gap-4 p-4 pt-0">
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
              Customer since:{" "}
              {(user._creationTime &&
                new Date(user._creationTime).toLocaleDateString()) ||
                "Unknown"}
            </div>
          </div>
          <Separator className="my-12 mb-8" />
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl flex flex-col font-semibold">
              Associated Students
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {students.length > 0 ? (
                students?.map((student) => (
                  <Card key={student._id} className="w-52 p-4">
                    <div className="flex justify-between py-4">
                      <Avatar className="h-16 w-16 rounded-full">
                        <AvatarImage
                          src={student?.image}
                          alt={student?.firstName}
                        />
                        <AvatarFallback className="rounded-lg">
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {student.status ? (
                          <Badge
                            variant={"outline"}
                            className="border-green-500 text-green-500"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge className="border-red-500 text-red-500">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                      <Button variant="link" className="p-0" asChild>
                        <Link href={`/admin/students/${student._id}`}>
                          <span className="text-2xl text-wrap">
                            {student.firstName} {student.lastName}
                          </span>
                        </Link>
                      </Button>
                      <div className="py-1">
                        {student.team ? (
                          student.team.map((team) => (
                            <Badge key={team}>{team.toUpperCase()}</Badge>
                          ))
                        ) : (
                          <Badge>REC</Badge>
                        )}
                      </div>
                      <p>
                        Age:{" "}
                        {student.birthday
                          ? calcAge(student.birthday)
                          : "Unknown"}
                      </p>
                      <p>
                        Birthday:{" "}
                        {(student.birthday &&
                          new Date(student.birthday).toLocaleDateString()) ||
                          "Unknown"}
                      </p>
                    </div>
                    <div className="w-full flex justify-end">
                      <MoreHorizontal />
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="w-full p-16 flex place-content-center text-muted-foreground">
                  No associated students
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
