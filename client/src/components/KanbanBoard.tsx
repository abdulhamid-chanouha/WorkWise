import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../services/taskService";
import { updateTaskStatus } from "../services/taskService";

const columns: { status: TaskStatus; label: string }[] = [
  { status: "BACKLOG", label: "Backlog" },
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "IN_REVIEW", label: "Review" },
  { status: "DONE", label: "Done" },
];

// Temporary mock data until the task list API is available.
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Set up authentication system",
    priority: "HIGH",
    status: "TODO",
    assignee: { id: "1", name: "Yehia", email: "yehia@team1.com" },
  },
  {
    id: "task-2",
    title: "Build Kanban board UI",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignee: { id: "2", name: "Hadi", email: "hadi@team1.com" },
  },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDrop = async (status: TaskStatus) => {
    if (!draggedTaskId) return;

    const previousTasks = tasks;

    setTasks((current) =>
      current.map((task) =>
        task.id === draggedTaskId ? { ...task, status } : task
      )
    );

    try {
      await updateTaskStatus(draggedTaskId, status);
    } catch {
      setTasks(previousTasks);
    } finally {
      setDraggedTaskId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Kanban Board</h1>
        <p className="mt-1 text-sm text-gray-500">
          Drag tasks between columns to update their status.
        </p>
      </div>

      <div className="grid gap-4 overflow-x-auto lg:grid-cols-5">
        {columns.map((column) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status
          );

          return (
            <section
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(column.status)}
              className="min-h-[500px] rounded-xl bg-gray-100 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                  {column.label}
                </h2>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">
                  {columnTasks.length}
                </span>
              </div>

              <div className="max-h-[70vh] overflow-y-auto pr-1">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    onDragStart={() => setDraggedTaskId(task.id)}
                  >
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}