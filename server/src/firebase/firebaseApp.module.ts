import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAppService } from './firebaseApp.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [FirebaseAppService],
  exports: [FirebaseAppService],
})
export class FirebaseAppModule {}
