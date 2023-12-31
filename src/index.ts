import dotenv from "dotenv";
import dotenvExpand from 'dotenv-expand';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import useDevCORS from "./middleware/use-dev-cors";
import { checkAuth} from "./middleware/use-jwt-auth";
import productRouter from './routes/product-routes';
import purchaseRouter from './routes/purchase-routes';
import authRouter from './routes/auth-routes';
import useErrorHandler from "./middleware/use-error-handling";
import sequelizeConfig from "./sequelize/client";
import initDatabase from "./sequelize/init-database";

// Config env
const envConfig = dotenv.config();
dotenvExpand.expand(envConfig)

// Create app
const app: Express = express();

// Services
app.use(bodyParser.json());
app.use(useDevCORS);
app.use(checkAuth);

// REST
app.use('/product', productRouter);
app.use('/purchase', purchaseRouter);
app.use('/auth', authRouter);

// Middleware
app.use(useErrorHandler);

// Start app
const dbPort = process.env.DB_PORT_OUT!;
const sequelize = sequelizeConfig;

sequelize.authenticate()
    .then((result) => {
        // Sequelize
        console.log('[SYSTEM] syncing sequelize models...');
        initDatabase();
        console.log('[SYSTEM] syncing finished')

        // App
        console.log(`[SYSTEM] app started on port ${+process.env.APP_PORT_INSIDE!}`)
        app.listen(+process.env.APP_PORT_INSIDE!, '0.0.0.0')
    })
    .catch((error) => {
        console.log(error.message);
        //console.log(`[ERROR] Could not connect to database (port: ${dbPort})`)
    })
