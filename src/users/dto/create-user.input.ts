import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { SexeEnum } from '../../enums/sexe.enum';
import { Optional } from '@nestjs/common';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => Int)
  @IsNotEmpty()
  cin: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  password?: string;

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

  @Field(() => SexeEnum, { nullable: true })
  @IsOptional()
  sexe: SexeEnum;

  @Field(() => Date)
  @IsNotEmpty()
  dateNaissance: Date;

  @Field(() => String)
  @IsNotEmpty()
  emploi: string;
}
