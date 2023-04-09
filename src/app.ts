import express, { Application } from 'express';
import {
  createMovie,
  deleteMovie,
  listMovies,
  retrieveMovie,
  updateMovie,
} from './logic';
import { startDatabase } from './database';
import { movieIdExistsMiddleware, movieNameExists } from './middlewares';

const app: Application = express();
app.use(express.json());

app.post('/movies', movieNameExists, createMovie);
app.get('/movies', listMovies);
app.get('/movies/:id', movieIdExistsMiddleware, retrieveMovie);
app.patch('/movies/:id', movieIdExistsMiddleware, movieNameExists, updateMovie);
app.delete('/movies/:id', movieIdExistsMiddleware, deleteMovie);

const PORT = 3000;

app.listen(PORT, async () => {
  await startDatabase();
  console.log(`Server is running on port ${PORT}`);
});
