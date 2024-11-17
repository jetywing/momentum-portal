"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { minToTimeFormat } from "@/lib/utils";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

function InstructorCell({ instructorId }: { instructorId: Id<"users"> }) {
  const instructor = useQuery(api.users.getUserById, { id: instructorId });

  if (!instructor) {
    return <span>loading...</span>;
  }

  return (
    <Link
      className="duration-150 hover:opacity-60"
      href={`/admin/clientele/${instructor._id}`}
    >
      {instructor.name}
    </Link>
  );
}

// const DeleteButton = ({ rowId }: { rowId: Id<"tasks"> }) => {
//   const deleteRow = useMutation(api.tasks.deleteTask);
//
//   const handleDelete = () => {
//     deleteRow({ id: rowId })
//       .then(() => {
//         console.log(`Row ${rowId} deleted`);
//       })
//       .catch((error) => {
//         console.error("Failed to delete row:", error);
//       });
//   };
//
//   return <button onClick={handleDelete}>Delete</button>;
// };

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Classes = {
  _id: string;
  name: string;
  description?: string;
  type?: string;
  capacity?: number;
  room?: string;
  time: number; // Assuming it's a UTC timestamp or similar
  duration: number; // Duration in minutes or another unit
  season?: string;
  students?: string[]; // Array of `students` IDs as strings
  instructor: Id<"users">[]; // Array of `users` IDs as strings
};
export const columns: ColumnDef<Classes>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const thisClass = row.original;
      return (
        <Button variant={"ghost"} className="px-2 py-1" asChild>
          <Link href={"/admin/classes/" + thisClass._id}>{thisClass.name}</Link>
        </Button>
      );
    },
  },
  {
    id: "capacity",
    header: "Capacity",
    cell: ({ row }) => {
      const classItem = row.original;
      const studentCount = classItem.students?.length;
      return `${studentCount}/${classItem.capacity}`;
    },
  },
  {
    accessorKey: "day",
    header: "Day",
  },
  {
    id: "time",
    header: "Time",
    accessorFn: (row) => {
      const minutes = row.time;
      const timeFormat = minToTimeFormat(minutes);
      return timeFormat;
    },
  },
  {
    id: "duration",
    header: "Duration",
    accessorFn: (row) => `${row.duration} min`,
  },
  {
    id: "instructor",
    header: "Instructor",
    cell: ({ row }) => {
      const instructor = row.original.instructor;
      return instructor.map((instructor) => (
        <InstructorCell key={instructor} instructorId={instructor} />
      ));
    },
  },
  {
    accessorKey: "room",
    header: "Room",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const classItem = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(classItem._id)}
            >
              Copy Class ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
