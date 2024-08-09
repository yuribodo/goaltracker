import { Task } from '../_types/types';

interface TaskListProps {
  tasks: Task[];
  toggleTaskStatus: (taskId: number) => void;
}

const TaskList = ({ tasks, toggleTaskStatus }: TaskListProps) => {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <span>{task.name}</span>
          <button onClick={() => toggleTaskStatus(task.id)}>
            {task.status === 'done' ? 'Marcar como Pendente' : 'Marcar como Feito'}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
