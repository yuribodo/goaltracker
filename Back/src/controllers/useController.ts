import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      include: { goals: true } // Inclui as metas do usuário
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Verificar se o nome de usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ errorCode: 'USERNAME_TAKEN', message: 'Nome de usuário já está em uso. Por favor, escolha outro.' });
    }

    // Verificar se o e-mail já está em uso
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return res.status(400).json({ errorCode: 'EMAIL_TAKEN', message: 'Este e-mail já está em uso. Tente outro.' });
    }

    // Hash da senha antes de armazenar
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      }
    });

    res.status(201).json(user);
  } catch (error: unknown) {
    console.error('Error in createUser:', error);
    if (error instanceof Error) {
      res.status(500).json({ errorCode: 'INTERNAL_ERROR', message: 'Ocorreu um erro ao criar a conta. Tente novamente mais tarde.' });
    } else {
      res.status(500).json({ errorCode: 'UNKNOWN_ERROR', message: 'Ocorreu um erro desconhecido.' });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    // Atualiza apenas os campos fornecidos
    const data: { email?: string; password?: string; username?: string } = {};
    if (email) data.email = email;
    if (username) data.username = username;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data
    });

    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id, 10) }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};
