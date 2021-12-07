import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan'
import passport from 'passport'
import { AuthRouter, PostRouter, UserRouter } from './routes';
import passportStatic from './middleware/passport';
import { clientErrorHandler, errorHandler, errorNotFound, logErrors } from './utils';

const app = express();

app.use(passport.initialize())
passportStatic(passport)
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', AuthRouter.default);
app.use('/post', PostRouter.default);
app.use('/user', UserRouter.default);
app.use(errorNotFound);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

export default app;