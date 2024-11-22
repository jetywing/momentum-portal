import { Id } from "../../../../../convex/_generated/dataModel";

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
