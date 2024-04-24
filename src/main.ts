import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Banco Simplificado API')
    .setDescription('descrição do banco simplificado')
    .setVersion('1.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //transforma os parametros da requisição em objetos
      whitelist: true, //remove os campos que não estão definidos no DTO
      forbidNonWhitelisted: true, //retorna um erro caso tenha campos não definidos no DTO
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); //adiciona o container do nestjs para o class-validator
  await app.listen(3000);
}
bootstrap();