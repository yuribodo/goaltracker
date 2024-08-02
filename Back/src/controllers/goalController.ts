import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getGoals = async (req: Request, res: Response) => {
  try {
    const goals = await prisma.goal.findMany({
      include: { tasks: true }
    });
    res.json(goals);
  } catch (error: unknown) {
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
      where: { id: parseInt(id, 10) },
      include: { tasks: true }
    });
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(goal);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const getGoalsByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    // Fetching the user by username
    const user = await prisma.user.findUnique({
      where: { username },
      include: { goals: true }, // Include associated goals
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the goals associated with the user
    return res.status(200).json(user.goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createGoal = async (req: Request, res: Response) => {
  const { title, description, completed, tasks, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

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
        user: { connect: { id: userId } }, // Associa a Goal com um User
        tasks: {
          create: tasks.map((task: any) => ({
            name: task.name,
            status: task.status
          }))
        }
      }
    });
    res.status(201).json(goal);
  } catch (error: unknown) {
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
      where: { id: parseInt(id, 10) },
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
  } catch (error: unknown) {
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
    // Exclua as tarefas associadas e verifique se foram excluídas
    const deletedTasks = await prisma.task.deleteMany({
      where: { goalId: parseInt(id, 10) }
    });
    console.log(`Deleted tasks: ${deletedTasks.count}`);

    // Depois, exclua a meta
    const deletedGoal = await prisma.goal.delete({
      where: { id: parseInt(id, 10) }
    });

    res.json({ message: 'Goal deleted successfully' });
  } catch (error: unknown) {
    console.error("Error deleting goal:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};
