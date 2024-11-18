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
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";
// import { useMutation } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";

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
export type Clients = {
  _id: string;
  _creationTime: number;
  userId?: string; // Optional user ID
  name?: string; // Optional name
  image?: string; // Optional image URL
  email?: string; // Optional email address
  emailVerificationTime?: number; // Optional email verification timestamp
  phone?: string; // Optional phone number
  phoneVerificationTime?: number; // Optional phone verification timestamp
  isAnonymous?: boolean; // Optional flag indicating if the user is anonymous
  roles?: Array<"client" | "staff" | "admin">; // Optional array of roles
  students?: Array<Id<"students">>; // Optional array of associated student IDs
};

export const columns: ColumnDef<Clients>[] = [
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
    id: "name",
    accessorFn: (row) => `${row.name}`,
    cell: ({ row }) => {
      const client = row.original;
      return (
        <Button variant={"ghost"} className="px-2 py-1" asChild>
          <Link href={"/admin/clientele/" + client._id}>{client.name}</Link>
        </Button>
      );
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const clientPhone = row.original.phone;

      if (!clientPhone) {
        return <span className="text-muted-foreground">no phone</span>;
      }

      return (
        <Button
          variant={"link"}
          className="px-0"
          title="Copy Email"
          onClick={() => navigator.clipboard.writeText(clientPhone)}
        >
          {clientPhone}
        </Button>
      );
    },
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => {
      const clientEmail = row.original.email;

      if (!clientEmail) {
        return <span className="text-muted-foreground">no email</span>;
      }

      return (
        <Button
          variant={"link"}
          className="px-0"
          title="Copy Email"
          onClick={() => navigator.clipboard.writeText(clientEmail)}
        >
          {clientEmail}
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clientRow = row.original;

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
              onClick={() => navigator.clipboard.writeText(clientRow._id)}
            >
              Copy Client ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* <DeleteButton rowId={taskItem._id} /> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
