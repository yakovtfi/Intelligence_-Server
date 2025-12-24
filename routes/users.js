import express from 'express';
import { 
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser
} from '../utils/fileHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const users = await getAllUsers();
    
    const usersWithoutPasswords = users.map(u => ({ username: u.username }));
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'username and password are required' 
      });
    }

    const newUser = await createUser({ username, password });
    
    res.status(201).json({ 
      username: newUser.username,
      message: 'User created successfully' 
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.message === 'Username already exists') {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:username', authenticate, async (req, res) => {
  try {
    const { username } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ 
        error: 'Missing required field',
        message: 'password is required' 
      });
    }

    const updatedUser = await updateUser(username, { password });
    
    res.json({ 
      username: updatedUser.username,
      message: 'Password updated successfully' 
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:username', authenticate, async (req, res) => {
  try {
    const { username } = req.params;

    const deletedUser = await deleteUser(username);
    
    res.json({ 
      username: deletedUser.username,
      message: 'User deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
