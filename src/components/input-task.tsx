import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { fetchMutation } from "convex/nextjs";

export function InputTask() {
  async function createTask(formData: FormData) {
    await fetchMutation(api.tasks.addItem, {
      text: formData.get("text") as string,
    });
  }
  return (
    <div>
      <form action={createTask} className="flex gap-2 flex-row py-2">
        <Input placeholder="new task" name="text" />
        <Button variant={"secondary"} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
