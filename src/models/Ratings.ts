import path from 'path';
import DB from '../utils/db';
import { IRating } from '../interfaces';
import { Posts, Users } from '../models';

class Ratings extends DB {
  constructor() {
    super(path.join(__dirname, '../../database/ratings.json'), 'ratings');
  }



  async createRating(rating: IRating) {
    const post = await Posts.default.findOne({ id: rating.postId });
    if (!post) throw new Error('Статья не найдена')
    const user = await Users.default.findOne({ id: post?.author });
    await Posts.default.findByIdAndUpdate(rating.postId, { rating: post?.rating + +rating.value });
    if (user) {
      await Users.default.findByIdAndUpdate(user?.id, { rating: user.rating + +rating.value });
    }

    return this.create(rating)
      .then(rating => rating);
  }
  async setRating(rating: IRating, ratingValue: number) {
    const post = await Posts.default.findOne({ id: rating.postId });
    if (!post) throw new Error('Статья не найдена')
    const user = await Users.default.findOne({ id: post?.author });
    await Posts.default.findByIdAndUpdate(rating.postId, { rating: post?.rating + ratingValue });
    if (user) {
      await Users.default.findByIdAndUpdate(user.id, { rating: user?.rating + ratingValue });
    }

    return this.findByIdAndUpdate(rating.id, {value: rating.value + ratingValue})
      .then(rating => rating);
  }
}

export default new Ratings();