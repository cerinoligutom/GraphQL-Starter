import { Request, Response } from 'express';
import { UniqueID } from '../types';

export interface IContext {
  req?: Request;
  res?: Response;

  /**
   * The ID of the user who is making the request.
   *
   * This field will only be populated from the create context middleware.
   * */
  readonly userId: UniqueID | null;
}
