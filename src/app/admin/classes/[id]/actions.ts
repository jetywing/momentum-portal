import { revalidatePath } from "next/cache";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { z } from "zod";

export async function getClassData(id: Id<"classes">) {
  const request = {
    path: "classes:getClassById",
    args: { id: id },
    format: "json",
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;

  return await res.json();
}

export async function getStudents(id: Id<"classes">) {
  const request = {
    path: "students:getStudentsByClass",
    args: { id: id },
    format: "json",
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;

  return await res.json();
}

// const FormSchema = z.object({
//   studentId: z.string({ required_error: "Student is required" }),
// });
//
// export async function addStudentToClassAction(values: z.infer<typeof FormSchema>) {
//
//   const addStudent = useMutation(api.functions.addStudentToClass);
//
//     addStudent({
//       studentId: values.studentId as Id<"students">,
//       classId: classId as Id<"classes">,
//     });
//
//     revalidatePath("/admin/classes/[id]", "page");
//   }
//
