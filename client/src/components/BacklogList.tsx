import { useMemo, useState } from "react";
import type { Task } from "../services/taskService";

type SortKey = "title" | "status" | "priority" | "assignee";
type SortDirection = "asc" | "desc";

interface BacklogTask extends Task {
  description?: string;
  labels?: string[];
  dueDate?: string;
}

const mockTasks: BacklogTask[] = [
  {
    id: "task-1",
    title: "Set up authentication system",
    description: "Create login, register, and protected routes",
    priority: "HIGH",
    status: "TODO",
    assignee: { id: "1", name: "Yehia", email: "yehia@team1.com" },
    labels: ["auth", "backend"],
    dueDate: "2026-06-20",
  },
  {
    id: "task-2",
    title: "Build Kanban board UI",
    description: "Create draggable board columns",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignee: { id: "2", name: "Hadi", email: "hadi@team1.com" },
    labels: ["frontend", "tasks"],
    dueDate: "2026-06-22",
  },
  {
    id: "task-3",
    title: "Create backlog list view",
    description: "Create sortable and paginated backlog table",
    priority: "MEDIUM",
    status: "BACKLOG",
    assignee: null,
    labels: ["frontend", "backlog"],
    dueDate: "2026-06-25",
  },
  {
    id: "task-4",
    title: "Add task filtering",
    description: "Allow filtering by assignee, label, priority, and status",
    priority: "LOW",
    status: "BACKLOG",
    assignee: { id: "3", name: "Taimour", email: "taimour@team1.com" },
    labels: ["frontend", "filters"],
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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [labelFilter, setLabelFilter] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      const matchesAssignee =
        !assigneeFilter || task.assignee?.name === assigneeFilter;
      const matchesLabel =
        !labelFilter || task.labels?.includes(labelFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee &&
        matchesLabel
      );
    });
  }, [tasks, search, statusFilter, priorityFilter, assigneeFilter, labelFilter]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      const aValue = getSortValue(a, sortKey);
      const bValue = getSortValue(b, sortKey);

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTasks, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / pageSize));
  const paginatedTasks = sortedTasks.slice((page - 1) * pageSize, page * pageSize);

  const assignees = Array.from(
    new Set(tasks.map((task) => task.assignee?.name).filter(Boolean))
  );

  const labels = Array.from(
    new Set(tasks.flatMap((task) => task.labels ?? []))
  );

  function resetPage() {
    setPage(1);
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    resetPage();
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

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setAssigneeFilter("");
    setLabelFilter("");
    resetPage();
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
            View, sort, filter, and manage tasks from the backlog.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" disabled={selectedTaskIds.length === 0} className="rounded-md border px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
            Bulk move
          </button>
          <button type="button" disabled={selectedTaskIds.length === 0} className="rounded-md border px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
            Bulk assign
          </button>
          <button type="button" disabled={selectedTaskIds.length === 0} className="rounded-md border px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
            Delete selected
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-5">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            resetPage();
          }}
          placeholder="Search title or description"
          className="rounded-md border px-3 py-2 text-sm md:col-span-2"
        />

        <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); resetPage(); }} className="rounded-md border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="BACKLOG">Backlog</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="DONE">Done</option>
        </select>

        <select value={priorityFilter} onChange={(event) => { setPriorityFilter(event.target.value); resetPage(); }} className="rounded-md border px-3 py-2 text-sm">
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        <select value={assigneeFilter} onChange={(event) => { setAssigneeFilter(event.target.value); resetPage(); }} className="rounded-md border px-3 py-2 text-sm">
          <option value="">All assignees</option>
          {assignees.map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>

        <select value={labelFilter} onChange={(event) => { setLabelFilter(event.target.value); resetPage(); }} className="rounded-md border px-3 py-2 text-sm">
          <option value="">All labels</option>
          {labels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {(search || statusFilter || priorityFilter || assigneeFilter || labelFilter) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {search && <FilterChip label={`Search: ${search}`} onRemove={() => setSearch("")} />}
          {statusFilter && <FilterChip label={`Status: ${statusFilter}`} onRemove={() => setStatusFilter("")} />}
          {priorityFilter && <FilterChip label={`Priority: ${priorityFilter}`} onRemove={() => setPriorityFilter("")} />}
          {assigneeFilter && <FilterChip label={`Assignee: ${assigneeFilter}`} onRemove={() => setAssigneeFilter("")} />}
          {labelFilter && <FilterChip label={`Label: ${labelFilter}`} onRemove={() => setLabelFilter("")} />}

          <button type="button" onClick={clearFilters} className="text-sm text-gray-500 underline">
            Clear all
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input type="checkbox" checked={currentPageAllSelected} onChange={toggleCurrentPageSelection} />
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
                  <input type="checkbox" checked={selectedTaskIds.includes(task.id)} onChange={() => toggleTaskSelection(task.id)} />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{task.title}</td>
                <td className="px-4 py-3 text-gray-600">{task.status}</td>
                <td className="px-4 py-3 text-gray-600">{task.priority}</td>
                <td className="px-4 py-3 text-gray-600">{task.assignee?.name ?? "Unassigned"}</td>
                <td className="px-4 py-3 text-gray-600">{task.dueDate ?? "No due date"}</td>
              </tr>
            ))}

            {paginatedTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No tasks match the active filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-md border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50">
            Previous
          </button>
          <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="rounded-md border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50">
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

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
      {label}
      <button type="button" onClick={onRemove} className="font-semibold text-gray-500">
        ×
      </button>
    </span>
  );
}

interface SortableHeaderProps {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (column: SortKey) => void;
}

function SortableHeader({ label, column, sortKey, sortDirection, onSort }: SortableHeaderProps) {
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