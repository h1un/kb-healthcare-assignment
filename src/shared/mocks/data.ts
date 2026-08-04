import type { DashboardResponse, TaskItem, UserResponse } from "@/shared/api/types";

export const user: UserResponse = {
  name: "케어 매니저",
  memo: "KB헬스케어 케어 태스크 운영 담당자",
};

export const tasks: TaskItem[] = Array.from({ length: 87 }, (_, index) => {
  const titles = [
    "아침 스트레칭 10분",
    "물 2L 마시기",
    "점심 후 산책하기",
    "영양제 챙겨 먹기",
    "자외선 차단제 바르기",
    "실내 환기하기",
    "취침 전 스마트폰 멀리하기",
    "혈압 측정 기록",
    "주간 식단 정리",
    "금연 다짐 체크",
  ];
  const memos = [
    "오늘도 가볍게 몸을 깨워요.",
    "한 컵씩 나눠서 자주 마시기.",
    "식후 15분 걷기만 해도 충분해요.",
    "아침, 저녁으로 나눠서 복용.",
    "외출 30분 전에 미리 발라두기.",
    "막힌 공기를 정화해요.",
    "숙면을 위한 작은 습관.",
    "측정값은 앱에 바로 기록해요.",
    "균형 잡힌 한 끼를 계획해요.",
    "오늘의 성공 여부만 체크해요.",
  ];

  return {
    id: `TASK-${String(index + 1).padStart(3, "0")}`,
    title: titles[index % titles.length],
    memo: memos[index % memos.length],
    status: index % 3 === 0 ? "DONE" : "TODO",
  };
});

export function getDashboardData(source: TaskItem[] = tasks): DashboardResponse {
  const numOfTask = source.length;
  const numOfDoneTask = source.filter((task) => task.status === "DONE").length;

  return {
    numOfTask,
    numOfDoneTask,
    numOfRestTask: numOfTask - numOfDoneTask,
  };
}
