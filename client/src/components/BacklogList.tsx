import { useMemo, useState } from 'react';
import Icon from './Icon';
import { Button } from './ui';
import type { Task } from '../services/taskService';

type SortKey = 'title' | 'status' | 'priority' | 'assignee';
type SortDirection = 'asc' | 'desc';

interface BacklogTask extends Task {
  dueDate?: string;
}

const mockTasks: BacklogTask[] = [
  { id: 'task-1', title: 'Set up authentication system', priority: 'HIGH', status: 'TODO', assignee: { id: '1', name: 'Yehia', email: 'yehia@team1.com' }, dueDate: '2026-06-20' },
  { id: 'task-2', title: 'Build Kanban board UI', priority: 'HIGH', status: 'IN_PROGRESS', assignee: { id: '2', name: 'Hadi', email: 'hadi@team1.com' }, dueDate: '2026-06-22' },
  { id: 'task-3', title: 'Create backlog list view', priority: 'MEDIUM', status: 'BACKLOG', assignee: null, dueDate: '2026-06-25' },
  { id: 'task-4', title: 'Add task filtering', priority: 'LOW', status: 'BACKLOG', assignee: { id: '3', name: 'Taimour', email: 'taimour@team1.com' }, dueDate: '2026-06-28' },
];

const pageSize = 3;

function getInitials(name?: string) {
  if (!name) return '?';
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function formatStatus(status: string) {
  return status.toLowerCase().split('_').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
}

function formatDate(date?: string) {
  if (!date) return 'No due date';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${date}T00:00:00`));
}

export default function BacklogList() {
  const [tasks] = useState<BacklogTask[]>(mockTasks);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);

  const sortedTasks = useMemo(() => [...tasks].sort((a, b) => {
    const aValue = getSortValue(a, sortKey);
    const bValue = getSortValue(b, sortKey);
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }), [tasks, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / pageSize));
  const paginatedTasks = sortedTasks.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDirection((current) => current === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setPage(1);
  }

  function toggleTaskSelection(taskId: string) {
    setSelectedTaskIds((current) => current.includes(taskId)
      ? current.filter((id) => id !== taskId)
      : [...current, taskId]);
  }

  function toggleCurrentPageSelection() {
    const currentPageIds = paginatedTasks.map((task) => task.id);
    const allSelected = currentPageIds.every((id) => selectedTaskIds.includes(id));
    setSelectedTaskIds((current) => allSelected
      ? current.filter((id) => !currentPageIds.includes(id))
      : Array.from(new Set([...current, ...currentPageIds])));
  }

  const currentPageAllSelected = paginatedTasks.length > 0
    && paginatedTasks.every((task) => selectedTaskIds.includes(task.id));

  return (
    <section className="app-card backlog-card animate-enter-delay">
      <div className="backlog-toolbar">
        <div>
          <p className="section-kicker">Backlog</p>
          <h2>Work queue</h2>
          <p>Sort and select tasks across your current workspace.</p>
        </div>

        <div className="backlog-actions" aria-label="Bulk task actions">
          <span className={`selection-count${selectedTaskIds.length ? ' is-visible' : ''}`}>
            {selectedTaskIds.length} selected
          </span>
          <Button variant="secondary" disabled={!selectedTaskIds.length}><Icon name="activity" size={15} /> Move</Button>
          <Button variant="secondary" disabled={!selectedTaskIds.length}><Icon name="user" size={15} /> Assign</Button>
          <Button variant="danger" disabled={!selectedTaskIds.length}>Delete</Button>
        </div>
      </div>

      <div className="backlog-table-wrap">
        <table className="backlog-table">
          <thead>
            <tr>
              <th className="checkbox-cell">
                <input type="checkbox" checked={currentPageAllSelected} onChange={toggleCurrentPageSelection} aria-label="Select all tasks on current page" />
              </th>
              <SortableHeader label="Task" column="title" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Status" column="status" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Priority" column="priority" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <SortableHeader label="Assignee" column="assignee" sortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
              <th>Due date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map((task) => {
              const selected = selectedTaskIds.includes(task.id);
              return (
                <tr key={task.id} className={selected ? 'is-selected' : ''}>
                  <td className="checkbox-cell">
                    <input type="checkbox" checked={selected} onChange={() => toggleTaskSelection(task.id)} aria-label={`Select ${task.title}`} />
                  </td>
                  <td data-label="Task"><strong className="task-table-title">{task.title}</strong></td>
                  <td data-label="Status"><span className={`status-badge status-${task.status.toLowerCase()}`}>{formatStatus(task.status)}</span></td>
                  <td data-label="Priority"><span className={`priority-badge priority-${task.priority.toLowerCase()}`}><span />{task.priority.toLowerCase()}</span></td>
                  <td data-label="Assignee">
                    <span className="table-assignee"><span className="mini-avatar">{getInitials(task.assignee?.name)}</span>{task.assignee?.name ?? 'Unassigned'}</span>
                  </td>
                  <td data-label="Due date"><span className="due-date"><Icon name="calendar" size={14} />{formatDate(task.dueDate)}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="backlog-footer">
        <span>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sortedTasks.length)} of {sortedTasks.length} tasks</span>
        <div className="pagination-controls">
          <Button variant="secondary" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
          <span className="page-number">{page} / {totalPages}</span>
          <Button variant="secondary" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</Button>
        </div>
      </footer>
    </section>
  );
}

function getSortValue(task: BacklogTask, key: SortKey): string {
  if (key === 'assignee') return task.assignee?.name ?? '';
  return String(task[key] ?? '');
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
    <th aria-sort={active ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button className={`sort-button${active ? ' is-active' : ''}`} type="button" onClick={() => onSort(column)}>
        {label}
        <Icon name="chevron-down" size={14} className={active && sortDirection === 'asc' ? 'sort-ascending' : ''} />
      </button>
    </th>
  );
}
