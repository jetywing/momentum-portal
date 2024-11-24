"use client";

import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { getClassesForStudent, getStudentData } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
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
import Link from "next/link";
import { dayTimeFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

type Student = {
  _id: Id<"students">;
  _creationTime: number;
  idx?: number; // Optional index
  firstName: string; // Required first name
  lastName: string; // Required last name
  image?: string; // Optional image URL
  status: boolean; // Active status (e.g., enrolled or not)
  birthday?: string; // Optional birthday (e.g., "YYYY-MM-DD" or other format)
  team?: ("mdp" | "mdp2" | "club")[]; // Optional array of team names
  classes?: Id<"classes">[]; // Optional array of class IDs
  account?: Id<"users">[]; // Optional array of account/user IDs
  isAccHolder: boolean; // Whether the student is the account holder
};

type Class = {
  _id: Id<"classes">;
  name: string;
  description?: string;
  type?: "team" | "rec";
  room?: string;
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  time: number; // Minutes since midnight
  duration: number; // Duration in minutes
  season?: string;
  capacity?: number;
  students?: Id<"students">[];
  instructor: Id<"users">[];
};

function AccountLink({ userId }: { userId: Id<"users"> }) {
  const user = useQuery(api.users.getUserById, { id: userId });

  if (!user) {
    return <span>loading...</span>;
  }

  return (
    <Link href={`/admin/clientele/${userId}`}>
      <span className="duration-150 hover:opacity-60">{user.name}</span>
    </Link>
  );
}

export default function StudentPage({
  params,
}: {
  params: { id: Id<"students"> };
}) {
  const router = useRouter();

  const [student, setStudent] = useState<Student | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch student data
        const resData = await getStudentData(params.id);
        if (!resData?.value) {
          router.push("/404"); // Redirect to a 404 page
          return;
        }
        setStudent(resData.value);

        const classData = await getClassesForStudent(params.id);
        setClasses(classData?.value || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/error"); // Redirect to a generic error page
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, router]);

  console.log(classes);

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

  if (!student) {
    notFound(); // This will render a 404 page
  }

  // const handleToast = () => {
  //   console.log("why no");
  //   toast("it work", {
  //     description: "like this?",
  //     action: {
  //       label: "log",
  //       onClick: () => console.log("wow"),
  //     },
  //   });
  // };
  //
  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Students", url: "/admin/students" },
        ]}
        currentPage={`${student.firstName} ${student.lastName}`}
      />
      <div className="flex flex-col gap-2 md:gap-16 md:flex-row">
        <div className="flex flex-row items-end gap-6 p-12">
          <Avatar className="h-32 w-32 rounded-full">
            <AvatarImage src={student?.image} alt={student?.firstName} />
            <AvatarFallback className="rounded-lg">
              <UserIcon size={64} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-semibold">
              {student.firstName} {student.lastName}
            </h1>
            <p>
              Birthday:{" "}
              {student.birthday
                ? new Date(student.birthday).toLocaleDateString()
                : "n/a"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-12">
          <h3 className="text-xl font-semibold">Account</h3>
          {student.account?.map((a) => <AccountLink key={a} userId={a} />)}
        </div>
      </div>
      <Separator className="my-12 mb-8" />
      <div className="relative flex flex-col gap-4 px-2 md:px-20">
        <h2 className="text-xl font-bold md:text-2xl">Classes</h2>
        <div className="flex flex-wrap gap-4 py-4">
          <Table>
            <TableCaption>Currently Enrolled Classes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-96">
              {classes.length > 0 ? (
                classes?.map((c) => (
                  <TableRow key={c._id} className="bg-red p-4">
                    <TableCell className="font-medium">
                      <Button variant="link" className="p-0">
                        <Link href={`/admin/classes/${c._id}`}>
                          <p>{c.name}</p>
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>{dayTimeFormat(c.time)}</TableCell>
                    <TableCell className="text-right">
                      <MoreHorizontal className="mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No classes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
