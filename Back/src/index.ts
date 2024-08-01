import express from 'express'

import cors from 'cors';
import goalRouter from './routes/goalRoutes';
import taskRouter from './routes/taskRoutes';
import userRouter from './routes/userRoutes';
const app = express()
const port = process.env.PORT || 8080;

app.use(cors());

app.use(express.json())

app.use('/goals', goalRouter)
app.use('/tasks', taskRouter)
app.use('/users', userRouter)

app.get('/ping', (req, res) => {
    res.json({message: "pong"}).status(200)
})

app.listen(port, () => {
    console.log(`Server up and running on port: ${port}`)
})