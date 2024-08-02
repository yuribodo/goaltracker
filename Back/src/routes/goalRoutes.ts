import { Router } from "express";

import { getGoals, getGoalById, createGoal, updateGoal, deleteGoal, getGoalsByUsername } from "../controllers/goalController";

const goalRouter = Router();

goalRouter.get('/', getGoals);
goalRouter.get('/:id', getGoalById);
goalRouter.post('/', createGoal);
goalRouter.put('/:id', updateGoal);
goalRouter.delete('/:id', deleteGoal);
goalRouter.get('/user/:username', getGoalsByUsername);

export default goalRouter;
