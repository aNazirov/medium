import path from 'path';
import DB from '../utils/db';

class User extends DB {
  constructor() {
    super(path.join(__dirname, '../../database/users.json'), 'users');
  }
}

export default new User();