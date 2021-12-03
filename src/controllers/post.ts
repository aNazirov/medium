import { calculateReadingTime, customErrorHandler } from '../utils';
import { config } from 'dotenv';
import { Posts } from '../models';
import { Request, Response } from 'express';
import { Ratings } from '../models';

config();

interface IRequest extends Request {
  user: any;
}

class Controller {
  async create(req: IRequest, res: Response) {
    const { title, content } = req.body;

    try {
      const post = await Posts.default.createPost({
        id: Date.now(),
        title,
        content,
        author: req.user,
        rating: 0,
        readingTime: calculateReadingTime(content)
      });
      res.status(201).json({
        status: 'ok',
        message: post,
      });
    } catch (e) {
      customErrorHandler(res, { message: e });
    }
  };

  async getById(req: IRequest, res: Response) {
    const { id } = req.params;
    try {
      const post = await Posts.default.findOne({ id: +id });
      if (!post) return customErrorHandler(res, { message: `Пост с id ${id} не найден` }, 404);
      res.status(200).json({
        status: 'ok',
        message: post,
      });
    } catch (e) {
      customErrorHandler(res, { message: e });
    }
  };

  async getPosts(req: IRequest, res: Response) {
    const { page, limit = 10 } = req.query;
    try {
      const posts = await Posts.default.find(+page, +limit);

      res.status(200).json({
        status: 'ok',
        message: posts,
      });
    } catch (e) {
      customErrorHandler(res, { message: e });
    }
  };

  async setRating(req: IRequest, res: Response) {
    const { rating: ratingValue, postId } = req.body;
    const { id: userId } = req.user;
    const rating = await Ratings.default.findOne({ userId, postId });

    try {
      if (rating) {
        if ((rating.value === 1 && ratingValue === 1) || (rating.value === -1 && ratingValue === -1)) {
          res.status(200).json({
            status: 'ok',
            message: rating,
          });
        } else {
          Ratings.default.setRating(rating, +ratingValue)
            .then(rating => {
              res.status(200).json({
                status: 'ok',
                message: rating,
              });
            })
            .catch(err => res.status(404).json({
              status: 'Error',
              message: err.message
            }))
        }
      }
      if (!rating) {
        Ratings.default.createRating({ id: Date.now(), userId, postId, value: +ratingValue })
          .then(rating => {
            res.status(200).json({
              status: 'ok',
              message: rating,
            });
          })
          .catch(err => res.status(404).json({
            status: 'Error',
            message: err.message
          }))
      }
    } catch (e) {
      customErrorHandler(res, { message: e });
    }
  }
}

export default new Controller();