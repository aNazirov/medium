import path from 'path';
import DB from '../utils/db';
import { Users } from '../models';
import { IPost } from '../interfaces';

class Posts extends DB {
  constructor() {
    super(path.join(__dirname, '../../database/posts.json'), 'posts');
  }

  async createPost(post: IPost) {
    await Users.default.findByIdAndUpdate(+post.author.id, { posts: [...post.author.posts, post.id] });
    return this.create({ ...post, author: +post.author.id })
      .then(post => post);
  }
}

export default new Posts();