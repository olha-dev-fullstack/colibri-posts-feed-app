// src/posts/dto/post.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsUrl()
  photo?: string;

  likes: string[] = [];
  dislikes: string[] = [];
  likesCount: number = 0;
  dislikesCount: number = 0;

  @IsNotEmpty()
  @IsString()
  owner: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsUrl()
  photo?: string;
}
