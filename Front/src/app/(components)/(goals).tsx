"use client";

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
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

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [goalModalIsOpen, setGoalModalIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTasks, setNewTasks] = useState<Task[]>([]);

  const refreshGoals = async () => {
    try {
      const response = await axios.get('http://localhost:8080/goals');
      setGoals(response.data.map((goal: Goal) => ({ ...goal, tasks: goal.tasks || [] })));
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/goals');
        const data = response.data;
        setGoals(data.map((goal: Goal) => ({ ...goal, tasks: goal.tasks || [] })));
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchData();
  }, []);

  const addNewGoal = async (event: React.FormEvent) => {
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

    try {
      const response = await axios.post('http://localhost:8080/goals', newGoal);
      setGoals([...goals, response.data]);
      closeModal();
    } catch (error) {
      console.error("Error adding new goal:", error);
    }
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

  const toggleTaskStatus = async (taskId: number) => {
    if (!selectedGoal) return;

    // Atualiza a tarefa localmente
    const updatedTasks = selectedGoal.tasks.map(task =>
      task.id === taskId ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task
    );

    // Atualiza a meta localmente
    const updatedGoal = {
      ...selectedGoal,
      tasks: updatedTasks,
      itemsCompleted: updatedTasks.filter(task => task.status === 'done').length,
    };

    // Atualiza o estado local
    setSelectedGoal(updatedGoal);
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );

    try {
      // Atualiza a meta no backend
      await axios.put(`http://localhost:8080/goals/${updatedGoal.id}`, updatedGoal);
      // Atualiza a lista de metas
      await refreshGoals();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    if (!selectedGoal) return;

    const updatedTasks = selectedGoal.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    const updatedGoal = {
      ...selectedGoal,
      tasks: updatedTasks,
      itemsCompleted: updatedTasks.filter(task => task.status === 'done').length,
    };

    setSelectedGoal(updatedGoal);
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));

    try {
      await axios.put(`http://localhost:8080/goals/${updatedGoal.id}`, updatedGoal);
    } catch (error) {
      console.error("Error updating task:", error);
    }
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
        {goals
          .filter(goal => !goal.completed) // Filtra para mostrar apenas metas não completadas
          .map((goal) => (
            <motion.div
                key={goal.id}
                onClick={() => openModalGoal(goal)}
                className="px-8 py-6 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-2xl hover:border-blue-300 border border-transparent transition-shadow duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{goal.title}</h2>
              <h3 className="text-base text-gray-600 mb-2">{goal.itemsCompleted}/{goal.itemsTotal} itens</h3>
              <p className="text-sm text-gray-700 mt-1">{goal.description}</p>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                  <motion.div
                    style={{ width: `${(goal.itemsCompleted / goal.itemsTotal) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(goal.itemsCompleted / goal.itemsTotal) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
              </div>
              
              <p className="text-sm">{goal.completed ? 'Concluída' : 'Não Concluída'}</p>
              <h3 className="font-bold mt-2">Tarefas:</h3>
              <ul>
                {goal.tasks.map((task) => (
                  <li key={task.id} className="flex items-center">
                    <span className="mr-2">{task.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {task.status}
                    </span>
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
                <h2 className="text-3xl font-bold">{selectedGoal.title}</h2>
                <button onClick={closeModalGoal} className="text-red-500 text-2xl">×</button>
              </div>
              <p className="text-lg mt-2">{selectedGoal.description}</p>
              <p className="text-sm mt-2">{selectedGoal.itemsCompleted}/{selectedGoal.itemsTotal} itens</p>
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
              <h3 className="font-bold mt-4">Tarefas:</h3>
              <ul>
                {selectedGoal.tasks.map((task) => (
                  <li key={task.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() => toggleTaskStatus(task.id)}
                      className="mr-2"
                    />
                    <span>{task.name}</span>
                  </li>
                ))}
              </ul>
              <form onSubmit={addTask} className="mt-4">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Nova tarefa"
                  className="border p-2 rounded w-full"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-2">Adicionar Tarefa</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Nova Meta"
        className="modal"
        overlayClassName="overlay"
      >
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
            <h2 className="text-2xl font-bold">Adicionar Nova Meta</h2>
            <form onSubmit={addNewGoal} className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium">Título</label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Título da meta"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Descrição</label>
                <textarea
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  placeholder="Descrição da meta"
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tarefas</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Nome da nova tarefa"
                  className="border p-2 rounded w-full"
                />
                <button type="button" onClick={addTask} className="bg-blue-500 text-white p-2 rounded mt-2">Adicionar Tarefa</button>
                <ul className="mt-2">
                  {newTasks.map(task => (
                    <li key={task.id} className="flex justify-between items-center border-b py-2">
                      <span>{task.name}</span>
                      <button
                        type="button"
                        onClick={() => setNewTasks(newTasks.filter(t => t.id !== task.id))}
                        className="text-red-500"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Adicionar Meta</button>
            </form>
            <button onClick={closeModal} className="mt-4 text-red-500">Cancelar</button>
          </motion.div>
        </motion.div>
      </Modal>
    </div>
  );
};

export default Goals;
