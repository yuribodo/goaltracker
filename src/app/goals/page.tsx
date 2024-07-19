"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

const GoalsList = () => {
  const [goalsState, setGoalsState] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/goals.json');
        const data: Goal[] = await response.json();
        // Filtrar apenas as metas concluídas
        const completedGoals = data.filter(goal => goal.completed);
        setGoalsState(completedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Carregando...</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Metas Concluídas</h1>
      <div className="grid grid-cols-2 gap-4">
        {goalsState.length > 0 ? (
          goalsState.map(goal => (
              <div className="p-4 bg-gray-200 rounded-lg shadow-md cursor-pointer">
                <h2 className="font-bold text-lg">{goal.title}</h2>
                <p className="text-sm">{goal.description}</p>
                <p className="text-sm">{goal.itemsCompleted}/{goal.itemsTotal} itens</p>
                <p className="text-sm">{goal.completed ? 'Concluída' : 'Não Concluída'}</p>
                {goal.tasks.map(task => (
                    <li
                        key={task.id}
                        className='flex items-center justify-between bg-gray-100 p-2 rounded'
                    >
                        <span>{task.name}</span>
                        <button 
                        className={`px-2 py-1 rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
                        >
                        {task.status}
                        </button>
                    </li>
                ))}
              </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhuma meta concluída encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default GoalsList;
