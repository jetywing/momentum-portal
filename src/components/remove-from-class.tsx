import { useMutation } from "@tanstack/react-query";
import { Id } from "../../convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

export function RemoveFromClass({
  studentId,
  classId,
  studentName,
  className,
}: {
  studentId: Id<"students"> | undefined;
  classId: Id<"classes"> | undefined;
  studentName: string | undefined;
  className: string | undefined;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.functions.removeStudentFromClass, {
      studentId: studentId,
      classId: classId,
    }),
    onSuccess: () => {
      toast(`Removed ${studentName} from ${className}`);
    },
  });

  if (!studentId || !classId) {
    return null;
  }

  return (
    <button
      className="text-red-500 flex gap-1 w-full text-left h-full"
      onClick={() => mutate({ studentId, classId })}
      disabled={isPending}
    >
      <TrashIcon className="h-4 w-4" />
      Remove
    </button>
  );
}
