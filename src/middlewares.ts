import { NextFunction, Request, Response } from 'express';
import { QueryConfig, QueryResult } from 'pg';
import { client } from './database';

const movieExistsMiddleware = async (
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

export { movieExistsMiddleware };
