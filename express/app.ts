import express from 'express';
import bodyParser from 'body-parser';

import { projectBuilderRouter } from './modules/project-builder/project-builder.routing';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', projectBuilderRouter);

export default app;
