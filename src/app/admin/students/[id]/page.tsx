"use client";

import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../../convex/_generated/dataModel";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { calcAge, dayTimeRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "../../../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { AddClassToStudentDialog } from "@/components/add-class-to-student-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RemoveFromClass } from "@/components/remove-from-class";
import { Card } from "@/components/ui/card";

function AccountLink({ userId }: { userId: Id<"users"> }) {
  const { data: user } = useQuery(
    convexQuery(api.users.getUserById, { id: userId }),
  );

  if (!user) {
    return <Skeleton className="h-4 w-20" />;
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
          <div className="flex justify-start">
            <div className="relative flex max-w-xl w-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold md:text-2xl">Classes</h2>
                <AddClassToStudentDialog studentId={params.id} />
              </div>
              <div className="flex flex-col gap-4 py-4">
                {isPending ? (
                  <Card>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </Card>
                ) : (
                  classes?.map((c) => (
                    <Card key={c?._id} className="bg-red px-4 py-2">
                      <div>
                        <Button
                          variant="link"
                          className="text-xl px-0 font-bold"
                        >
                          <Link href={`/admin/classes/${c?._id}`}>
                            {c?.name}
                          </Link>
                        </Button>
                      </div>
                      <p className="text-sm">
                        {c?.time && dayTimeRange(c.time, c.duration)}
                      </p>
                      <div>
                        <p className="text-sm">
                          Instructor:{" "}
                          {c?.instructor?.map((i) => (
                            <AccountLink key={i} userId={i} />
                          ))}
                        </p>
                      </div>
                      <div className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                c && navigator.clipboard.writeText(c?._id)
                              }
                            >
                              Copy Class ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <RemoveFromClass
                                studentId={params.id}
                                classId={c?._id}
                                className={c?.name}
                                studentName={`${student?.firstName} ${student?.lastName}`}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
