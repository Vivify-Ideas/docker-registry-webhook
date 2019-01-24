import { Router } from 'express';
import { ProjectBuilderController } from './project-builder.controller';
import { Response, Request } from 'express-serve-static-core';

const router = Router();
const controller = new ProjectBuilderController();

router.post('/', (req: Request, res: Response) => {
  controller.startBuild(req.body)
    .then((msg: string) => {
      res.send(msg);
    })
    .catch((err) => {
      res.send(err);
    });
})

export const projectBuilderRouter = router;