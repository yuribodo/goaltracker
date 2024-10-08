"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AiOutlineCheck, AiOutlineLoading3Quarters, AiOutlineUnorderedList } from 'react-icons/ai';
import { Goal } from '../_types/types';
import { jwtDecode } from "jwt-decode";
const api = process.env.NEXT_PUBLIC_API_LINK;

export default function Header() {
  const [stats, setStats] = useState({
    totalGoals: 0,
    inProgress: 0,
    completed: 0
  });
  const token = localStorage.getItem('token'); // Ajuste conforme o local onde o token é armazenado

  const fetchData = async () => {
    if (!token) return;

    try {
      const decodedToken: { id: string } = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.get(`${api}/goals/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }); // URL da API
      const goals: Goal[] = response.data;

      // Calculate statistics
      const totalGoals = goals.length;
      const inProgress = goals.filter(goal => !goal.completed).length;
      const completed = goals.filter(goal => goal.completed).length;

      setStats({
        totalGoals,
        inProgress,
        completed
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
  }, [fetchData]);

  return (
    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white min-h-[15vh] flex flex-col justify-between p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <motion.h1 
          className="text-2xl sm:text-3xl font-extrabold tracking-tight" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Gerenciador de Metas
        </motion.h1>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AiOutlineUnorderedList className="text-2xl mb-1" />
          <h2 className="text-md font-semibold">Todas as Metas</h2>
          <div className="text-2xl font-extrabold">{stats.totalGoals}</div>
        </motion.div>
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AiOutlineLoading3Quarters className="text-2xl mb-1 animate-spin" />
          <h2 className="text-md font-semibold">Em Progresso</h2>
          <div className="text-2xl font-extrabold">{stats.inProgress}</div>
        </motion.div>
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <AiOutlineCheck className="text-2xl mb-1" />
          <h2 className="text-md font-semibold">Completas</h2>
          <div className="text-2xl font-extrabold">{stats.completed}</div>
        </motion.div>
      </div>
    </div>
  );
}
