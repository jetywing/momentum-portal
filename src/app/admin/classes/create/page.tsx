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

import { cn, dayTimeFormat } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const formSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  description: z.string({ required_error: "Description is required" }),
  hour: z.string({ required_error: "Time is required" }),
  minute: z.string({ required_error: "Time is required" }),
  ampm: z.string({ required_error: "Time is required" }),
  duration: z.string({ required_error: "Duration is required" }),
  day: z.string({ required_error: "Day is required" }),
  season: z.string({ required_error: "Season is required" }),
  capacity: z.string({ required_error: "Capacity is required" }).max(2),
  room: z.optional(z.string({ required_error: "Room is required" })),
  type: z.optional(z.string({ required_error: "Type is required" })),
  instructor: z.optional(
    z.string({ required_error: "Instructor is required" }),
  ),
});

export default function CreateClassPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const router = useRouter();

  const staff = useQuery(api.users.staffList);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );
  const minutes = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString().padStart(2, "0"),
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    const time = Number(values.hour) * 60 + Number(values.minute);
    const ampm = values.ampm === "AM" ? 0 : 1;
    const day = Number(values.day);
    const totalMinutes = time + ampm * 720 + day;

    const durationHour = values.duration.slice(0, 1);
    const durationMinute = values.duration.slice(1, 3);
    const duration = Number(durationHour) * 60 + Number(durationMinute);

    console.log("duration:", duration);

    console.log(totalMinutes);

    await fetchMutation(api.classes.createClass, {
      name: values.name as string,
      description: values.description as string,
      time: totalMinutes as number,
      duration: duration as number,
      season: values.season as string,
      capacity: Number(values.capacity) as number,
      room: values.room as string,
      type: values.type as "team" | "rec",
      instructor: [values.instructor] as Id<"users">[],
    });

    // TODO: check for successful submission show loading spinner in button
    // before pushing to new students page.
    router.push("/admin/classes");
  }

  return (
    <>
      <Header
        breadcrumbs={[
          { title: "Dashboard", url: "/admin" },
          { title: "Classes", url: "/admin/classes" },
        ]}
        currentPage="Create"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-8 md:min-h-min">
          <h1 className="text-4xl">New Class</h1>
          <div className="py-12">
            <Card className="mx-auto max-w-4xl p-8">
              <Form {...form}>
                <form
                  className="flex w-full flex-col justify-start gap-4 "
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Name
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-4 flex-row">
                    <div>
                      <Label>
                        Time
                        <span className="text-red-600">*</span>
                      </Label>
                      <div className="flex items-center space-x-1">
                        <FormField
                          control={form.control}
                          name="hour"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="hidden">Hour</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Hr" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Hour</SelectLabel>
                                    {hours.map((h) => (
                                      <React.Fragment key={h}>
                                        <SelectItem value={h}>{h}</SelectItem>
                                      </React.Fragment>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span className="translate-y-1 h-full">:</span>
                        <FormField
                          control={form.control}
                          name="minute"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="hidden" aria-hidden>
                                Minute
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Min" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Minute</SelectLabel>
                                    {minutes.map((m) => (
                                      <React.Fragment key={m}>
                                        <SelectItem value={m}>{m}</SelectItem>
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
                          name="ampm"
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
                                    <SelectValue placeholder="AM/PM" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="AM">AM</SelectItem>
                                    <SelectItem value="PM">PM</SelectItem>
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
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Duration
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <InputOTP
                              maxLength={3}
                              pattern={REGEXP_ONLY_DIGITS}
                              {...field}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormDescription>Total class time</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Day of week</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="0">Monday</SelectItem>
                                <SelectItem value="1440">Tuesday</SelectItem>
                                <SelectItem value="2880">Wednesday</SelectItem>
                                <SelectItem value="4320">Thursday</SelectItem>
                                <SelectItem value="5760">Friday</SelectItem>
                                <SelectItem value="7200">Saturday</SelectItem>
                                <SelectItem value="8640">Sunday</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="season"
                      render={({ field }) => (
                        <FormItem className="max-w-48">
                          <FormLabel>
                            Season
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem className="max-w-48">
                          <FormLabel>
                            Capacity
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Number of students. Up to 40, probably 12.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem className="max-w-48">
                          <FormLabel>
                            Room
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="max-w-48">
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="rec">Rec</SelectItem>
                                <SelectItem value="team">Team</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Instructor</FormLabel>
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
                                  ? staff?.find(
                                      (account) => account._id === field.value,
                                    )?.name
                                  : "Select..."}
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
                                  {staff?.map((account) => (
                                    <CommandItem
                                      value={account.name}
                                      key={account._id}
                                      onSelect={() => {
                                        form.setValue(
                                          "instructor",
                                          account._id,
                                        );
                                      }}
                                    >
                                      {account.name}
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
                          Choose the instructor of this class.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
