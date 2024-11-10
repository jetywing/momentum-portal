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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const DeleteButton = ({ rowId }: { rowId: Id<"tasks"> }) => {
  const deleteRow = useMutation(api.tasks.deleteTask);

  const handleDelete = () => {
    deleteRow({ id: rowId })
      .then(() => {
        console.log(`Row ${rowId} deleted`);
      })
      .catch((error) => {
        console.error("Failed to delete row:", error);
      });
  };

  return <button onClick={handleDelete}>Delete</button>;
};

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Tasks = {
  _id: string;
  isCompleted: boolean;
  text: string;
  due: string;
  userId: string;
};

export const columns: ColumnDef<Tasks>[] = [
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
    accessorKey: "isCompleted",
    header: "Status",
  },
  {
    accessorKey: "text",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tasks
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "due",
    header: "Due",
    cell: ({ row }) => {
      const rowData = row.original;
      if (rowData.due) {
        const date = new Date(rowData.due);
        const formattedDate = date.toLocaleString();
        return formattedDate;
      }
      if (!rowData.due) {
        return "anytime";
      }
    },
  },
  {
    accessorKey: "userId",
    header: "Assigned",
    // cell: ({ row }) => {
    //   const rowData = row.original;
    //   const userId = rowData.users;
    // },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const taskItem = row.original;

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
              onClick={() => navigator.clipboard.writeText(taskItem._id)}
            >
              Copy taskItem ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DeleteButton rowId={taskItem._id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
