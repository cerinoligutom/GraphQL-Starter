import { Request, Response } from 'express';
import { UniqueID } from '../types';

export interface IContext {
  userId?: UniqueID | null;

  req: Request;
  res: Response;
}
