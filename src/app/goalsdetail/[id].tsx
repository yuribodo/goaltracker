"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Task {
  id: number;
  name: string;
  status: 'done' | 'todo';
}

interface Goal {
  id: number;
  title: string;
  description: string;
  itemsCompleted: number;
  itemsTotal: number;
  completed: boolean;
  tasks: Task[];
}

const GoalDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    if (id) {
      const fetchGoal = async () => {
        const response = await fetch(`/goals/${id}.json`);
        const data = await response.json();
        setGoal(data);
      };

      fetchGoal();
    }
  }, [id]);

  if (!goal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-6 py-6 bg-gray-200 rounded-lg shadow-md">
      <h2 className="font-bold text-lg">{goal.title}</h2>
      <h3 className="text-sm">{goal.itemsCompleted}/{goal.itemsTotal} itens</h3>
      <p className="text-sm">{goal.description}</p>
      <p className="text-sm">{goal.completed ? 'Concluída' : 'Não Concluída'}</p>
      <h3 className="font-bold mt-2">Tarefas:</h3>
      <ul>
        {goal.tasks.map((task) => (
          <li key={task.id} className="flex items-center">
            <span className="mr-2">{task.name}</span>
            <span className={`px-2 py-1 rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}>{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalDetails;
