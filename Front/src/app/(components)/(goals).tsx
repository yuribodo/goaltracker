"use client";

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import axios from 'axios';
import GoalCard from './(goalCard)';
import { Goal, Task } from '../(types)/types';


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
          .filter(goal => !goal.completed) // Filtra para mostrar apenas metas não concluídas
          .map(goal => (
            <GoalCard key={goal.id} goal={goal} onClick={() => openModalGoal(goal)} />
          ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Adicionar Nova Meta"
        className="flex items-center justify-center h-full"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Adicionar Nova Meta</h2>
          <form onSubmit={addNewGoal}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Título da Meta
              </label>
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="border border-gray-300 rounded-md w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Descrição da Meta
              </label>
              <textarea
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                className="border border-gray-300 rounded-md w-full py-2 px-3"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tarefas
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="border border-gray-300 rounded-md w-full py-2 px-3"
                />
                <button
                  type="button"
                  onClick={addTask}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Adicionar Tarefa
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Salvar Meta
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {selectedGoal && (
        <Modal
          isOpen={goalModalIsOpen}
          onRequestClose={closeModalGoal}
          contentLabel="Detalhes da Meta"
          className="flex items-center justify-center h-full"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">{selectedGoal.title}</h2>
            <p className="mb-4">{selectedGoal.description}</p>
            <div className="mb-4">
              <h3 className="font-bold">Tarefas:</h3>
              <ul>
                {selectedGoal.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between mb-2"
                  >
                    <span>{task.name}</span>
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {task.status === 'done' ? 'Concluído' : 'Pendente'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModalGoal}
                className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Goals;
