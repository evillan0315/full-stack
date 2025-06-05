import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path'; // Prefer 'join' from 'path' directly
import { Logger } from '@nestjs/common';
import * as hbs from 'hbs'; // Import hbs for direct use
import { registerHandlebarsHelpers } from './common/helpers/hbs-helpers'; // Import your helper registration function

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // --- Configuration Variables ---
  const NODE_ENV = configService.get<string>('NODE_ENV') || 'development';
  const port = configService.get<number>('PORT', 5000);
  const base_url =
    configService.get<string>('BASE_URL') || `http://localhost:${port}`;
  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED') || false;

  // Define allowed CORS origins
  const allowedOrigins = [
    'https://board-api.duckdns.org',
    'http://localhost:5000',
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  // --- Static Assets and View Engine Setup ---

  // Set the base directory for your views (templates).
  // Assumes 'views' is at the project root level, sibling to 'src'.
  // Resolved path will be like: /media/eddie/Data/projects/nestJS/nest-modules/full-stack/dist/views
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Register Handlebars partials.
  // Assumes 'partials' is inside your 'views' directory (views/partials).
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  logger.log(
    `Registering partials from: ${join(__dirname, '..', 'views/partials')}`,
  );

  // Set default layout for all views.
  // This layout file should be located at views/layouts/main.hbs
  app.set('view options', {
    layout: 'layouts/main',
  });

  // Register all your custom Handlebars helpers.
  // This function, imported from hbs-helpers.ts, should contain ALL your custom helpers.
  // Ensure that 'encodeURIComponent', 'formatBytes', 'dirname' are defined there.
  registerHandlebarsHelpers();

  // --- Static Asset Serving ---

  // Serve static assets from the 'public' directory.
  // Assumes 'public' is at the project root level, sibling to 'src'.
  // Assets will be available under /public/ in the browser.
  // Example: http://localhost:3000/public/styles/global.css
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });
  logger.log(
    `Serving static assets from: ${join(__dirname, '..', 'public')} under prefix /public/`,
  );

  // Serve 'downloads' directory (assuming it's at the project root) under '/api/media/' prefix.
  // This directory might contain user-uploaded or generated files you want to expose.
  // Example: http://localhost:3000/api/media/some_downloaded_file.pdf
  const downloadDir = join(process.cwd(), 'downloads'); // Use process.cwd() if 'downloads' is relative to launch dir
  // Or, if 'downloads' is a sibling to 'src' and 'public' at project root:
  // const downloadDir = join(__dirname, '..', 'downloads');
  app.useStaticAssets(downloadDir, {
    prefix: '/api/media/',
  });
  logger.log(`Serving downloads from: ${downloadDir} under prefix /api/media/`);

  // --- Middleware Setup ---
  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.error(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // --- Swagger Setup ---
  if (swaggerEnabled && NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Auth API')
      .setDescription('Authentication and Role Protected APIs')
      .setVersion('1.0')
      .addTag('Auth')
      .addBearerAuth()
      .addCookieAuth('jwt')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
    logger.log('🥞 Swagger is enabled at /api');
  } else {
    logger.log('🚫 Swagger is disabled in production.');
  }

  // --- Graceful Shutdown ---
  app.enableShutdownHooks();

  // --- Application Start ---
  await app.listen(port);
  logger.log(`Application is running on: ${base_url}`);
}

bootstrap();
