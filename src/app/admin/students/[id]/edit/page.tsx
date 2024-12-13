"use client";

import { use } from "react";
import { Header } from "@/components/header";
import { api } from "../../../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { months, days, years } from "../../../../../data/datetimes";

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
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be more than 2 letters." })
    .max(20)
    .optional(),
  lastName: z.string().min(2).max(20).optional(),
  month: z.string().optional(),
  day: z.string().optional(),
  year: z.string().optional(),
  account: z.string().optional(),
});

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: Id<"students"> }>;
}) {
  const paramObj = use(params);
  const id = paramObj.id;

  const { data: student } = useQuery(
    convexQuery(api.students.getStudentById, {
      id: id,
    }),
  );

  const { data: accounts } = useQuery(
    convexQuery(api.clientele.getClientele, {}),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: student?.firstName,
      lastName: student?.lastName,
      month: "",
      day: "",
      year: "",
      account: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const birthday = values.year
      ? `${values.year}-${values.month}-${values.day}T00:00:00Z`
      : student?.birthday;

    if (values.account) {
      const returnedAccount = [values.account] as Id<"clientele">[];
      await fetchMutation(api.students.editStudent, {
        id: id as Id<"students">,
        firstName: values.firstName || student?.firstName,
        lastName: values.lastName || student?.lastName,
        birthday: birthday,
        account: returnedAccount,
      });
      // TODO: check for successful submission show loading spinner in button
      // before pushing to new students page.
      router.push(`/admin/students/${id}`);
    } else if (!values.account) {
      await fetchMutation(api.students.editStudent, {
        id: id as Id<"students">,
        firstName: values.firstName || student?.firstName,
        lastName: values.lastName || student?.lastName,
        birthday: birthday,
      });
      // TODO: check for successful submission show loading spinner in button
      // before pushing to new students page.
      router.push(`/admin/students/${id}`);
    }
  }

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Students", url: "/admin/students" },
          {
            title: `${student?.firstName} ${student?.lastName}`,
            url: `/admin/students/${id}`,
          },
        ]}
        currentPage="Edit"
      />
      <div className="flex justify-center">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-w-5xl">
          <h1>Edit Student</h1>
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
                          <Input {...field} defaultValue={student?.firstName} />
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
                          <Input {...field} defaultValue={student?.lastName} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <Label>Birthday</Label>
                  <div className="flex space-x-1">
                    <FormField
                      control={form.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden">Month</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Month</SelectLabel>
                                {months.map((m) => (
                                  <React.Fragment key={m.value}>
                                    <SelectItem value={m.value}>
                                      {m.month}
                                    </SelectItem>
                                  </React.Fragment>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden" aria-hidden>
                            Day
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Day" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Day</SelectLabel>
                                {days.map((d) => (
                                  <React.Fragment key={d.value}>
                                    <SelectItem value={d.value}>
                                      {d.day}
                                    </SelectItem>
                                  </React.Fragment>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="hidden" aria-hidden>
                            Year
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Year</SelectLabel>
                                {years.map((y) => (
                                  <React.Fragment key={y.value}>
                                    <SelectItem value={y.value}>
                                      {y.year}
                                    </SelectItem>
                                  </React.Fragment>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Account</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? accounts?.find(
                                    (account) => account._id === field.value,
                                  )?.firstName
                                : "Select account"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search accounts..." />
                            <CommandList>
                              <CommandEmpty>No account found.</CommandEmpty>
                              <CommandGroup>
                                {accounts?.map((account) => (
                                  <CommandItem
                                    value={account.firstName}
                                    key={account._id}
                                    onSelect={() => {
                                      form.setValue("account", account._id);
                                    }}
                                  >
                                    {account.firstName}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        account._id === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Choose the parent/guardian of this student.
                      </FormDescription>
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
