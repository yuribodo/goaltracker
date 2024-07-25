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

  const fetchGoals = async () => {
    try {
      const response = await axios.get('http://localhost:8080/goals');
      setGoals(response.data.map((goal: Goal) => ({ ...goal, tasks: goal.tasks || [] })));
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
      completed: false, // Assumindo que novas metas começam como não concluídas
      tasks: Array.isArray(newTasks) ? newTasks.map(task => ({
        name: task.name,
        status: task.status
      })) : [] // Garantir que tasks seja um array
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
