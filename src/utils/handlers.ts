import { NextFunction, Request, Response } from 'express';
import { IError } from '../interfaces';

export const logErrors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  next(error);
}

export const clientErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (req.xhr) {
    res.status(400).json({ message: 'Server error' });
  } else {
    next(error);
  }
};

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: 'Server error' })
}

export const customErrorHandler = (res: Response, error: IError | Error, status: number = 500) => {
  res.status(status).json({
    status: 'error',
    message: error.message ? error.message : error,
  });
};

export const calculateReadingTime = (str: string): number => {
  const symbolsInOneMinute = 880
  const symbols = str.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s{2,}/g," ").length
  return +((symbols / (symbolsInOneMinute/60)) / 60).toFixed(1)
}
