import { Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { TMovie, TMovieRequest } from './interfaces';
import { client } from './database';
import format from 'pg-format';

const createMovie = async (req: Request, res: Response): Promise<Response> => {
  const movieData: TMovieRequest = req.body;

  const queryString: string = format(
    `      
      INSERT INTO movies
        (%I)
      VALUES
        (%L)
      RETURNING *;
    
    `,
    Object.keys(movieData),
    Object.values(movieData)
  );

  const queryResult: QueryResult<TMovie> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

const listMovies = async (req: Request, res: Response): Promise<Response> => {
  const category: string = String(req.query.category);

  let queryResult: QueryResult;

  if (category) {
    const queryString: string = `
        
        SELECT * 
        FROM movies
        WHERE category = $1

      `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [category],
    };

    queryResult = await client.query(queryConfig);

    if (queryResult.rowCount === 0) {
      const queryString: string = `
        
        SELECT * 
        FROM movies
      
      `;
      queryResult = await client.query(queryString);
    }
  } else {
    const queryString: string = `
        
        SELECT * 
        FROM movies
        
    `;

    queryResult = await client.query(queryString);
  }

  return res.json(queryResult.rows);
};

const retrieveMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const movie: TMovie = res.locals.movie;

  return res.json(movie);
};

const updateMovie = async (req: Request, res: Response): Promise<Response> => {
  const movieData: Partial<TMovieRequest> = req.body;
  const movieId: number = Number(req.params.id);
  const id = 'id';

  if (Reflect.has(movieData, id)) {
    return res.status(400).json({
      error: 'it is not possible to change id',
    });
  }

  const queryString: string = format(
    `
            UPDATE movies
            SET(%I) = ROW(%L)
            WHERE id = $1
            RETURNING *;

        `,
    Object.keys(movieData),
    Object.values(movieData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [movieId],
  };

  const queryResult: QueryResult<TMovie> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
  const id = Number(req.params.id);

  const queryString: string = `
    
    DELETE
    FROM movies
    WHERE id = $1
  
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

export { createMovie, listMovies, retrieveMovie, updateMovie, deleteMovie };
