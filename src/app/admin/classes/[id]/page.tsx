"use client";

import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClassData, getStudents } from "./actions";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { dayTimeFormat } from "@/lib/utils";
import { Header } from "@/components/header";

export default function ThisClassPage({
  params,
}: {
  params: { id: Id<"classes"> };
}) {
  const addStudentToClass = useMutation(api.functions.addStudentToClass);

  const handleClick = (classId: Id<"classes">) => {
    addStudentToClass({
      studentId: "k97dt8zzemx800g863pys0abmx74ecb2",
      classId: classId,
    });
  };

  const router = useRouter();

  const [thisClass, setThisClass] = useState<any>(null); // Adjust type as needed
  const [students, setStudents] = useState<any[]>([]); // Adjust type as needed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch class data
        const resData = await getClassData(params.id);
        if (!resData?.value) {
          // router.push("/404"); // Redirect to a 404 page
          return;
        }
        setThisClass(resData.value);

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

  if (!thisClass) {
    return <div>Class not found.</div>; // Fallback if the class data is missing
  }

  const dayTime = dayTimeFormat(thisClass.time);

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Classes", url: "/admin/classes" },
        ]}
        currentPage={thisClass.name}
      />
      <div className="flex flex-row items-end gap-6 p-12">
        <div>
          <h1 className="text-3xl font-semibold">{thisClass.name}</h1>
          <p>Time: {dayTime}</p>
          <p>Capacity: {thisClass.students?.length}</p>
        </div>
      </div>
      <Separator className="my-12 mb-8" />
      <div className="flex flex-col gap-4 px-20">
        <h2 className="text-xl font-bold md:text-2xl">Class List</h2>
        <Button onClick={() => handleClick(thisClass._id)}>add</Button>
        <div className="flex flex-wrap gap-4">
          {students.length > 0 ? (
            students.map(
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
                <Card key={_id} className="p-8">
                  <p key={_id}>
                    {firstName} {lastName}
                  </p>
                  <Badge key={_id}>{team}</Badge>
                </Card>
              ),
            )
          ) : (
            <p>no students</p>
          )}
        </div>
      </div>
    </>
  );
}
