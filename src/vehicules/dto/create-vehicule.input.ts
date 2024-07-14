import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { MarqueEnum } from '../../enums/marque.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TypeEnum } from '../../enums/type.enum';
import { Client } from '../../users/entities/client.entity';

@InputType()
export class CreateVehiculeInput {
  @IsNotEmpty()
  @Field(() => MarqueEnum)
  @IsEnum(MarqueEnum)
  marque: MarqueEnum;
  @IsNotEmpty()
  @Field(() => String)
  modele: string;
  @Field(() => TypeEnum)
  @IsEnum(TypeEnum)
  @IsNotEmpty()
  type: TypeEnum;
  @Field(() => String)
  @IsNotEmpty()
  numChassis: string;
  @Field(() => String)
  @IsNotEmpty()
  immatriculation: string;
  @Field(() => String)
  @IsNotEmpty()
  annee: string;
  @Field(() => String)
  @IsNotEmpty()
  couleur: string;
  @Field(() => Int)
  @IsNotEmpty()
  kilometrage: number;
  @IsNotEmpty()
  @Field(() => ID)
  clientID: string;
}
