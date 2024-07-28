"use client";

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import axios from 'axios';
import GoalCard from './(goalCard)';
import { Goal, Task } from '../(types)/types';
const api = process.env.NEXT_PUBLIC_API_LINK;

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [goalModalIsOpen, setGoalModalIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTasks, setNewTasks] = useState<Task[]>([]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${api}/goals`);
      const loadedGoals = response.data.map((goal: Goal) => ({
        ...goal,
        tasks: goal.tasks || []
      }));
      setGoals(loadedGoals);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addNewGoal = async (event: React.FormEvent) => {
    event.preventDefault();

    if (goals.length >= 8) {
      alert('Limite máximo de 8 metas atingido.');
      return;
    }

    const newGoal = {
      title: newGoalTitle,
      description: newGoalDescription,
      completed: false,
      tasks: newTasks.map(task => ({
        name: task.name,
        status: task.status
      }))
    };

    try {
      const response = await axios.post(`${api}/goals`, newGoal);
      await fetchGoals();
      closeModal();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error adding new goal:", error.message);
      } else {
        console.error("Unexpected error adding new goal:", error);
      }
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
    setSelectedGoal({ ...goal, tasks: goal.tasks || [] });
    setGoalModalIsOpen(true);
  };

  const closeModalGoal = () => {
    setGoalModalIsOpen(false);
    setSelectedGoal(null);
  };

  const toggleTaskStatus = async (taskId: number) => {
    if (!selectedGoal) return;

    const updatedTasks = selectedGoal.tasks.map(task =>
      task.id === taskId ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task
    );

    const allTasksDone = updatedTasks.every(task => task.status === 'done');

    const updatedGoal = {
      ...selectedGoal,
      tasks: updatedTasks,
      completed: allTasksDone,
      itemsCompleted: updatedTasks.filter(task => task.status === 'done').length,
    };

    setSelectedGoal(updatedGoal);
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );

    try {
      await axios.put(`${api}/goals/${updatedGoal.id}`, updatedGoal);
      await fetchGoals();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    if (!selectedGoal) return;

    const updatedTasks = selectedGoal.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    const allTasksDone = updatedTasks.every(task => task.status === 'done');

    const updatedGoal = {
      ...selectedGoal,
      tasks: updatedTasks,
      completed: allTasksDone,
      itemsCompleted: updatedTasks.filter(task => task.status === 'done').length,
    };

    setSelectedGoal(updatedGoal);
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));

    try {
      await axios.put(`${api}/goals/${updatedGoal.id}`, updatedGoal);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const calculateProgress = () => {
    if (!selectedGoal) return 0;

    const totalTasks = selectedGoal.tasks.length;
    const completedTasks = selectedGoal.tasks.filter(task => task.status === 'done').length;

    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex justify-between w-full">
        <div className="flex space-x-2 py-6 px-6">
          <motion.div
            onClick={openModal}
            className="flex items-center justify-center cursor-pointer bg-blue-500 rounded-full h-12 w-12 text-white text-3xl font-bold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            +
          </motion.div>
          <div className="flex items-center justify-center">
            <motion.h2
              className="text-2xl font-bold text-gray-700"
              whileHover={{ scale: 1.05 }}
            >
              Criar Meta
            </motion.h2>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Criar Meta"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-8 w-11/12 md:w-1/2 lg:w-1/3">
          <h2 className="text-2xl font-bold mb-4">Criar Nova Meta</h2>
          <form onSubmit={addNewGoal}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="description">Descrição</label>
              <textarea
                id="description"
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="tasks">Tarefas</label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  id="tasks"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <button
                  type="button"
                  onClick={addTask}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Adicionar
                </button>
              </div>
              <ul className="space-y-2">
                {newTasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                    <span>{task.name}</span>
                    <button className="px-3 py-1 bg-gray-100 rounded-full text-sm">{task.status}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Criar
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="flex flex-wrap justify-center gap-4 p-6">
        {goals.map((goal) => (
          <motion.div
            key={goal.id}
            className="w-full md:w-1/2 lg:w-1/3 p-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <GoalCard goal={goal} onClick={() => openModalGoal(goal)} />
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={goalModalIsOpen}
        onRequestClose={closeModalGoal}
        contentLabel="Detalhes da Meta"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-8 w-11/12 md:w-1/2 lg:w-1/3">
          {selectedGoal && (
            <>
              <h2 className="text-2xl font-bold mb-4">{selectedGoal.title}</h2>
              <p className="mb-4">{selectedGoal.description}</p>
              <ul className="space-y-2 mb-4">
                {selectedGoal.tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                    <span>{task.name}</span>
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        task.status === 'done' ? 'bg-green-200' : 'bg-gray-200'
                      }`}
                    >
                      {task.status}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end">
                <button
                  onClick={closeModalGoal}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Fechar
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Goals;
