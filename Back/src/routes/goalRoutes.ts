import { Router } from "express";

import { getGoals, getGoalById, createGoal, updateGoal, deleteGoal, getGoalsByUsername, getGoalsByUserId } from "../controllers/goalController";

const goalRouter = Router();

goalRouter.get('/', getGoals);
goalRouter.get('/:id', getGoalById);
goalRouter.post('/', createGoal);
goalRouter.put('/:id', updateGoal);
goalRouter.delete('/:id', deleteGoal);
goalRouter.get('/user/:username', getGoalsByUsername);
goalRouter.get('/user/:id', getGoalsByUserId);

export default goalRouter;
