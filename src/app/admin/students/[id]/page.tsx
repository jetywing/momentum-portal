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
import { Toaster } from "sonner";

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
      <Separator className="my-12 mb-8" />
      {classes?.map((c) => (
        <div key={c._id} className="bg-red p-4">
          <p>{c.name}</p>
        </div>
      ))}
      <Toaster />
    </>
  );
}
