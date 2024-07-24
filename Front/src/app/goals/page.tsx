"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { BsFillBarChartFill } from 'react-icons/bs';

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
        const response = await axios.get('http://localhost:8080/goals'); // Substitua pelo endpoint correto da sua API
        const data: Goal[] = response.data;
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">Metas Concluídas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goalsState.length > 0 ? (
          goalsState.map(goal => (
            <motion.div 
              key={goal.id}
              className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{goal.title}</h2>
              <p className="text-gray-700 mb-4">{goal.description}</p>
              <div className="flex items-center mb-4">
                <BsFillBarChartFill className="text-blue-500 mr-2" />
                <p className="text-gray-600">{goal.itemsCompleted}/{goal.itemsTotal} itens concluídos</p>
              </div>
              <ul className="space-y-2">
                {goal.tasks.map(task => (
                  <li
                    key={task.id}
                    className='flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-300'
                  >
                    <span className="flex items-center space-x-2">
                      {task.status === 'done' ? (
                        <AiOutlineCheck className="text-green-500" />
                      ) : (
                        <AiOutlineClose className="text-red-500" />
                      )}
                      <span>{task.name}</span>
                    </span>
                    <button 
                      className={`px-3 py-1 rounded-full text-sm ${task.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {task.status}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhuma meta concluída encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default GoalsList;
