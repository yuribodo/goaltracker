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
            key={goal.id}
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
        contentLabel="Goal Modal"
        className="max-w-lg w-full mx-auto mt-20 bg-white rounded p-8 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        {selectedGoal && (
          <>
            <h2 className="text-xl font-bold mb-4">{selectedGoal.title}</h2>
            <h3 className="text-sm mb-2">Descrição: {selectedGoal.description}</h3>
            <h3 className="text-sm mb-2">Progresso: {selectedGoal.itemsCompleted}/{selectedGoal.itemsTotal}</h3>
            <ul className='space-y-2'>
              {selectedGoal.tasks.map(task => (
                <motion.li
                  key={task.id}
                  className='flex items-center justify-between bg-gray-100 p-2 rounded'
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
            <button onClick={closeModalGoal} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Fechar</button>
          </>
        )}
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Goal Modal"
        className="max-w-lg w-full mx-auto mt-20 bg-white rounded p-8 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Adicionar Nova Meta</h2>
        <form onSubmit={addNewGoal}>
          <input
            type="text"
            placeholder="Título da Meta"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            placeholder="Descrição da Meta"
            value={newGoalDescription}
            onChange={(e) => setNewGoalDescription(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          ></textarea>
          <h3 className="font-bold mb-2">Adicionar Tarefas</h3>
          <div className='flex'>
            <input
              type="text"
              placeholder="Nome da Tarefa"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded mr-2"
            />
            <button type="button" onClick={addTask} className="bg-blue-500 text-white py-2 px-4 rounded">Adicionar</button>
          </div>
          <ul className='mt-2'>
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
          <div className="flex justify-end mt-4">
            <button type="button" onClick={closeModal} className="mr-4 bg-gray-500 text-white py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Adicionar Meta</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Goals;
