"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Id } from "../../../../../convex/_generated/dataModel";
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

import { months, days, years } from "../../../../data/datetimes";

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
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Must be more than 2 letters." })
    .max(20),
  lastName: z.string().min(2).max(20),
  month: z.string().min(2),
  day: z.string().min(2),
  year: z.string().min(2),
  account: z.string().min(2),
});

export default function CreateStudentPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      month: "",
      day: "",
      year: "",
      account: "",
    },
  });

  const router = useRouter();

  const accounts = useQuery(api.clientele.getClientele);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const birthday = `${values.year}-${values.month}-${values.day}T00:00:00Z`;

    const response = await fetchMutation(api.students.createStudent, {
      firstName: values.firstName as string,
      lastName: values.lastName as string,
      birthday: birthday as string,
      account: values.account as Id<"clientele">,
    });

    const id = response as Id<"students">;

    // TODO: check for successful submission show loading spinner in button
    // before pushing to new students page.
    router.push(`/admin/students/${id}`);
  }

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Students", url: "/admin/students" },
        ]}
        currentPage="Create"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-8 md:min-h-min">
          <h1 className="text-4xl">New Student</h1>
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
                                      value={`${account.firstName} ${account.lastName}`}
                                      key={account._id}
                                      onSelect={() => {
                                        form.setValue("account", account._id);
                                      }}
                                    >
                                      {account.firstName} {account.lastName}
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
      </div>
    </>
  );
}
