import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteTask } from "@/entities/task/api";
import { ApiError } from "@/shared/api/http-client";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

type DeleteTaskDialogProps = {
  taskId: string;
};

export function DeleteTaskDialog({ taskId }: DeleteTaskDialogProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmValue, setConfirmValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isConfirmed = confirmValue === taskId;
  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false);
      await navigate({ to: "/task" });
    },
    onError: (error) => {
      setErrorMessage(error instanceof ApiError ? error.errorMessage : "할 일을 삭제하지 못했습니다.");
    },
  });

  useEffect(() => {
    if (!open) {
      setConfirmValue("");
      setErrorMessage(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-2xl font-black" variant="destructive">
          <Trash2Icon data-icon="inline-start" />
          삭제하기
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>할 일을 삭제할까요?</DialogTitle>
          <DialogDescription>삭제하려면 아래 입력창에 할 일 ID를 그대로 입력해주세요.</DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={Boolean(errorMessage) || undefined}>
            <FieldLabel htmlFor="task-delete-confirm">할 일 ID</FieldLabel>
            <Input
              id="task-delete-confirm"
              value={confirmValue}
              onChange={(event) => setConfirmValue(event.target.value)}
              placeholder={taskId}
              aria-invalid={Boolean(errorMessage)}
              disabled={deleteMutation.isPending}
            />
            <FieldDescription>{errorMessage ?? `${taskId} 입력 시 삭제 버튼이 활성화됩니다.`}</FieldDescription>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleteMutation.isPending}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={!isConfirmed || deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
