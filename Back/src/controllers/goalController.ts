import { PrismaClient } from '@prisma/client';
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
      where: { id: parseInt(id, 10) },  // Converter id para número
      include: { tasks: true }
    });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
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

  console.log("Request body:", req.body);

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ error: "Tasks should be an array." });
  }

  const validStatuses = ["todo", "done"];
  if (tasks.some((task: any) => typeof task.status !== 'string' || !validStatuses.includes(task.status))) {
    return res.status(400).json({ error: "Invalid task status. Allowed values are 'todo' and 'done'." });
  }

  try {
    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        completed,
        tasks: {
          create: tasks.map((task: any) => ({
            name: task.name,
            status: task.status
          }))
        }
      }
    });
    res.json(goal);
  } catch (error) {
    console.error("Error creating goal:", error);
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

  const validStatuses = ["todo", "done"];
  if (tasks && tasks.some((task: any) => !validStatuses.includes(task.status))) {
    return res.status(400).json({ error: "Invalid task status. Allowed values are 'todo' and 'done'." });
  }

  try {
    const goal = await prisma.goal.update({
      where: { id: parseInt(id, 10) },  // Converter id para número
      data: {
        title,
        description,
        completed,
        tasks: {
          create: tasks ? tasks.filter((task: any) => !task.id) : [], // Create new tasks
          update: tasks ? tasks.filter((task: any) => task.id).map((task: any) => ({
            where: { id: parseInt(task.id, 10) }, // Converter id para número
            data: {
              name: task.name,
              status: task.status
            }
          })) : [], // Update existing tasks
        }
      }
    });
    res.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
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
      where: { id: parseInt(id, 10) }  // Converter id para número
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
