/* eslint-disable prettier/prettier */
// app.module.ts
import { Module } from '@nestjs/common';
import { LocationModule } from './location/location.module';

@Module({
  imports: [LocationModule],
})
export class AppModule {}


