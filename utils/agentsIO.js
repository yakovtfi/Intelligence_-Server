import { readData, writeData } from './fileSystem.js';

export async function getAllAgents() {
  return await readData('agents.json');
}

export async function getAgentById(id) {
  const agents = await readData('agents.json');
  
  for (let i = 0; i < agents.length; i++) {
    if (agents[i].id === id) {
      return agents[i];
    }
  }
  
  return null;
}

export async function createAgent(agent) {
  const agents = await readData('agents.json');
  
  for (let i = 0; i < agents.length; i++) {
    if (agents[i].id === agent.id) {
      throw new Error('Agent ID already exists');
    }
  }
  
  const newAgent = {
    id: agent.id,
    name: agent.name,
    nickname: agent.nickname,
    reportsCount: agent.reportsCount || 0
  };
  
  agents.push(newAgent);
  await writeData('agents.json', agents);
  return newAgent;
}

export async function updateAgent(id, updates) {
  const agents = await readData('agents.json');
  
  for (let i = 0; i < agents.length; i++) {
    if (agents[i].id === id) {
      if (updates.name) agents[i].name = updates.name;
      if (updates.nickname) agents[i].nickname = updates.nickname;
      if (updates.reportsCount !== undefined) agents[i].reportsCount = updates.reportsCount;
      
      await writeData('agents.json', agents);
      return agents[i];
    }
  }
  
  throw new Error('Agent not found');
}

export async function deleteAgent(id) {
  const agents = await readData('agents.json');
  
  for (let i = 0; i < agents.length; i++) {
    if (agents[i].id === id) {
      const deleted = agents[i];
      agents.splice(i, 1);
      await writeData('agents.json', agents);
      return deleted;
    }
  }
  
  throw new Error('Agent not found');
}

export async function incrementReportsCount(agentId) {
  const agents = await readData('agents.json');
  
  for (let i = 0; i < agents.length; i++) {
    if (agents[i].id === agentId) {
      if (!agents[i].reportsCount) {
        agents[i].reportsCount = 0;
      }
      agents[i].reportsCount = agents[i].reportsCount + 1;
      
      await writeData('agents.json', agents);
      return agents[i];
    }
  }
  
  throw new Error('Agent not found');
}

export async function decrementReportsCount(agentId) {
  const agents = await readData('agents.json');
  
  for (let i = 0; i < agents.length; i++) {
    if (agents[i].id === agentId) {
      if (!agents[i].reportsCount) {
        agents[i].reportsCount = 0;
      } else if (agents[i].reportsCount > 0) {
        agents[i].reportsCount = agents[i].reportsCount - 1;
      }
      
      await writeData('agents.json', agents);
      return agents[i];
    }
  }
  
  throw new Error('Agent not found');
}
