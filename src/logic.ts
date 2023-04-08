import { Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { TMovie } from './interfaces';
import { client } from './database';

const createMovie = async (req: Request, res: Response): Promise<Response> => {
  const queryString: string = `
        
        INSERT INTO movies
            (name, category, duration, price)
        VALUES
            ('Homem aranha', 'fantasia', 120, 30)
        RETURNING *;
    
    `;

  const queryResult: QueryResult<TMovie> = await client.query(queryString);

  console.log(queryResult);

  return res.status(201).json(queryResult.rows[0]);
};

const listMovies = async (req: Request, res: Response): Promise<Response> => {
  const queryString: string = `
        
        SELECT * 
        FROM movies

    `;

  const queryResult: QueryResult<TMovie> = await client.query(queryString);

  return res.json(queryResult.rows);
};

const retrieveMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const movie: TMovie = res.locals.movie;

  return res.json(movie);
};

export { createMovie, listMovies, retrieveMovie };
