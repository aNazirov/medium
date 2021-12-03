import { NextFunction, Request, Response } from 'express';
import { customErrorHandler } from '../utils';
import { Users } from '../models';
import { config } from 'dotenv';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

config();

class Controller {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const candidate = await Users.default.findOne({ email });
    if (!candidate) return customErrorHandler(res, { message: 'Пароль или email не верны попробуйте снова.' }, 401);
    const passwordResult = bcryptjs.compareSync(password, candidate.password);
    if (!passwordResult) return customErrorHandler(res, { message: 'Пароль или email не верны попробуйте снова.' }, 401);
    try {
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate.id,
      }, process.env.key, { expiresIn: 3600 });
      res.status(200).json({
        token,
      });
    } catch (e) {
      customErrorHandler(res, { message: 'Во время получения токена что то пошло не так. Попробуйте снова' }, 500);
    }
  }

  async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await Users.default.findOne({ email });
    if (user) return customErrorHandler(res, { message: 'Пользователь с таким email уже существует' });
    const salt = bcryptjs.genSaltSync(10);
    try {
      await Users.default.create({
        id: Date.now(),
        email,
        password: bcryptjs.hashSync(password, salt),
        posts: [],
        rating: 0
      });
      res.status(201).json({
        status: 'ok',
        message: 'Пользователь успешно создан',
      });
    } catch (e) {
      customErrorHandler(res, { message: e });
    }
  };
}

export default new Controller();