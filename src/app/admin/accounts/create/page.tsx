"use client";

import { api } from "../../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Button } from "@/components/ui/button";

// Form stuff
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Id } from "../../../../../convex/_generated/dataModel";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be more than 2 letters." })
    .max(20),
  lastName: z.string().min(2).max(20),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  image: z.string().optional(),
});

export default function CreateAccountPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      image: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await fetchMutation(api.clientele.createClient, {
      firstName: values.firstName as string,
      lastName: values.lastName as string,
      email: values.email as string,
      phone: values.phone as string,
      image: values.image as string,
    });

    const id = response as Id<"clientele">;
    // TODO: check for successful submission show loading spinner in button
    // before pushing to new students page.
    router.push(`/admin/accounts/${id}`);
  }

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Clientele", url: "/admin/clientele" },
        ]}
        currentPage="Create"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-8 md:min-h-min">
          <h1 className="text-4xl">New Client</h1>
          <div className="py-12">
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
                            <Input {...field} />
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
                            <Input {...field} />
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
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
      </div>
    </>
  );
}
