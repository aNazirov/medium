export interface IUser {
  id: number;
  email: string;
  password: string;
  posts: number[];
  rating: number;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  author: any;
  rating: number;
  readingTime: number;
}
export interface IRating {
  id: number;
  userId: number;
  postId: number;
  value: 1 | 0 | -1 | number;
}

export interface IError {
  message: string | string[];
}