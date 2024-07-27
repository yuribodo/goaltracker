export interface Task {
    id: number;
    name: string;
    status: 'done' | 'todo' | string;
  }
  
export interface Goal {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    tasks: Task[];
  }