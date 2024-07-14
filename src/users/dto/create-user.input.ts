import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { SexeEnum } from '../../enums/sexe.enum';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => Int)
  @IsNotEmpty()
  cin: number;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  nom: string;

  @Field(() => String)
  @IsNotEmpty()
  prenom: string;

  @Field(() => String)
  @IsNotEmpty()
  telephone: string;

  @Field(() => String)
  @IsNotEmpty()
  adresse: string;

  @Field(() => SexeEnum)
  @IsNotEmpty()
  sexe: SexeEnum;

  @Field(() => Date)
  @IsNotEmpty()
  dateNaissance: Date;

  @Field(() => String)
  @IsNotEmpty()
  emploi: string;
}
