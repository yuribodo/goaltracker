"use client"

import Link from 'next/link';
import { useState } from 'react';

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

// Dados embutidos no próprio arquivo
const goals: Goal[] = [
  {
    id: 1,
    title: 'Meta 1',
    description: 'Descrição da Meta 1',
    itemsCompleted: 2,
    itemsTotal: 5,
    completed: false,
    tasks: [
      { id: 1, name: 'Tarefa 1', status: 'todo' },
      { id: 2, name: 'Tarefa 2', status: 'done' },
    ],
  },
  {
    id: 2,
    title: 'Meta 2',
    description: 'Descrição da Meta 2',
    itemsCompleted: 3,
    itemsTotal: 5,
    completed: false,
    tasks: [
      { id: 1, name: 'Tarefa 1', status: 'todo' },
      { id: 2, name: 'Tarefa 2', status: 'done' },
    ],
  },
];

const GoalsList = () => {
  const [goalsState, setGoalsState] = useState<Goal[]>(goals);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Metas</h1>
      <div className="grid grid-cols-2 gap-4">
        {goalsState.map(goal => (
          <Link key={goal.id} href={`/goalsdetail/${goal.id}`}>
            <div className="p-4 bg-gray-200 rounded-lg shadow-md cursor-pointer">
              <h2 className="font-bold text-lg">{goal.title}</h2>
              <p className="text-sm">{goal.description}</p>
              <p className="text-sm">{goal.itemsCompleted}/{goal.itemsTotal} itens</p>
              <p className="text-sm">{goal.completed ? 'Concluída' : 'Não Concluída'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GoalsList;
