import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OutletModule } from './outlet/outlet.module';
import { ReviewModule } from './review/review.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [AuthModule, UserModule, OutletModule, ReviewModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
