export { initializeFiles, readData, writeData } from './fileSystem.js';
export { 
  getAllAgents, 
  getAgentById, 
  createAgent, 
  updateAgent, 
  deleteAgent, 
  incrementReportsCount, 
  decrementReportsCount 
} from './agentsIO.js';
export { 
  getAllReports, 
  getReportById, 
  getReportsByAgentId, 
  createReport, 
  updateReport, 
  deleteReport 
} from './reportsIO.js';
export { 
  getAllUsers, 
  getUserByUsername, 
  createUser, 
  updateUser, 
  deleteUser 
} from './usersIO.js';
