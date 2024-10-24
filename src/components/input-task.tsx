import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { fetchMutation } from "convex/nextjs";
import { useRef } from "react";

export function InputTask() {
  const inputRef = useRef<HTMLInputElement>(null);

  async function createTask(formData: FormData) {
    await fetchMutation(api.tasks.addItem, {
      text: formData.get("text") as string,
    });

    // Clear the input field
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <form
        action={createTask}
        className="flex gap-2 flex-row py-2"
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
          createTask(new FormData(e.currentTarget));
        }}
      >
        <Input placeholder="new task" name="text" ref={inputRef} />
        <Button variant={"secondary"} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
