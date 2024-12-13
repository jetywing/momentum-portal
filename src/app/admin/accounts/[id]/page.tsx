"use client";

import { use } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Header } from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calcAge } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ClientPage(props: {
  params: Promise<{ id: Id<"clientele"> }>;
}) {
  const params = use(props.params);

  const { data: client, isLoading } = useQuery(
    convexQuery(api.clientele.getClientById, {
      id: params.id,
    }),
  );

  const { data: students } = useQuery({
    ...convexQuery(api.students.getStudentsByClient, {
      id: params.id,
    }),
    enabled: !!client,
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
          { title: "Accounts", url: "/admin/accounts" },
        ]}
        currentPage={`${client?.firstName} ${client?.lastName}`}
      />
      <div className="flex justify-center">
        <div className="flex max-w-7xl flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-row items-end gap-6 p-12">
            <Avatar className="h-32 w-32 rounded-full">
              <AvatarImage src={client?.image} alt={client?.firstName} />
              <AvatarFallback className="rounded-lg">
                <UserIcon size={64} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-semibold">
                {client?.firstName} {client?.lastName}
              </h1>
              <p>{client?.email}</p>
              Customer since:{" "}
              {(client?._creationTime &&
                new Date(client._creationTime).toLocaleDateString()) ||
                "Unknown"}
            </div>
          </div>
          <Separator className="my-12 mb-8" />
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl flex flex-col font-semibold">
              Associated Students
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {students?.length > 0 ? (
                students?.map((student) => (
                  <Card key={student._id} className="w-52 p-4">
                    <div className="flex justify-between py-4">
                      <Avatar className="h-16 w-16 rounded-full">
                        <AvatarImage
                          src={student?.image}
                          alt={student?.firstName}
                        />
                        <AvatarFallback className="rounded-lg">
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        {student.status ? (
                          <Badge
                            variant={"outline"}
                            className="border-green-500 text-green-500"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge className="border-red-500 text-red-500">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                      <Button variant="link" className="p-0" asChild>
                        <Link href={`/admin/students/${student._id}`}>
                          <span className="text-2xl text-wrap">
                            {student.firstName} {student.lastName}
                          </span>
                        </Link>
                      </Button>
                      <div className="py-1">
                        {student.team ? (
                          student.team.map((team) => (
                            <Badge key={team}>{team.toUpperCase()}</Badge>
                          ))
                        ) : (
                          <Badge>REC</Badge>
                        )}
                      </div>
                      <p>
                        Age:{" "}
                        {student.birthday
                          ? calcAge(student.birthday)
                          : "Unknown"}
                      </p>
                      <p>
                        Birthday:{" "}
                        {(student.birthday &&
                          new Date(student.birthday).toLocaleDateString()) ||
                          "Unknown"}
                      </p>
                    </div>
                    <div className="w-full flex justify-end">
                      <MoreHorizontal />
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="w-full p-16 flex place-content-center text-muted-foreground">
                  No associated students
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
