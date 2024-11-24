"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import { getStudents, getUserData } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

type User = {
  _id: Id<"users">;
  name: string;
  email: string;
  image?: string;
};

type Student = {
  _id: Id<"students">;
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

export default function UserPage({ params }: { params: { id: Id<"users"> } }) {
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
        <h2 className="text-2xl flex flex-col font-semibold">
          Associated Students
        </h2>
        <div className="flex flex-wrap gap-4">
          <Table>
            <TableCaption>currently active students</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-96">
              {students.length > 0 ? (
                students?.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>
                      <Button variant="link" asChild>
                        <Link href={`/admin/students/${student._id}`}>
                          {student.firstName} {student.lastName}
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>{student.team?.join(", ")}</TableCell>
                    <TableCell>
                      <MoreHorizontal className="mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>No associated students</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
