import { useNavigate } from "@tanstack/react-router";
import { AlertCircleIcon } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

export function SessionExpiredDialog() {
  const navigate = useNavigate();
  const { sessionExpired, clearSessionExpired } = useAuth();

  const handleConfirm = () => {
    clearSessionExpired();
    void navigate({ to: "/sign-in" });
  };

  return (
    <AlertDialog open={sessionExpired}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <AlertCircleIcon aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>로그인이 만료됐어요</AlertDialogTitle>
          <AlertDialogDescription>다시 로그인하면 진행 중이던 화면으로 돌아올 수 있습니다.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>로그인하기</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
