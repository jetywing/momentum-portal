import { notFound } from "next/navigation";

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

export default async function UserPage({ params }: { params: { id: string } }) {
  const resData = await getUserData(params.id);
  const user = resData.value;
  console.log(user);

  if (!user) {
    notFound(); // This will render a 404 page
  }

  return (
    <div className="flex flex-row p-12 items-end gap-6">
      <img className="w-20 h-20 rounded-full" alt="avatar" src={user.image} />
      <div>
        <h1 className="text-3xl font-semibold">{user.name}</h1>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
