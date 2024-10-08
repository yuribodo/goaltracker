const { PrismaClient } = require('@prisma/client');
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};


export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) }
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};


export const createTask = async (req: Request, res: Response) => {
  const { name, status, goalId } = req.body;
  const validStatuses = ["todo", "done"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid task status. Allowed values are 'todo' and 'done'." });
  }

  try {
    const task = await prisma.task.create({
      data: { name, status, goalId }
    });
    res.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};



export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status } = req.body;

  const validStatuses = ["todo", "done"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid task status. Allowed values are 'todo' and 'done'." });
  }

  try {
    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { name, status }
    });
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error("Error deleting task:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};
