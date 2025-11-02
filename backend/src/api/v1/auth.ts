import { Router, Request, Response } from 'express';
import { userModule } from '../../modules/user';
import { securityModule } from '../../modules/security';

const router = Router();

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

router.post('/signup', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).send('Missing required fields');
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).send('Invalid email format');
    return;
  }

  const userExists = await userModule.Queries.GetByEmailQuery.execute(email);

  if (userExists) {
    res.status(409).send('User already exists');
    return;
  }

  const passwordHash = await securityModule.Commands.HashPasswordCommand.execute(password);

  const newUser = await userModule.Commands.CreateCommand.execute({ username, email, password: passwordHash });

  const token = await securityModule.Commands.GenerateTokenCommand.execute(newUser.id);

  res.status(201).json({token});
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('Missing required fields');
    return;
  }
  
  const user = await userModule.Queries.GetByEmailQuery.execute(email);

  if (!user) {
    res.status(401).send('Invalid email or password');
    return;
  }

  const isValidPassword = await securityModule.Commands.VerifyPasswordCommand.execute(password, user.password);

  if (!isValidPassword) {
    res.status(401).send('Invalid email or password');
    return;
  }

  const token = await securityModule.Commands.GenerateTokenCommand.execute(user.id);

  res.status(200).json({ token });
});

export default router;
