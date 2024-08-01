import { Router } from 'express';
import { loginUser, signupUser } from '../controllers/authController';

const authRouter = Router();

authRouter.post('/login', loginUser);
authRouter.post('/signup', signupUser);

export default authRouter;
