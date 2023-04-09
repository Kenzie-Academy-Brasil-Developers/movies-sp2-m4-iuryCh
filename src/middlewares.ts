import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { client } from './database';

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

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      error: 'Movie not found!',
    });
  }

  res.locals.movie = queryResult.rows[0];

  return next();
};

const movieNameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name: any = req.body.name;
  console.log(name);

  const queryString: string = `
    SELECT *
    FROM movies
    WHERE name = $1
  
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 1) {
    return res.status(409).json({
      error: 'Movie name already exists!',
    });
  }

  return next();
};

export { movieIdExistsMiddleware, movieNameExists };
