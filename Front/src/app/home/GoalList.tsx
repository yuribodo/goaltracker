import { motion } from 'framer-motion';
import GoalCard from './GoalCard';
import { Goal } from '../_types/types';

interface GoalListProps {
  goals: Goal[];
  openModalGoal: (goal: Goal) => void;
}

const GoalList = ({ goals, openModalGoal }: GoalListProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-6">
      {goals.length === 0 ? (
        <div className="text-center text-gray-700 text-lg font-semibold">
          Crie sua primeira meta
        </div>
      ) : (
        goals
          .filter(goal => !goal.completed)
          .map((goal) => (
            <motion.div
              key={goal.id}
              className="w-full md:w-1/2 lg:w-1/3 p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GoalCard goal={goal} onClick={() => openModalGoal(goal)} />
            </motion.div>
          ))
      )}
    </div>
  );
};

export default GoalList;
