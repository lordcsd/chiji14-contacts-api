import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './api/routes/contacts/contact.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

let atlasUrl = `mongodb+srv://lordcsd:GARRAGE12@firstrestfulapi.ms2k2.mongodb.net/chiji14?retryWrites=true&w=majority`;
let compassUrl = 'mongodb://127.0.0.1:27017/chiji14';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.process.env',
      isGlobal: true,
    }),
    ContactsModule,
    MongooseModule.forRoot(atlasUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
