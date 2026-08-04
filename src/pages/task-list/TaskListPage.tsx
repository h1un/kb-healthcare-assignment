import { Link } from "@tanstack/react-router";

const previewTasks = [
  { id: "TASK-001", title: "아침 스트레칭 10분", memo: "오늘도 가볍게 몸을 깨워요." },
  { id: "TASK-002", title: "물 2L 마시기", memo: "한 컵씩 나눠서 자주 마시기." },
  { id: "TASK-003", title: "점심 후 산책하기", memo: "식후 15분 걷기만 해도 충분해요." },
];

export function TaskListPage() {
  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm font-black text-muted-foreground">전체 12개의 할 일</p>
      {previewTasks.map((task) => (
        <Link
          key={task.id}
          to="/task/$taskId"
          params={{ taskId: task.id }}
          className="rounded-[2rem] bg-card p-6 shadow-[0_16px_40px_rgba(35,40,50,0.06)]"
        >
          <h2 className="text-xl font-black text-kb-ink">{task.title}</h2>
          <p className="mt-2 text-sm font-bold text-muted-foreground">{task.memo}</p>
        </Link>
      ))}
    </section>
  );
}
