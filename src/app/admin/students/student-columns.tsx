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
import { Badge } from "@/components/ui/badge";
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

// function AccountCell({ accountId }: { accountId: Id<"users">[] }) {
//   const account = useQuery(api.users.getUsersByFromArray, { idArray: accountId });
//
//   if (!account) {
//     return <span>loading...</span>;
//   }
//
//   return (
//     account.map((account) =>(
//       <Link
//         key={account}
//         className="duration-150 hover:opacity-60"
//         href={`/admin/clientele/${account._id}`}
//       >
//         {account.name}
//       </Link>
//     ))
//   );
// }
//
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Students = {
  _id: string;
  firstName: string;
  lastName: string;
  birthday: string;
  team: string;
  account: Id<"users">;
};

export const columns: ColumnDef<Students>[] = [
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
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <Button variant={"ghost"} className="px-2 py-1" asChild>
          <Link href={"/admin/students/" + student._id}>
            {student.firstName} {student.lastName}
          </Link>
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
    id: "age",
    accessorFn: (row) => {
      const today = new Date();
      const birthDate = new Date(row.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      } else if (row.birthday == null) {
        return "?";
      }
      return age;
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "birthday",
    header: "Birthday",
    accessorFn: (row) => {
      const birthday = new Date(row.birthday);
      const birthDate = birthday.toLocaleDateString();
      return birthDate;
    },
  },
  {
    header: "Team",
    cell: ({ row }) => {
      const team = row.original.team;

      if (team) {
        return <Badge variant={"outline"}>{team}</Badge>;
      } else {
        return <Badge variant={"outline"}>REC</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const studentRow = row.original;

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
              onClick={() => navigator.clipboard.writeText(studentRow._id)}
            >
              Copy Student ID
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
