import { notFound } from "next/navigation";

async function getUserData(userId: string) {
  const request = {
    path: "users:getUserById",
    args: { userId },
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

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserData(params.userId);
  console.log(user);

  if (!user) {
    notFound(); // This will render a 404 page
  }

  return (
    <div>
      <p>wow</p>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      {/* Render other user details */}
    </div>
  );
}
