export interface IPost {
  id?: string;
  title: string;
  text: string;
  photo?: string;
  likes?: string[];
  dislikes?: string[];
  likesCount?: number;
  dislikesCount?: number;
  owner: string;
  comments?: string[];
}
