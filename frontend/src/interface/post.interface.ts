import { Timestamp } from "firebase/firestore";
import { IComment } from "./comment.interface";
export interface IPost {
  id: string;
  title: string;
  text: string;
  photo?: string;
  likes?: string[];
  dislikes?: string[];
  likesCount?: number;
  dislikesCount?: number;
  commentsCount?: number;
  owner: string;
  comments?: IComment[];
  createdAt?: Timestamp;
}

export interface ICreatePost {
  title: string;
  text: string;
  photo?: string;
  owner: string;
}
