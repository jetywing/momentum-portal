import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenCheck, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function AddClassToStudentDialog({
  studentId,
}: {
  studentId: Id<"students">;
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <BookOpenCheck /> Add Class
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
            <DialogDescription>The more the merrier.</DialogDescription>
          </DialogHeader>
          <AddClassForm studentId={studentId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <BookOpenCheck /> Add Class
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Class</DrawerTitle>
          <DrawerDescription>The more the merrier.</DrawerDescription>
        </DrawerHeader>
        <AddClassForm studentId={studentId} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const FormSchema = z.object({
  classId: z.string({ required_error: "Class selection is required" }),
});

function AddClassForm({ studentId }: { studentId: Id<"students"> }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const availableClasses = useQuery(api.classes.getAvailableClasses, {
    id: studentId as Id<"students">,
  });

  const addStudent = useMutation(api.functions.addStudentToClass);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const newStudent = await addStudent({
      studentId: studentId as Id<"students">,
      classId: values.classId as Id<"classes">,
    });

    if (!newStudent) {
      return;
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-4 md:px-0"
      >
        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Student</FormLabel>
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
                        ? availableClasses?.find((c) => c?._id === field.value)
                            ?.name
                        : "Select a class..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search students..." />
                    <CommandList>
                      <CommandEmpty>No classes found.</CommandEmpty>
                      <CommandGroup>
                        {availableClasses?.map((c) => (
                          <CommandItem
                            value={c?.name}
                            key={c?._id}
                            onSelect={() => {
                              form.setValue("classId", c?._id);
                              document.dispatchEvent(
                                new KeyboardEvent("keydown", {
                                  key: "Escape",
                                  keyCode: 27,
                                  code: "Escape",
                                  bubbles: true,
                                  cancelable: true,
                                }),
                              );
                            }}
                          >
                            {c?.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                c?._id === field.value
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
                Choose from this list of currently available classes.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          onClick={() =>
            document.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "Escape",
                keyCode: 27,
                code: "Escape",
                bubbles: true,
                cancelable: true,
              }),
            )
          }
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
