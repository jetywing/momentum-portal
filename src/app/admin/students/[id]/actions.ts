export async function getStudentData(id: string) {
  const request = {
    path: "students:getStudentById",
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

// async function getStudents(id: Array<T>) {
//   const request = {
//     path: "users",
//     args: { id: id },
//     format: "json",
//   };
//   const res = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
//     method: "POST",
//     body: JSON.stringify(request),
//     headers: { "Content-Type": "application/json" },
//   });
//
//   if (!res.ok) return null;
//
//   return await res.json();
// }
