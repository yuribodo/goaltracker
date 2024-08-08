"use client";

import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import axios from 'axios';
import GoalCard from './goalCard';
import { jwtDecode } from "jwt-decode";
import { Goal, Task } from '../_types/types';
const api = process.env.NEXT_PUBLIC_API_LINK;
import { Snackbar, Alert } from '@mui/material';

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [goalModalIsOpen, setGoalModalIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTasks, setNewTasks] = useState<Task[]>([]);
  const token = localStorage.getItem('token'); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const fetchGoals = useCallback(
    async () => {
      if (!token) return;
    
      try {
        // Decodifica o token para obter o userId
        const decodedToken: { id: string } = jwtDecode(token);
        const userId = decodedToken.id;
        const response = await axios.get(`${api}/goals/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const loadedGoals = response.data.map((goal: Goal) => ({
          ...goal,
          tasks: goal.tasks || []
        }));
        setGoals(loadedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    },[]
  ) 
  // Chama fetchGoals quando o componente é montado
  useEffect(() => {
    fetchGoals();
  }, []);
    

  const addNewGoal = async (event: React.FormEvent) => {
    event.preventDefault();

    if (goals.length >= 8) {
      alert('Limite máximo de 8 metas atingido.');
      return;
    }

    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }

    // Decodifica o token para obter o userId
    let userId: string;

    try {
      // O tipo do decodedToken pode ser ajustado conforme a estrutura do seu token
      const decodedToken: { id: string } = jwtDecode(token);
      userId = decodedToken.id; 
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return;
    }

    const newGoal = {
      title: newGoalTitle,
      description: newGoalDescription,
      completed: false,
      tasks: newTasks.map(task => ({
        name: task.name,
        status: task.status
      })),
      userId: userId // Adiciona o userId ao corpo da requisição
    };

    try {
      const response = await axios.post(`${api}/goals`, newGoal);
      await fetchGoals();
      setSnackbarMessage('Meta criada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      closeModal();
    } catch (error) {
      setSnackbarMessage('Erro ao criar meta.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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

  const deleteGoal = async (goalId: number): Promise<void> => {
    try {
      await axios.delete(`${api}/goals/${goalId}`);
      setSnackbarMessage('Meta deletada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      console.log('Goal deleted successfully');
      // Atualiza a lista de metas após a exclusão
      await fetchGoals();
    } catch (error) {
      setSnackbarMessage('Erro ao deletar meta.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      if (axios.isAxiosError(error)) {
        console.error('Error deleting goal:', error.message);
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };
  
  // Exemplo de uso na sua aplicação React
  const handleDelete = (goalId: number) => {
    deleteGoal(goalId);
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
        contentLabel="Nova Meta"
        className="modal"
        overlayClassName="overlay"
      >
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 rounded-lg p-8 max-w-lg w-full shadow-xl"
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition duration-300"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-6">Adicionar Nova Meta</h2>
            <form onSubmit={addNewGoal} className="space-y-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">Título</label>
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Título da meta"
                  className="border border-gray-200 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">Descrição</label>
                <textarea
                  value={newGoalDescription}
                  onChange={(e) => setNewGoalDescription(e.target.value)}
                  placeholder="Descrição da meta"
                  className="border border-gray-200 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">Tarefas</label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Nome da nova tarefa"
                    className="border border-gray-200 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
                  />
                  <button
                    type="button"
                    onClick={addTask}
                    className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Adicionar
                  </button>
                </div>
                <ul className="mt-4">
                  {newTasks.map((task, index) => (
                    <li key={index} className="p-2 bg-gray-700 text-white rounded-lg mb-2">
                      {task.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </Modal>

        <div className="flex flex-wrap justify-center gap-4 p-6">
        {goals.length === 0 ? (
          <div className="text-center text-gray-700 text-lg font-semibold">
            Crie sua primeira meta
          </div>
        ) : (
          goals
            .filter(goal => !goal.completed) // Filtrando metas não concluídas
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

      <Modal
        isOpen={goalModalIsOpen}
        onRequestClose={closeModalGoal}
        contentLabel="Detalhes da Meta"
        className="modal"
        overlayClassName="overlay"
      >
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl relative overflow-hidden transform-gpu"
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={closeModalGoal}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                {selectedGoal && (
                  <>
                    <h2 className="text-xl font-bold mb-1">{selectedGoal.title}</h2>
                    <p className="text-lg font-semibold">{selectedGoal.description}</p>
                  </>
                )}
              </div>
            </div>

            {selectedGoal && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Progresso</h3>
                <div className="relative h-4 bg-gray-300 rounded-full">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                    style={{ width: `${calculateProgress()}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-gray-800 mt-2">{calculateProgress().toFixed(0)}% concluído</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tarefas</h3>
              <ul className="list-disc pl-5 space-y-2">
                {selectedGoal?.tasks.map(task => (
                  <li key={task.id} className="flex items-center text-gray-800">
                    <input
                      type="checkbox"
                      checked={task.status === 'done'}
                      onChange={() => toggleTaskStatus(task.id)}
                      className={`mr-3 cursor-pointer ${task.status === 'done' ? 'bg-green-500' : 'bg-gray-300'} transition-colors rounded-md`}
                    />
                    <span className={`text-lg ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeModalGoal}
                className="bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-lg text-lg transition duration-200"
              >
                Fechar
              </button>
            </div>
            <div className="mt-6">
            <button
                onClick={() => {
                  if (selectedGoal?.id) {
                    const confirmDelete = window.confirm("Você realmente deseja deletar esta meta?");
                    if (confirmDelete) {
                      deleteGoal(selectedGoal.id).then(() => {
                        closeModalGoal();
                      });
                    }
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
              >
                Deletar Meta
              </button>

        </div>
          </motion.div>
        </motion.div>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Goals;
