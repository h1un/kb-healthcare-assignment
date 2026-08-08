import { useNavigate } from "@tanstack/react-router";
import type { KeyboardEvent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { useAuth } from "./AuthProvider";

export function SessionExpiredDialog() {
  const navigate = useNavigate();
  const { sessionExpired, clearSessionExpired } = useAuth();

  const handleConfirm = () => {
    clearSessionExpired();
    void navigate({ to: "/sign-in" });
  };
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      clearSessionExpired();
    }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleConfirm();
    }
  };

  return (
    <AlertDialog open={sessionExpired} onOpenChange={handleOpenChange}>
      <AlertDialogContent onKeyDown={handleKeyDown}>
        <AlertDialogHeader>
          <AlertDialogTitle>로그인이 만료됐어요.</AlertDialogTitle>
          <AlertDialogDescription>로그인 상태가 만료되었습니다. 다시 로그인해주세요.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction autoFocus onClick={handleConfirm}>
            로그인하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
