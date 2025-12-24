import { readData, writeData } from './fileSystem.js';

export async function getAllUsers() {
  return await readData('users.json');
}

export async function getUserByUsername(username) {
  const users = await readData('users.json');
  
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      return users[i];
    }
  }
  
  return null;
}

export async function createUser(user) {
  const users = await readData('users.json');
  
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === user.username) {
      throw new Error('Username already exists');
    }
  }
  
  users.push(user);
  await writeData('users.json', users);
  return user;
}

export async function updateUser(username, updates) {
  const users = await readData('users.json');
  
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      if (updates.password) {
        users[i].password = updates.password;
      }
      
      await writeData('users.json', users);
      return users[i];
    }
  }
  
  throw new Error('User not found');
}

export async function deleteUser(username) {
  const users = await readData('users.json');
  
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      const deleted = users[i];
      users.splice(i, 1);
      await writeData('users.json', users);
      return deleted;
    }
  }
  
  throw new Error('User not found');
}
