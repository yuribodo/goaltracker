"use client"
import { useState } from 'react';
import Modal from 'react-modal';
import { Task } from '../_types/types';

interface CreateGoalModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  addNewGoal: (title: string, description: string, tasks: Task[]) => Promise<void>;
}

const CreateGoalModal = ({
  isOpen,
  onRequestClose,
  addNewGoal,
}: CreateGoalModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await addNewGoal(title, description, tasks);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Criar Nova Meta"
      className="modal"
      overlayClassName="overlay"
    >
      <form onSubmit={handleSubmit}>
        {/* Campos de input para title, description e tasks */}
        <button type="submit">Criar Meta</button>
      </form>
    </Modal>
  );
};

export default CreateGoalModal;
