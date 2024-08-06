"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import GoalCard from '../_components/goalCard'; 
import { Goal } from '../_types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import {jwtDecode} from 'jwt-decode';

const api = process.env.NEXT_PUBLIC_API_LINK;

const GoalsList = () => {
  const [goalsState, setGoalsState] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const fetchGoals = async () => {
    if (!token) return;
    try {
      const decodedToken: { id: string } = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get(`${api}/goals/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data: Goal[] = response.data;
      const completedGoals = data.filter(goal => goal.completed);
      setGoalsState(completedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [token]);

  const deleteGoal = async (goalId: number): Promise<void> => {
    try {
      await axios.delete(`${api}/goals/${goalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSnackbarMessage('Meta deletada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      console.log('Goal deleted successfully');
      await fetchGoals(); // Atualiza a lista de metas após a exclusão
    } catch (error) {
      setSnackbarMessage('Erro ao deletar meta.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('Error deleting goal:', error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Carregando...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <button 
        onClick={() => window.history.back()} 
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Voltar
      </button>

      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">Metas Concluídas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goalsState.length > 0 ? (
          goalsState.map(goal => (
            <div key={goal.id} className="relative">
              <GoalCard goal={goal} />
              <button
                onClick={() => deleteGoal(goal.id)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                Deletar
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhuma meta concluída encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default GoalsList;
