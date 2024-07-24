"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

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
        const response = await axios.get('http://localhost:8080/goals'); // URL da API
        const goals: Goal[] = response.data;

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
        <motion.h1 
          className="text-3xl font-bold" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Gerenciador de Metas
        </motion.h1>
      </div>
      <div className="flex justify-between space-x-4 text-center">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold">Todas as Metas</h2>
          <div className="text-2xl font-bold">{stats.totalGoals}</div>
        </motion.div>
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold">Em Progresso</h2>
          <div className="text-2xl font-bold">{stats.inProgress}</div>
        </motion.div>
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold">Completas</h2>
          <div className="text-2xl font-bold">{stats.completed}</div>
        </motion.div>
      </div>
    </div>
  );
}
