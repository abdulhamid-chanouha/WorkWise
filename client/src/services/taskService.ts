import apiClient from './apiClient';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId: string;
}

export async function createTask(payload: CreateTaskPayload): Promise<void> {
  await apiClient.post('/tasks', payload);
}
