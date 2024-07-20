import { Router } from "express";

import { getGoals, getGoalById, createGoal, updateGoal, deleteGoal } from "../controllers/goalController";

const goalRouter = Router();

goalRouter.get('/', getGoals);
goalRouter.get('/:id', getGoalById);
goalRouter.post('/', createGoal);
goalRouter.put('/:id', updateGoal);
goalRouter.delete('/:id', deleteGoal);

module.exports = goalRouter;
