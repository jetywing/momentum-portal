import { notFound } from "next/navigation";

async function getStudentData(id: string) {
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

export default async function StudentPage({
  params,
}: {
  params: { id: string };
}) {
  const resData = await getStudentData(params.id);
  const student = resData.value;

  const fullName = `${student.firstName} ${student.lastName}`;

  const idArray = [];
  idArray.push(params.id);

  // const studentsData = await getStudents(idArray);
  // const students = studentsData.value;
  // console.log(students);

  if (!student) {
    notFound(); // This will render a 404 page
  }

  return (
    <>
      <div className="flex flex-row items-end gap-6 p-12">
        <img
          className="h-20 w-20 rounded-full"
          alt="avatar"
          src={student.image}
        />
        <div>
          <h1 className="text-3xl font-semibold">{fullName}</h1>
        </div>
      </div>
      {/* <div className="flex flex-col gap-4 px-20"> */}
      {/*   {students?.map(({ _id, firstName }) => <p key={_id}>{firstName}</p>)} */}
      {/* </div> */}
    </>
  );
}
