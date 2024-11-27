"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Id } from "../../../../../convex/_generated/dataModel";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type logs = {
  _id: Id<"logs">;
  _creationTime: number;
  message: string;
  userId?: Id<"users">;
  studentId?: Id<"students">;
  classId?: Id<"classes">;
};

export const columns: ColumnDef<logs>[] = [
  {
    accessorKey: "message",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-1 font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Log
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "_creationTime",
    accessorFn: (row) => new Date(row._creationTime).toLocaleString(),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-1 font-mono"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];
