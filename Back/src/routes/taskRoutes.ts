import { Router } from "express";

import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/taskController'

const taskRouter = Router();

taskRouter.get('/', getTasks);
taskRouter.get('/:id', getTaskById);
taskRouter.post('/', createTask);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);

export default taskRouter;
