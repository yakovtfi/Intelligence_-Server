import { getUserByUsername } from '../utils/fileHandler.js';

export async function authenticate(req, res, next) {
  const username = req.headers['x-username'];
  const password = req.headers['x-password'];

  if (!username || !password) {
    return res.status(401).json({ 
      error: 'Missing credentials',
      message: 'Please provide x-username and x-password headers' 
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (!user || user.password !== password) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect' 
      });
    }

    req.user = { username: user.username };
    next();

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to authenticate user' 
    });
  }
}
