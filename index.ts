import express, { Express, Request, Response, Application, NextFunction } from 'express';
import dotenv from 'dotenv';
import { UserController } from './controller/UserController';
import bodyParser from 'body-parser';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userController = new UserController(); // Create an instance of UserController

app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  await userController.createUser(req, res, next); // Call the createUser method on the instance
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
