"use client";

import { useState, useEffect } from 'react';

interface Goal {
  id: number;
  title: string;
  description: string;
  itemsCompleted: number;
  itemsTotal: number;
  completed: boolean;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/goals.json');
      const data = await response.json();
      setGoals(data);
    };

    fetchData();
  }, []);

  const addNewGoal = () => {
    if (goals.length >= 8) {
      alert('Limite máximo de 8 metas atingido.');
      return;
    }

    const newGoal: Goal = {
      id: goals.length + 1,
      title: `Meta 0${goals.length + 1}`,
      description: `Descrição da Meta 0${goals.length + 1}`,
      itemsCompleted: 0,
      itemsTotal: 5,
      completed: false
    };
    setGoals([...goals, newGoal]);
  };

  return (
    <div className="flex justify-between">
      <div className="flex justify-between">
        <div className="flex  space-x-2 py-6 px-6">
          <div onClick={addNewGoal} className="flex items-center justify-center cursor-pointer bg-yellow-200 rounded-xl h-[50px] w-[50px] shadow-lg">+</div>
          <div className="flex items-center w-fit h-[50px]">
            <h1 className="">Nova Meta</h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mr-20 py-6">
        {goals.map((goal) => (
          <div key={goal.id} className="px-6 py-6 bg-red-500">
            <h2 className="font-bold">{goal.title}</h2>
            <h3>{goal.itemsCompleted}/{goal.itemsTotal} itens</h3>
            <p>{goal.description}</p>
            <p>{goal.completed ? 'Concluída' : 'Não Concluída'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Goals;
