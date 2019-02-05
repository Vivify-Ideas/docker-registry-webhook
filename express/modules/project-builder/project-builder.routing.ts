import { Router } from 'express';
import { ProjectBuilderController } from './project-builder.controller';
import { Response, Request } from 'express';

const router = Router();
const controller = new ProjectBuilderController();

router.post('/', async (req: Request, res: Response) => {
  try {
    const msg = await controller.startBuild(req.body)
    res.send(msg);
  } catch(err) {
    res.send(err);
  }
})

export const projectBuilderRouter = router;