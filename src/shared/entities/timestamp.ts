import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class TimestampEntity {
  @CreateDateColumn({ update: false })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date;
}
