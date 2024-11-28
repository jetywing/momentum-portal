"use client";

import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { calcAge, dayTimeFormat } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "../../../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

function AccountLink({ userId }: { userId: Id<"users"> }) {
  const { data: user } = useQuery(
    convexQuery(api.users.getUserById, { id: userId }),
  );

  if (!user) {
    return <span>loading...</span>;
  }

  return (
    <Link href={`/admin/clientele/${userId}`}>
      <span className="duration-150 hover:opacity-60">{user.name}</span>
    </Link>
  );
}

export default function StudentPage({
  params,
}: {
  params: { id: Id<"students"> };
}) {
  const { data: student, isLoading } = useQuery(
    convexQuery(api.students.getStudentById, {
      id: params.id,
    }),
  );

  const { data: classes, isPending } = useQuery({
    ...convexQuery(api.classes.getClassesByStudent, {
      id: params.id,
    }),
    enabled: !!student,
  });

  if (isLoading) {
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

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Students", url: "/admin/students" },
        ]}
        currentPage={`${student?.firstName} ${student?.lastName}`}
      />
      <div className="flex justify-center">
        <div className="flex max-w-7xl flex-1 flex-col gap-4 p-4 py-8">
          <div className="flex justify-between flex-col gap-2 md:gap-16 px-4 md:flex-row">
            <div className="flex flex-row items-end gap-6 p-2">
              <Avatar className="h-32 w-32 rounded-full">
                <AvatarImage src={student?.image} alt={student?.firstName} />
                <AvatarFallback className="rounded-lg">
                  <UserIcon size={64} />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-semibold">
                  {student?.firstName} {student?.lastName}
                </h1>
                <p>
                  Birthday:{" "}
                  {student?.birthday
                    ? new Date(student.birthday).toLocaleDateString()
                    : "n/a"}
                </p>
                <p>
                  Age: {student?.birthday ? calcAge(student.birthday) : "?"}
                </p>
                <div className="flex gap-2 py-2">
                  {student?.team?.map((t) => (
                    <Badge key={t}>{t.toUpperCase()}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <Card className="flex flex-col gap-4 py-6 px-8">
              <h3 className="text-xl font-semibold">Account</h3>
              {student?.account?.map((a) => <AccountLink key={a} userId={a} />)}
            </Card>
          </div>
          <Separator className="my-12 mb-8" />
          <div className="relative flex flex-col gap-4">
            <h2 className="text-xl font-bold md:text-2xl">Classes</h2>
            <div className="flex flex-wrap gap-4 py-4">
              <Table>
                <TableCaption>Currently Enrolled Classes</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="min-h-96">
                  {isPending ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : (
                    classes?.map((c) => (
                      <TableRow key={c?._id} className="bg-red p-4">
                        <TableCell className="font-medium">
                          <Button variant="link" className="p-0">
                            <Link href={`/admin/classes/${c?._id}`}>
                              <p>{c?.name}</p>
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell>
                          {c?.time && dayTimeFormat(c.time)}
                        </TableCell>
                        <TableCell className="text-right">
                          <MoreHorizontal className="mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
