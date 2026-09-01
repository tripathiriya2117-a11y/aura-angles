import { TaskData } from "../types/task";

const API_URL = "https://aura-angles-api.onrender.com";

export async function getTasks(): Promise<TaskData[]> {
  const response = await fetch(`${API_URL}/api/tasks`);

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to fetch tasks: ${response.status} ${error}`);
  }

  return (await response.json()) as TaskData[];
}

export async function getUpcomingTasks(): Promise<TaskData[]> {
  const response = await fetch(`${API_URL}/api/tasks/upcoming`);

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to fetch upcoming tasks: ${response.status} ${error}`);
  }

  return (await response.json()) as TaskData[];
}

export async function getTodayTasks(): Promise<TaskData[]> {
  const response = await fetch(`${API_URL}/api/tasks/today`);

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to fetch today's tasks: ${response.status} ${error}`);
  }

  return (await response.json()) as TaskData[];
}

export async function createTask(
  task: Partial<TaskData>
): Promise<TaskData> {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to create task: ${response.status} ${error}`);
  }

  return (await response.json()) as TaskData;
}

export async function updateTask(
  id: string,
  updates: Partial<TaskData>
): Promise<TaskData> {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to update task: ${response.status} ${error}`);
  }

  return (await response.json()) as TaskData;
}

export async function completeTask(id: string): Promise<TaskData> {
  const response = await fetch(`${API_URL}/api/tasks/${id}/complete`, {
    method: "PUT",
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to complete task: ${response.status} ${error}`);
  }

  return (await response.json()) as TaskData;
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to delete task: ${response.status} ${error}`);
  }
}
