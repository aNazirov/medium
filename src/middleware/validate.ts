import validator from 'validator';
import { NextFunction, Request, Response } from 'express';
import { customErrorHandler } from '../utils';


export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let message: string[] = [];
  if (!email) message = [...message, 'Поле email не должно быть пустым'];
  if (email && !validator.isEmail(email)) message = [...message, 'Невалидный адрес email'];
  if (!password) message = [...message, 'Пароль не может быть пустым'];
  if (message.length) return customErrorHandler(res, { message }, 422);
  next();
};
export const validatePostCreate = (req: Request, res: Response, next: NextFunction) => {
  const { title, content } = req.body;

  let message: string[] = [];

  if (!title) message = [...message, 'Поле заголовок не должно быть пустым'];
  if (!content) message = [...message, 'Контент не может быть пустым'];

  if (message.length) return customErrorHandler(res, { message }, 422);

  next();
};
export const validatePostRating = (req: Request, res: Response, next: NextFunction) => {
  const { rating, postId } = req.body;

  let message: string[] = [];
  if (!rating) message = [...message, 'rating не может быть пустым'];
  if (!postId) message = [...message, 'postId не может быть пустым'];
  if (rating && !(rating === -1 || 1)) message = [...message, 'rating должен быть равен -1 или 1'];
  if (postId && !validator.isInt(postId.toString())) message = [...message, 'Некорректный postId'];

  if (message.length) return customErrorHandler(res, { message }, 422);
  next();
};

export const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;
  let message: string[] = [];

  if ((page || page === '') && !validator.isInt(page.toString())) message = [...message, 'Параметр запроса page должент быть числом'];
  if ((limit || limit === '') && !validator.isInt(limit.toString())) message = [...message, 'Параметр запроса limit должент быть числом'];

  if (message.length) return customErrorHandler(res, { message }, 422);
  next();
};