import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { client } from './database';
import { TMovie } from './interfaces';

const movieIdExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = Number(req.params.id);

  const queryString: string = `
        SELECT *
        FROM movies
        WHERE id = $1
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TMovie> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      error: 'Movie not found!',
    });
  }

  res.locals.movie = queryResult.rows[0];

  return next();
};

const movieNameExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  //req.body não é pra ser tipado, pois ele é tipo any
  const name = req.body.name;

  const queryString: string = `
    SELECT *
    FROM movies
    WHERE name = $1
  
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult<TMovie> = await client.query(queryConfig);

  if (queryResult.rowCount === 1) {
    return res.status(409).json({
      error: 'Movie name already exists!',
    });
  }

  return next();
};

export { movieIdExistsMiddleware, movieNameExistsMiddleware };
