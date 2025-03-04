import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;
  // TODO:  Remove when auth is done
  userId: string;
  username: string;
}
