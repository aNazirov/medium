import { customErrorHandler } from '../utils';
import { config } from 'dotenv';
import { Posts } from '../models';
import { Request, Response } from 'express';
import { Users } from '../models';

config();

interface IRequest extends Request {
  user: any;
}

class Controller {

  async getPostsByUserId(req: IRequest, res: Response) {
    const { id } = req.params;
    const { page, limit = 10 } = req.query;
    const user = await Users.default.findOne({ id: +id });
    if (!user) return customErrorHandler(res, { message: `Пользователя с id ${id} не найдено` }, 404);
    try {
      const posts = await Posts.default.find()
        .then(posts => {
          return posts.filter(post => user.posts.includes(post.id));
        })
        .then(posts => {
          if (page) {
            posts = posts.filter((post, i) => i + 1 > ((+page - 1) * +limit) && i + 1 <= ((+page - 1) * +limit + +limit));
          }
          return posts;
        });

      res.status(200).json({
        status: 'ok',
        message: posts,
      });
    } catch (e) {
      customErrorHandler(res, { message: e });
    }
  };

  async getUsers(req: IRequest, res: Response) {
    const { page, limit = 10 } = req.query;
    try {
      const posts = await Users.default.find(+page, +limit);
      res.status(200).json({
        status: 'ok',
        message: posts,
      });
    } catch (e) {
      customErrorHandler(res, { message: e });
    }
  };
}

export default new Controller();