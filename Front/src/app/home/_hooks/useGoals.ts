"use client"

import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Goal, Task } from '@/app/_types/types';
import {jwtDecode} from 'jwt-decode';

const api = process.env.NEXT_PUBLIC_API_LINK;

const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [goalModalIsOpen, setGoalModalIsOpen] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para buscar metas do usuário
  const fetchGoals = useCallback(async () => {
    if (!token) return;

    try {
      const decodedToken: { id: string } = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get(`${api}/goals/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  }, [token]);

  // Efeito para buscar metas na montagem do componente
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Função para adicionar uma nova meta
  const addNewGoal = async (title: string, description: string, tasks: Task[]) => {
    if (!token) return;

    try {
      const decodedToken: { id: string } = jwtDecode(token);
      const userId = decodedToken.id;

      const newGoal = {
        title,
        description,
        userId,
        tasks,
      };

      const response = await axios.post(`${api}/goals`, newGoal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGoals(prevGoals => [...prevGoals, response.data]);
      closeModal();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  // Função para deletar uma meta
  const deleteGoal = async (goalId: number) => {
    if (!token) return;

    try {
      await axios.delete(`${api}/goals/${goalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
      closeModalGoal();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  // Função para alternar o status de uma tarefa
  const toggleTaskStatus = async (taskId: number) => {
    if (!token || !selectedGoal || !selectedGoal.tasks) return;
  
    try {
      const updatedTasks = selectedGoal.tasks.map(task =>
        task.id === taskId ? { ...task, status: task.status === 'done' ? 'todo' : 'done' } : task
      );
  
      const updatedGoal = {
        ...selectedGoal,
        tasks: updatedTasks,
      };
  
      setSelectedGoal(updatedGoal);
  
      await axios.put(`${api}/tasks/${taskId}`, { status: updatedGoal.tasks.find(task => task.id === taskId)?.status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setGoals(prevGoals =>
        prevGoals.map(goal => (goal.id === selectedGoal.id ? updatedGoal : goal))
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  

  // Função para atualizar uma tarefa (nome ou status)
  const handleTaskUpdate = async (task: Task) => {
    if (!token) return;

    try {
      const response = await axios.put(`${api}/tasks/${task.id}`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTask = response.data;

      const updatedTasks = selectedGoal?.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
      const updatedGoal = { ...selectedGoal, tasks: updatedTasks } as Goal;

      setSelectedGoal(updatedGoal);

      setGoals(prevGoals =>
        prevGoals.map(goal => (goal.id === updatedGoal.id ? updatedGoal : goal))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Função para abrir o modal de criação de meta
  const openModal = () => setModalIsOpen(true);

  // Função para fechar o modal de criação de meta
  const closeModal = () => setModalIsOpen(false);

  // Função para abrir o modal de detalhes da meta
  const openModalGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setGoalModalIsOpen(true);
  };

  // Função para fechar o modal de detalhes da meta
  const closeModalGoal = () => setGoalModalIsOpen(false);

  return {
    goals,
    fetchGoals,
    addNewGoal,
    deleteGoal,
    toggleTaskStatus,
    handleTaskUpdate,
    selectedGoal,
    openModal,
    closeModal,
    openModalGoal,
    closeModalGoal,
    modalIsOpen,
    goalModalIsOpen,
  };
};

export default useGoals;
