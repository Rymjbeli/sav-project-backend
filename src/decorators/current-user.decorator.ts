/*import { createParamDecorator } from '@nestjs/common';
import { GraphQLExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator((data, context: GraphQLExecutionContext) => {
  try {
    const headers = context.getArgs()[2].req.headers;
    if (headers.user) {
      return JSON.parse(headers.user);
    }
  } catch (e) {
    return null
  }
})*/

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
