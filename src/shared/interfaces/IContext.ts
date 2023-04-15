import { Request, Response } from 'express';

export interface IContext {
  req?: Request;
  res?: Response;

  /**
   * The ID of the user who is making the request.
   *
   * This field will only be populated from the create context middleware.
   * */
  readonly userId: string | null;
}
