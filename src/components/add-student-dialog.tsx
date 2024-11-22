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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { UserPlus } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

export function AddStudentDialog({ classId }: { classId: Id<"classes"> }) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <UserPlus />
            Add Student
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
            <DialogDescription>
              Choose someone to add to this classlist
            </DialogDescription>
          </DialogHeader>
          <AddStudentForm classId={classId} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <UserPlus />
          Add Student
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Choose someone to add to this classlist
          </DrawerDescription>
        </DrawerHeader>
        <AddStudentForm classId={classId} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function AddStudentForm({ classId }: { classId: Id<"classes"> }) {
  const { pending } = useFormStatus();

  const router = useRouter();

  const students = useQuery(api.students.getAllStudents);
  console.log(students);

  const addStudent = useMutation(api.functions.addStudentToClass);

  async function handleSubmit(formData: FormData) {
    addStudent({
      studentId: formData.get("studentId") as Id<"students">,
      classId: classId as Id<"classes">,
    });

    router.refresh();
  }

  return (
    <form
      action={handleSubmit}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
      className={cn("grid items-start gap-4 px-4 md:px-0")}
    >
      <div className="grid gap-2">
        <Label>Student</Label>
        <Input name="studentId" />
      </div>
      <Button disabled={pending}>Save changes</Button>
    </form>
  );
}
