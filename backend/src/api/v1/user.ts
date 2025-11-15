import { Router, Request, Response } from 'express';
import { userModule } from '../../modules/user';
import { securityModule } from '../../modules/security';
import { protectedRoute } from '../../middlewares/protectedRoute';

const router = Router();

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

router.get('/', protectedRoute, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const user = await userModule.Queries.GetByIdQuery.execute(userId);
    
    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    // Exclude password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal server error');
  }
});

router.put('/', protectedRoute, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { username, email, password } = req.body;

    // Validate that at least one field is provided
    if (!username && !email && !password) {
      res.status(400).send('At least one field (username, email, or password) must be provided');
      return;
    }

    // Validate email format if provided
    if (email && !validateEmail(email)) {
      res.status(400).send('Invalid email format');
      return;
    }

    // Check if user exists
    const existingUser = await userModule.Queries.GetByIdQuery.execute(userId);
    if (!existingUser) {
      res.status(404).send('User not found');
      return;
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await userModule.Queries.GetByEmailQuery.execute(email);
      if (emailExists) {
        res.status(409).send('Email already in use');
        return;
      }
    }

    // Prepare update data
    const updateData: { username?: string; email?: string; password?: string } = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    
    // Hash password if provided
    if (password) {
      const passwordHash = await securityModule.Commands.HashPasswordCommand.execute(password);
      updateData.password = passwordHash;
    }

    // Update user
    const updatedUser = await userModule.Commands.UpdateCommand.execute(userId, updateData);

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal server error');
  }
});

export default router;
