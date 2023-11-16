import { Router } from 'express';

export interface IRoutes {
  create(): Router;
}
