"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Id } from "../../convex/_generated/dataModel";

export function DeleteTaskItem(id: Id<"tasks">) {
  const deleteItem = useMutation(api.tasks.deleteTask());

  return (
    <Button variant={"link"} onClick={() => deleteItem({ id })}>
      Delete
    </Button>
  );
}
