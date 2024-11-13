import { useQuery } from "convex/react";
import { notFound } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";

async function getUserData(id: string) {
  const request = {
    path: "users:getUserById",
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

// TODO: actually implement this
interface T {}

async function getStudents(id: Array<T>) {
  const request = {
    path: "students:getStudentsByAccount",
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

export default async function UserPage({ params }: { params: { id: string } }) {
  const resData = await getUserData(params.id);
  const user = resData.value;

  const idArray = [];
  idArray.push(params.id);

  const studentsData = await getStudents(idArray);
  const students = studentsData.value;
  console.log(students);

  if (!user) {
    notFound(); // This will render a 404 page
  }

  return (
    <>
      <div className="flex flex-row items-end gap-6 p-12">
        <img className="h-20 w-20 rounded-full" alt="avatar" src={user.image} />
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-20">
        {students?.map(({ _id, firstName }) => <p key={_id}>{firstName}</p>)}
      </div>
    </>
  );
}
