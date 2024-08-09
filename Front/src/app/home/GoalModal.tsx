import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { Goal, Task } from '../_types/types';
import TaskList from './TaskList';


interface GoalModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  goal: Goal | null;
  toggleTaskStatus: (taskId: number) => void;
  handleTaskUpdate: (task: Task) => void;
}

const GoalModal = ({
  isOpen,
  onRequestClose,
  goal,
  toggleTaskStatus,
  handleTaskUpdate,
}: GoalModalProps) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Detalhes da Meta"
    className="modal"
    overlayClassName="overlay"
  >
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="modal-content"
    >
      {goal ? (
        <>
          <h2 className="text-2xl font-semibold mb-4">{goal.title}</h2>
          <p className="text-gray-700 mb-4">{goal.description}</p>

          <div className="task-list mb-4">
            <TaskList
              tasks={goal.tasks}
              toggleTaskStatus={toggleTaskStatus}
            />
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={onRequestClose}
            >
              Fechar
            </motion.button>
          </div>
        </>
      ) : (
        <p>Carregando detalhes da meta...</p>
      )}
    </motion.div>
  </Modal>
);

export default GoalModal;
