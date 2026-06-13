import { useState, type DragEvent } from 'react';
import Icon from './Icon';
import TaskCard from './TaskCard';
import type { Task, TaskStatus } from '../services/taskService';
import { updateTaskStatus } from '../services/taskService';

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'BACKLOG', label: 'Backlog' },
  { status: 'TODO', label: 'To do' },
  { status: 'IN_PROGRESS', label: 'In progress' },
  { status: 'IN_REVIEW', label: 'Review' },
  { status: 'DONE', label: 'Done' },
];

// Temporary data until the task-list endpoint is connected.
const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Set up authentication system',
    priority: 'HIGH',
    status: 'TODO',
    assignee: { id: '1', name: 'Yehia', email: 'yehia@team1.com' },
  },
  {
    id: 'task-2',
    title: 'Build Kanban board UI',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignee: { id: '2', name: 'Hadi', email: 'hadi@team1.com' },
  },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
  const [saveError, setSaveError] = useState(false);

  const handleDragStart = (event: DragEvent<HTMLElement>, taskId: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
    setSaveError(false);
  };

  const handleDrop = async (status: TaskStatus) => {
    if (!draggedTaskId) return;

    const previousTasks = tasks;
    const currentTask = tasks.find((task) => task.id === draggedTaskId);

    setDropTarget(null);
    if (!currentTask || currentTask.status === status) {
      setDraggedTaskId(null);
      return;
    }

    setTasks((current) => current.map((task) => (
      task.id === draggedTaskId ? { ...task, status } : task
    )));

    try {
      await updateTaskStatus(draggedTaskId, status);
    } catch {
      setTasks(previousTasks);
      setSaveError(true);
    } finally {
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="kanban-shell app-card">
      <div className="kanban-heading">
        <div>
          <p className="section-kicker">Live workflow</p>
          <h2>Kanban board</h2>
          <p>Drag tasks between stages to keep delivery moving.</p>
        </div>
        <span className="kanban-summary"><Icon name="activity" size={15} /> {tasks.length} active tasks</span>
      </div>

      {saveError && (
        <div className="board-alert" role="alert">
          The status could not be saved, so the task was returned to its previous column.
        </div>
      )}

      <div className="kanban-board" aria-label="Task status board">
        {columns.map((column, index) => {
          const columnTasks = tasks.filter((task) => task.status === column.status);
          const isTarget = dropTarget === column.status && draggedTaskId !== null;

          return (
            <section
              key={column.status}
              className={`kanban-column${isTarget ? ' is-drop-target' : ''}`}
              style={{ '--column-index': index } as React.CSSProperties}
              onDragEnter={() => setDropTarget(column.status)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) setDropTarget(null);
              }}
              onDrop={() => handleDrop(column.status)}
            >
              <header className="kanban-column-head">
                <span className={`status-marker status-${column.status.toLowerCase()}`} />
                <h3>{column.label}</h3>
                <span className="kanban-count">{columnTasks.length}</span>
              </header>

              <div className="kanban-task-stack">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    dragging={draggedTaskId === task.id}
                    onDragStart={(event) => handleDragStart(event, task.id)}
                    onDragEnd={() => {
                      setDraggedTaskId(null);
                      setDropTarget(null);
                    }}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="kanban-empty"><span />Drop tasks here</div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
