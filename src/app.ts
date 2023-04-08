import express, { Application } from 'express';
import { createMovie, listMovies, retrieveMovie } from './logic';
import { startDatabase } from './database';
import { movieExistsMiddleware } from './middlewares';

const app: Application = express();
app.use(express.json());

app.post('/movies', createMovie);
app.get('/movies', listMovies);
app.get('/movies/:id', movieExistsMiddleware, retrieveMovie);

const PORT = 3000;

app.listen(PORT, async () => {
  await startDatabase();
  console.log(`Server is running on port ${PORT}`);
});
