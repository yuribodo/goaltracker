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
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newTaskName, setNewTaskName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/goals.json');
      const data = await response.json();
      setGoals(data.map((goal: Goal) => ({ ...goal, tasks: goal.tasks || [] }))); // Inicializa as metas com ou sem tarefas
    };

    fetchData();
  }, []);

  const addNewGoal = () => {
    if (goals.length >= 8) {
      alert('Limite máximo de 8 metas atingido.');
      return;
    }

    const newGoal: Goal = {
      id: goals.length + 1,
      title: newGoalTitle,
      description: newGoalDescription,
      itemsCompleted: 0,
      itemsTotal: 5,
      completed: false,
      tasks: []
    };

    setGoals([...goals, newGoal]);
    closeModal();
  };

  const addTask = (goalId: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newTask: Task = {
          id: goal.tasks.length + 1,
          name: newTaskName,
          status: 'todo'
        };
        return {
          ...goal,
          tasks: [...goal.tasks, newTask]
        };
      }
      return goal;
    });

    setGoals(updatedGoals);
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
  };

  const openModalGoal = () => {
    setGoalModalIsOpen(true);
  };

  const closeModal1 = () => {
    setGoalModalIsOpen(false);
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
            <div onClick={openModalGoal} className="px-6 py-6 bg-gray-200 rounded-lg shadow-md ">
              <h2 className="font-bold text-lg">{goal.title}</h2>
              <h3 className="text-sm">{goal.itemsCompleted}/{goal.itemsTotal} itens</h3>
              <p className="text-sm">{goal.description}</p>
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
        onRequestClose={closeModal1}
        contentLabel='Modal da Meta'
        className="modal"
        overlayClassName="overlay"
      >
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50'>
          <div className='bg-gray-300 rounded-lg p-8 max-w-xl w-full'>
            <div className='flex justify-between'>
              <h2 className='text-3xl font-bold mb-4'>GOal XXXX</h2>
              <p onClick={closeModal1} className=' font-bold cursor-pointer'>X</p>
            </div>
            
            <div className='flex'>
              <h3 className='mr-1 font-semibold'>Tasks Completed:  </h3>
              <p> 3/5 tasks</p>
            </div>
            <div className='flex flex-col mt-2'>
              <h3 className='font-semibold'>Descricao</h3>
              <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio esse, excepturi labore modi nulla similique beatae id, dolores laborum omnis odit vel repellendus pariatur error sed maiores. Voluptatem, quia explicabo?</p>
            </div>
            <div className='flex flex-col'>
              <h3 className='mt-2 font-semibold'>Taks</h3>
              <p className=' font-semibold mt-2'>Task 1</p>
              <p className=''> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus commodi laborum excepturi dolorem molestia.</p>
              <div className='flex'>
                <p className='font-semibold'>Status:</p>
                <p> Done</p>
              </div>
              
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal */}
      
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
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => addTask(goals.length + 1)} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">Adicionar Tarefa</button>
                <button type="submit" className="bg-green-500 text-white py-2 px-4 ml-2 rounded-lg hover:bg-green-600 transition-colors">Salvar Meta</button>
                <button onClick={closeModal} className="ml-2 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Goals;
