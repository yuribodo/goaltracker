"use client";

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Link from 'next/link';

interface Task {
  id: number;
  name: string;
  status: 'done' | 'todo';
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/goals.json');
      const data = await response.json();
      setGoals(data.map((goal: Goal) => ({ ...goal, tasks: goal.tasks || [] })));
    };

    fetchData();
  }, []);

  const addNewGoal = (event: React.FormEvent) => {
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

    setGoals([...goals, newGoal]);
    closeModal();
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

  return (
    <div className="flex justify-between">
      <div className="flex justify-between">
        <div className="flex space-x-2 py-6 px-6">
          <div onClick={openModal} className="flex items-center justify-center cursor-pointer bg-blue-500 rounded-full h-12 w-12 text-white text-3xl font-bold">+</div>
          <div className="flex h-12 items-center">
            <h1 className="text-xl font-bold">Nova Meta</h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mr-20 py-6">
        {goals.map((goal) => (
          <div key={goal.id} onClick={() => openModalGoal(goal)} className="px-6 py-6 bg-gray-200 rounded-lg shadow-md cursor-pointer">
            <h2 className="font-bold text-lg">{goal.title}</h2>
            <h3 className="text-sm">{goal.itemsCompleted}/{goal.itemsTotal} itens</h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${(goal.itemsCompleted / goal.itemsTotal) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
            <p className="text-sm mt-2">{goal.description}</p>
            <p className="text-sm">{goal.completed ? 'Concluída' : 'Não Concluída'}</p>
            <h3 className="font-bold mt-2">Tarefas:</h3>
            <ul>
              {goal.tasks.map((task) => (
                <li key={task.id} className="flex items-center">
                  <span className="mr-2">{task.name}</span>
                  <span className={`px-2 py-1 rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}>{task.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Modal
        isOpen={goalModalIsOpen}
        onRequestClose={closeModalGoal}
        contentLabel='Modal da Meta'
        className="modal"
        overlayClassName="overlay"
      >
        {selectedGoal && (
          <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50'>
            <div className='bg-white rounded-lg p-8 max-w-xl w-full'>
              <div className='flex justify-between'>
                <h2 className='text-3xl font-bold mb-4'>{selectedGoal.title}</h2>
                <button onClick={closeModalGoal} className='text-red-500 font-bold cursor-pointer'>X</button>
              </div>
              <div className='mb-4'>
                <h3 className='text-lg font-semibold'>Progresso</h3>
                <p className='text-sm'>{selectedGoal.itemsCompleted}/{selectedGoal.itemsTotal} tarefas concluídas</p>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                    <div style={{ width: `${(selectedGoal.itemsCompleted / selectedGoal.itemsTotal) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                  </div>
                </div>
              </div>
              <div className='mb-4'>
                <h3 className='text-lg font-semibold'>Descrição</h3>
                <p className='text-sm'>{selectedGoal.description}</p>
              </div>
              <div className='mb-4'>
                <h3 className='text-lg font-semibold'>Tarefas</h3>
                <ul className='space-y-2'>
                  {selectedGoal.tasks.map(task => (
                    <li key={task.id} className='flex items-center justify-between bg-gray-100 p-2 rounded'>
                      <span>{task.name}</span>
                      <span className={`px-2 py-1 rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}>{task.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal de Nova Meta"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Nova Meta</h2>
            <form onSubmit={addNewGoal} className="space-y-4">
              <label className="block text-sm font-medium">Título:</label>
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
                required
              />
              <label className="block text-sm font-medium">Descrição:</label>
              <textarea
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full h-20 resize-none"
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium">Nova Tarefa:</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
                <button type="button" onClick={addTask} className="bg-blue-500 text-white py-2 px-4 mt-2 rounded-lg hover:bg-blue-600 transition-colors">Adicionar Tarefa</button>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">Salvar Meta</button>
                <button onClick={closeModal} type="button" className="ml-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              </div>
            </form>
            <ul className='mt-4'>
              {newTasks.map(task => (
                <li key={task.id} className='flex items-center justify-between bg-gray-100 p-2 rounded mt-2'>
                  <span>{task.name}</span>
                  <span className={`px-2 py-1 rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'}`}>{task.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Goals;
