import apiClient from './apiClient';

export type TaskStatus =
  | 'BACKLOG'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'DONE';

export interface Task {
  id: string;
  title: string;
  priority: string;
  status: TaskStatus;
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId: string;
}

export async function createTask(payload: CreateTaskPayload): Promise<void> {
  await apiClient.post('/tasks', payload);
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const response = await apiClient.patch(`/tasks/${taskId}`, { status });
  return response.data;
}
