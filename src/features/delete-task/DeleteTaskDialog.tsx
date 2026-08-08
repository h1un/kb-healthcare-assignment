import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { dashboardQueryKey } from "@/entities/dashboard/queries";
import { deleteTask } from "@/entities/task/api";
import { taskQueryKeys } from "@/entities/task/queries";
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
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
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
  const {
    isPending,
    mutate: mutateDeleteTask,
    reset: resetDeleteTask,
  } = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: taskQueryKeys.detail(taskId), exact: true });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: taskQueryKeys.list() }),
        queryClient.invalidateQueries({ queryKey: dashboardQueryKey }),
      ]);
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
      resetDeleteTask();
    }
  }, [open, resetDeleteTask]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConfirmed || isPending) {
      return;
    }

    mutateDeleteTask();
  };
  const handleCancel = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-2xl bg-destructive font-black text-destructive-foreground hover:bg-destructive/90" variant="destructive">
          <Trash2Icon data-icon="inline-start" />
          삭제하기
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>할 일을 삭제할까요?</DialogTitle>
          <DialogDescription>삭제하려면 아래 입력창에 할 일 ID를 그대로 입력해주세요.</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} aria-busy={isPending}>
          <FieldGroup>
            <Field data-invalid={Boolean(errorMessage) || undefined}>
              <FieldLabel htmlFor="task-delete-confirm">할 일 ID</FieldLabel>
              <Input
                id="task-delete-confirm"
                value={confirmValue}
                onChange={(event) => setConfirmValue(event.target.value)}
                placeholder={taskId}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? "task-delete-error" : "task-delete-description"}
                aria-errormessage={errorMessage ? "task-delete-error" : undefined}
                disabled={isPending}
              />
              {errorMessage ? (
                <FieldError id="task-delete-error">{errorMessage}</FieldError>
              ) : (
                <FieldDescription id="task-delete-description">
                  {taskId} 입력 시 제출 버튼이 활성화됩니다.
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              className="h-14 rounded-lg bg-muted text-base font-black text-muted-foreground hover:bg-muted/80"
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              className="h-14 rounded-lg bg-destructive text-base font-black text-destructive-foreground hover:bg-destructive/90 disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
              type="submit"
              variant="destructive"
              disabled={!isConfirmed || isPending}
            >
              {isPending ? "삭제 중…" : "제출"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
