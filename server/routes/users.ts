import { Router, Request, Response } from 'express';

const router = Router();

// Example user route
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'User route works!' });
});

export default router;