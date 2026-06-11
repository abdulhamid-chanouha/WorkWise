import type { Task } from "../services/taskService";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({
  task,
}: TaskCardProps) {
  return (
    <div
      draggable
      className="mb-3 rounded-lg border bg-white p-3 shadow-sm cursor-move"
    >
      <h3 className="font-medium">{task.title}</h3>

      <div className="mt-2 text-xs text-gray-500">
        Priority: {task.priority}
      </div>

      <div className="mt-1 text-xs text-gray-500">
        {task.assignee?.name ?? "Unassigned"}
      </div>
    </div>
  );
}