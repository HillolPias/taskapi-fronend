export interface Task {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  project_id: number;
}

export interface Project {
  id: number;
  name: string;
  created_at: string;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
