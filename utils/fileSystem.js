import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = './data';

export async function initializeFiles() {
  try {
    const dirExists = await fs.stat(DATA_DIR).catch(() => null);
    
    if (!dirExists) {
      await fs.mkdir(DATA_DIR);
      console.log('Created data directory');
    }

    const files = ['agents.json', 'reports.json', 'users.json'];

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = path.join(DATA_DIR, fileName);
      
      const fileExists = await fs.stat(filePath).catch(() => null);
      
      if (!fileExists) {
        await fs.writeFile(filePath, '[]');
        console.log('Created ' + fileName);
      }
    }
  } catch (error) {
    console.error('Error initializing files:', error);
    throw error;
  }
}

export async function readData(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ' + filename + ':', error.message);
    throw new Error('Failed to read data from ' + filename);
  }
}

export async function writeData(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString);
  } catch (error) {
    console.error('Error writing ' + filename + ':', error.message);
    throw new Error('Failed to write data to ' + filename);
  }
}
