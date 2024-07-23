const { PrismaClient } = require('@prisma/client');
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export const getGoals = async (req: Request, res: Response) => {
  try {
    const goals = await prisma.goal.findMany({
      include: { tasks: true }
    });
    res.json(goals);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const getGoalById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: Number(id) },
      include: { tasks: true }
    });
    res.json(goal);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const createGoal = async (req: Request, res: Response) => {
  const { title, description, completed, tasks } = req.body;
  
  const validStatuses = ["todo", "done"];
  if (tasks.some((task: any) => !validStatuses.includes(task.status))) {
    return res.status(400).json({ error: "Invalid task status. Allowed values are 'todo' and 'done'." });
  }

  try {
    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        completed,
        tasks: {
          create: tasks
        }
      }
    });
    res.json(goal);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const updateGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed, tasks } = req.body;

  if (tasks) {
    const validStatuses = ["todo", "done"];
    if (tasks.some((task: any) => !validStatuses.includes(task.status))) {
      return res.status(400).json({ error: "Invalid task status. Allowed values are 'todo' and 'done'." });
    }
  }

  try {
    const goal = await prisma.goal.update({
      where: { id: Number(id) },
      data: { title, description, completed, tasks: tasks ? { create: tasks } : undefined }
    });
    res.json(goal);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const deleteGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.goal.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};
