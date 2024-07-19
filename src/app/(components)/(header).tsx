"use client";
import { useEffect, useState } from 'react';

interface Task {
  id: number;
  name: string;
  status: 'done' | 'todo' | string;
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

export default function Header() {
  const [stats, setStats] = useState({
    totalGoals: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/goals.json');
        const goals: Goal[] = await response.json();

        // Calculate statistics
        const totalGoals = goals.length;
        const inProgress = goals.filter(goal => !goal.completed).length;
        const completed = goals.filter(goal => goal.completed).length;

        setStats({
          totalGoals,
          inProgress,
          completed
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white h-[20vh] flex flex-col justify-between p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerenciador de Metas</h1>
      </div>
      <div className="flex justify-between space-x-4 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">Todas as Metas</h2>
          <div className="text-2xl font-bold">{stats.totalGoals}</div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">Em Progresso</h2>
          <div className="text-2xl font-bold">{stats.inProgress}</div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">Completas</h2>
          <div className="text-2xl font-bold">{stats.completed}</div>
        </div>
      </div>
    </div>
  );
}
