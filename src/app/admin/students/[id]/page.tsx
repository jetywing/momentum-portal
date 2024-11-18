"use client";

import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { getStudentData } from "./actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

export default function StudentPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [student, setStudent] = useState<any[]>([]); // Adjust type as needed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch class data
        const resData = await getStudentData(params.id);
        if (!resData?.value) {
          // router.push("/404"); // Redirect to a 404 page
          return;
        }
        setStudent(resData.value);

        // Fetch associated students
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

  if (!student) {
    notFound(); // This will render a 404 page
  }

  const birthday = new Date(student.birthday);
  const formattedBirthday = birthday.toLocaleDateString();

  const handleToast = () => {
    console.log("why no");
    toast("it work", {
      description: "like this?",
      action: {
        label: "log",
        onClick: () => console.log("wow"),
      },
    });
  };

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
          <AvatarImage src={student?.image} alt={student?.name} />
          <AvatarFallback className="rounded-lg">
            <UserIcon size={64} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-semibold">
            {student.firstName} {student.lastName}
          </h1>
          <p>Birthday: {formattedBirthday}</p>
        </div>
      </div>
      <Separator className="my-12 mb-8" />
      <div>
        <Button variant={"outline"} onClick={() => handleToast()}>
          TOAST
        </Button>
      </div>
      <Toaster />
    </>
  );
}
