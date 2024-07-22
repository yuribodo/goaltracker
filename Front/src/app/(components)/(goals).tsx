"use client";

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import Link from 'next/link';

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

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [goalModalIsOpen, setGoalModalIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTasks, setNewTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/goals.json');
      const data = await response.json();
      setGoals(data.map((goal: Goal) => ({ ...goal, tasks: goal.tasks || [] })));
    };

    fetchData();
  }, []);

  const addNewGoal = (event: React.FormEvent) => {
    event.preventDefault();

    if (goals.length >= 8) {
      alert('Limite máximo de 8 metas atingido.');
      return;
    }

    const newGoal: Goal = {
      id: goals.length + 1,
      title: newGoalTitle,
      description: newGoalDescription,
      itemsCompleted: 0,
      itemsTotal: newTasks.length,
      completed: false,
      tasks: newTasks
    };

    setGoals([...goals, newGoal]);
    closeModal();
  };

  const addTask = () => {
    if (!newTaskName) return;

    const newTask: Task = {
      id: newTasks.length + 1,
      name: newTaskName,
      status: 'todo'
    };

    setNewTasks([...newTasks, newTask]);
    setNewTaskName('');
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewGoalTitle('');
    setNewGoalDescription('');
    setNewTaskName('');
    setNewTasks([]);
  };

  const openModalGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setGoalModalIsOpen(true);
  };

  const closeModalGoal = () => {
    setGoalModalIsOpen(false);
    setSelectedGoal(null);
  };

  const toggleTaskStatus = (taskId: number) => {
    if (!selectedGoal) return;

    const updatedTasks = selectedGoal.tasks.map(task =>
      task.id === taskId ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task
    );

    const updatedGoal = {
      ...selectedGoal,
      tasks: updatedTasks,
      itemsCompleted: updatedTasks.filter(task => task.status === 'done').length,
    };

    setSelectedGoal(updatedGoal);
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  return (
    <div className="flex justify-between">
      <div className="flex justify-between">
        <div className="flex space-x-2 py-6 px-6">
          <motion.div
            onClick={openModal}
            className="flex items-center justify-center cursor-pointer bg-blue-500 rounded-full h-12 w-12 text-white text-3xl font-bold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            +
          </motion.div>
          <div className="flex h-12 items-center">
            <h1 className="text-xl font-bold">Nova Meta</h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mr-20 py-6">
        {goals.map((goal) => (
          <motion.div
            key={goal.id} // Adicione a prop key aqui
            onClick={() => openModalGoal(goal)}
            className="px-6 py-6 bg-gray-200 rounded-lg shadow-md cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="font-bold text-lg">{goal.title}</h2>
            <h3 className="text-sm">{goal.itemsCompleted}/{goal.itemsTotal} itens</h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                <motion.div
                  style={{ width: `${(goal.itemsCompleted / goal.itemsTotal) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(goal.itemsCompleted / goal.itemsTotal) * 100}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>
            <p className="text-sm mt-2">{goal.description}</p>
            <p className="text-sm">{goal.completed ? 'Concluída' : 'Não Concluída'}</p>
            <h3 className="font-bold mt-2">Tarefas:</h3>
            <ul>
              {goal.tasks.map((task) => (
                <li key={task.id} className="flex items-center">
                  <span className="mr-2">{task.name}</span>
                  <span className={`px-2 py-1 rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}>{task.status}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={goalModalIsOpen}
        onRequestClose={closeModalGoal}
        contentLabel="Modal da Meta"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedGoal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-xl w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between">
                <h2 className="text-3xl font-bold mb-4">{selectedGoal.title}</h2>
                <button onClick={closeModalGoal} className="text-red-500 font-bold cursor-pointer">X</button>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Progresso</h3>
                <p className="text-sm">{selectedGoal.itemsCompleted}/{selectedGoal.itemsTotal} tarefas concluídas</p>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <motion.div
                      style={{ width: `${(selectedGoal.itemsCompleted / selectedGoal.itemsTotal) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedGoal.itemsCompleted / selectedGoal.itemsTotal) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Descrição</h3>
                <p className="text-sm">{selectedGoal.description}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Tarefas</h3>
                <ul className="space-y-2">
                  {selectedGoal.tasks.map(task => (
                    <motion.li
                      key={task.id} // Adicione a prop key aqui
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{task.name}</span>
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`px-2 py-1 rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}
                      >
                        {task.status}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Modal de Nova Meta'
        className="modal"
        overlayClassName="overlay"
      >
        <motion.div
          className='fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className='bg-white rounded-lg p-8 max-w-xl w-full'
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex justify-between'>
              <h2 className='text-3xl font-bold mb-4'>Adicionar Nova Meta</h2>
              <button onClick={closeModal} className='text-red-500 font-bold cursor-pointer'>X</button>
            </div>
            <form onSubmit={addNewGoal}>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='goalTitle'>
                  Título da Meta
                </label>
                <input
                  id='goalTitle'
                  type='text'
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='goalDescription'>
                  Descrição
                </label>
                <textarea
                  id='goalDescription'
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='taskName'>
                  Adicionar Tarefas
                </label>
                <div className='flex mb-2'>
                  <input
                    id='taskName'
                    type='text'
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                  />
                  <button
                    type='button'
                    onClick={addTask}
                    className='ml-2 bg-blue-500 text-white rounded px-4 py-2'
                  >
                    Add
                  </button>
                </div>
                <ul>
                  {newTasks.map(task => (
                    <li key={task.id} className='flex justify-between items-center border-b py-2'>
                      <span>{task.name}</span>
                      <button
                        onClick={() => setNewTasks(newTasks.filter(t => t.id !== task.id))}
                        className='text-red-500'
                      >
                        X
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='flex justify-end'>
                <button
                  type='submit'
                  className='bg-blue-500 text-white rounded px-4 py-2'
                >
                  Adicionar Meta
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </Modal>
    </div>
  );
};

export default Goals;
