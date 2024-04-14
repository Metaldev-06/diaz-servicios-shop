import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export const HandleDBExceptions = (error: any, ctx: string) => {
  const logger = new Logger(ctx);

  if (error.code === '23505') throw new BadRequestException(error.detail);

  logger.error(error);
  throw new InternalServerErrorException('Unexpected error, check server logs');
};
