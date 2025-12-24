import { readData, writeData } from './fileSystem.js';

export async function getAllReports() {
  return await readData('reports.json');
}

export async function getReportById(id) {
  const reports = await readData('reports.json');
  
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].id === id) {
      return reports[i];
    }
  }
  
  return null;
}

export async function getReportsByAgentId(agentId) {
  const reports = await readData('reports.json');
  const agentReports = [];
  
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].agentId === agentId) {
      agentReports.push(reports[i]);
    }
  }
  
  return agentReports;
}

export async function createReport(report) {
  const reports = await readData('reports.json');
  
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].id === report.id) {
      throw new Error('Report ID already exists');
    }
  }
  
  reports.push(report);
  await writeData('reports.json', reports);
  return report;
}

export async function updateReport(id, updates) {
  const reports = await readData('reports.json');
  
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].id === id) {
      if (updates.date !== undefined) reports[i].date = updates.date;
      if (updates.content !== undefined) reports[i].content = updates.content;
      if (updates.agentId !== undefined) reports[i].agentId = updates.agentId;
      
      await writeData('reports.json', reports);
      return reports[i];
    }
  }
  
  throw new Error('Report not found');
}

export async function deleteReport(id) {
  const reports = await readData('reports.json');
  
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].id === id) {
      const deleted = reports[i];
      reports.splice(i, 1);
      await writeData('reports.json', reports);
      return deleted;
    }
  }
  
  throw new Error('Report not found');
}
