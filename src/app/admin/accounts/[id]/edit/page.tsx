"use client";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

// Form stuff
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";
import { Card } from "@/components/ui/card";
import { fetchMutation } from "convex/nextjs";

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  image: z.string().optional(),
  status: z.boolean().optional(),
  phone: z.string().optional(),
});

export default function EditClientPage(props: {
  params: Promise<{ id: Id<"clientele"> }>;
}) {
  const params = use(props.params);

  const router = useRouter();

  const { data: client, isLoading } = useQuery(
    convexQuery(api.clientele.getClientById, {
      id: params.id,
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: client?.firstName,
      lastName: client?.lastName,
      email: client?.email,
      image: client?.image,
      phone: client?.phone,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await fetchMutation(api.clientele.editClient, {
      id: params.id,
      firstName: values.firstName || client?.firstName,
      lastName: values.lastName || client?.lastName,
      email: values.email,
      image: values.image,
      phone: values.phone,
    });
    router.push(`/admin/accounts/${params.id}`);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Accounts", url: "/admin/accounts" },
        ]}
        currentPage="Edit Client"
      />
      <div className="flex justify-center">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-5xl">
          <h1>Edit Client</h1>
          <Card className="mx-auto max-w-4xl p-8">
            <Form {...form}>
              <form
                className="flex w-full flex-col justify-start gap-4 "
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="flex w-full flex-col space-x-2 lg:flex-row">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} defaultValue={client?.firstName} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} defaultValue={client?.lastName} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} defaultValue={client?.email} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} defaultValue={client?.phone} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant={"secondary"} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}
