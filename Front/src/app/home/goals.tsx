"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Snackbar, Alert } from '@mui/material';
import GoalList from './GoalList';
import useSnackbar from './_hooks/useSnackbar';
import useGoals from './_hooks/useGoals';
import GoalModal from './GoalModal';
import CreateGoalModal from './CreateGoalModal';

const Goals = () => {
  const {
    goals,
    fetchGoals,
    addNewGoal,
    deleteGoal,
    toggleTaskStatus,
    handleTaskUpdate,
    selectedGoal,
    modalIsOpen,
    openModal,
    closeModal,
    openModalGoal,
    closeModalGoal,
    goalModalIsOpen,
  } = useGoals();

  const { snackbarOpen, snackbarMessage, snackbarSeverity, handleSnackbarClose } = useSnackbar();

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

      <GoalList goals={goals} openModalGoal={openModalGoal} />

      <CreateGoalModal
        isOpen={modalIsOpen} // Usando a variável correta
        onRequestClose={closeModal}
        addNewGoal={addNewGoal}
      />

      <GoalModal
        isOpen={goalModalIsOpen} // Usando a variável correta
        onRequestClose={closeModalGoal}
        goal={selectedGoal}
        toggleTaskStatus={toggleTaskStatus}
        handleTaskUpdate={handleTaskUpdate}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Goals;
