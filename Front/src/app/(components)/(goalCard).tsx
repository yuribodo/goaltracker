"use client";

import { motion } from 'framer-motion';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { BsFillBarChartFill } from 'react-icons/bs';
import { Task, Goal } from '../(types)/types';

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const itemsCompleted = goal.tasks.filter(task => task.status === 'done').length;
  const itemsTotal = goal.tasks.length;
  const completionRate = itemsTotal > 0 ? (itemsCompleted / itemsTotal) * 100 : 0;

  return (
    <motion.div 
      key={goal.id}
      className="p-4 md:p-6 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer min-h-[250px] flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{goal.title}</h2>
        <p className="text-gray-700 mb-4">{goal.description}</p>
        <div className="flex items-center mb-2">
          <BsFillBarChartFill className="text-blue-500 mr-2" />
          <p className="text-gray-600">{itemsCompleted}/{itemsTotal} itens concluídos</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <motion.div
            className="bg-blue-500 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <ul className="space-y-2">
        {Array.isArray(goal.tasks) && goal.tasks.length > 0 ? (
          goal.tasks.map((task: Task) => (
            <li
              key={task.id}
              className='flex items-center justify-between bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-300'
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
                className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-sm ${task.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
              >
                {task.status}
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma tarefa disponível</p>
        )}
      </ul>
    </motion.div>
  );
};

export default GoalCard;
