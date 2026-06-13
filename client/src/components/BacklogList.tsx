import { useMemo, useState } from "react";
import type { Task } from "../services/taskService";

type SortKey = "title" | "status" | "priority" | "assignee";
type SortDirection = "asc" | "desc";

interface BacklogTask extends Task {
  dueDate?: string;
}

const mockTasks: BacklogTask[] = [
  {
    id: "task-1",
    title: "Set up authentication system",
    priority: "HIGH",
    status: "TODO",
    assignee: { id: "1", name: "Yehia", email: "yehia@team1.com" },
    dueDate: "2026-06-20",
  },
  {
    id: "task-2",
    title: "Build Kanban board UI",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignee: { id: "2", name: "Hadi", email: "hadi@team1.com" },
    dueDate: "2026-06-22",
  },
  {
    id: "task-3",
    title: "Create backlog list view",
    priority: "MEDIUM",
    status: "BACKLOG",
    assignee: null,
    dueDate: "2026-06-25",
  },
  {
    id: "task-4",
    title: "Add task filtering",
    priority: "LOW",
    status: "BACKLOG",
    assignee: { id: "3", name: "Taimour", email: "taimour@team1.com" },
    dueDate: "2026-06-28",
  },
];

const pageSize = 3;

export default function BacklogList() {
  const [tasks] = useState<BacklogTask[]>(mockTasks);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aValue = getSortValue(a, sortKey);
      const bValue = getSortValue(b, sortKey);

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedTasks.length / pageSize);
  const paginatedTasks = sortedTasks.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    setPage(1);
  }

  function toggleTaskSelection(taskId: string) {
    setSelectedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId]
    );
  }

  function toggleCurrentPageSelection() {
    const currentPageIds = paginatedTasks.map((task) => task.id);
    const allSelected = currentPageIds.every((id) => selectedTaskIds.includes(id));

    if (allSelected) {
      setSelectedTaskIds((current) =>
        current.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedTaskIds((current) =>
        Array.from(new Set([...current, ...currentPageIds]))
      );
    }
  }

  const currentPageAllSelected =
    paginatedTasks.length > 0 &&
    paginatedTasks.every((task) => selectedTaskIds.includes(task.id));

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Backlog List</h1>
          <p className="mt-1 text-sm text-gray-500">
            View, sort, and manage tasks from the backlog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={selectedTaskIds.length === 0}
            className="rounded-md border px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Bulk move
          </button>
          <button
            type="button"
            disabled={selectedTaskIds.length === 0}
            className="rounded-md border px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Bulk assign
          </button>
          <button
            type="button"
            disabled={selectedTaskIds.length === 0}
            className="rounded-md border px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete selected
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={currentPageAllSelected}
                  onChange={toggleCurrentPageSelection}
                  aria-label="Select all tasks on current page"
                />
              </th>
              <SortableHeader label="Title" column="title" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Status" column="status" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Priority" column="priority" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Assignee" column="assignee" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                    aria-label={`Select ${task.title}`}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{task.title}</td>
                <td className="px-4 py-3 text-gray-600">{task.status}</td>
                <td className="px-4 py-3 text-gray-600">{task.priority}</td>
                <td className="px-4 py-3 text-gray-600">
                  {task.assignee?.name ?? "Unassigned"}
                </td>
                <td className="px-4 py-3 text-gray-600">{task.dueDate ?? "No due date"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-md border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="rounded-md border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function getSortValue(task: BacklogTask, key: SortKey): string {
  if (key === "assignee") return task.assignee?.name ?? "";
  return String(task[key] ?? "");
}

interface SortableHeaderProps {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (column: SortKey) => void;
}

function SortableHeader({
  label,
  column,
  sortKey,
  sortDirection,
  onSort,
}: SortableHeaderProps) {
  const active = sortKey === column;

  return (
    <th className="px-4 py-3 text-left font-semibold text-gray-700">
      <button type="button" onClick={() => onSort(column)} className="inline-flex items-center gap-1">
        {label}
        {active && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
      </button>
    </th>
  );
}