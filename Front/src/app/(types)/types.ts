export interface Task {
    id: number;
    name: string;
    status: 'done' | 'todo' | string;
  }
  
export interface Goal {
    id: number;
    title: string;
    description: string;
    itemsCompleted: number;
    itemsTotal: number;
    completed: boolean;
    tasks: Task[];
  }