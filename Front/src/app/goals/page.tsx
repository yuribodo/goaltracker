"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import GoalCard from '../_components/goalCard'; // Certifique-se de ajustar o caminho do arquivo conforme necessário
import { Goal } from '../_types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const GoalsList = () => {
  const [goalsState, setGoalsState] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/goals'); // Substitua pelo endpoint correto da sua API
        const data: Goal[] = response.data;
        const completedGoals = data.filter(goal => goal.completed);
        setGoalsState(completedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Carregando...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Botão de Voltar com ícone */}
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
            <GoalCard key={goal.id} goal={goal} />
          ))
        ) : (
          <p className="text-center text-gray-500">Nenhuma meta concluída encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default GoalsList;
