import express from 'express';
import { 
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  getAgentById,
  incrementReportsCount,
  decrementReportsCount
} from '../utils/fileHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reports = await getAllReports();
    res.json(reports);
  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const report = await getReportById(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error getting report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { id, date, content, agentId } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing required field: id' });
    }
    if (!date) {
      return res.status(400).json({ error: 'Missing required field: date' });
    }
    if (!content) {
      return res.status(400).json({ error: 'Missing required field: content' });
    }
    if (!agentId) {
      return res.status(400).json({ error: 'Missing required field: agentId' });
    }

    const agent = await getAgentById(agentId);
    if (!agent) {
      return res.status(400).json({ 
        error: 'Agent not found',
        message: `Agent with ID ${agentId} does not exist`
      });
    }

    const newReport = await createReport({ id, date, content, agentId });

    await incrementReportsCount(agentId);

    res.status(201).json(newReport);

  } catch (error) {
    console.error('Error creating report:', error);

    if (error.message === 'Report ID already exists') {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, content, agentId } = req.body;

    const existingReport = await getReportById(id);
    if (!existingReport) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const oldAgentId = existingReport.agentId;

    if (agentId && agentId !== oldAgentId) {
      const newAgent = await getAgentById(agentId);
      if (!newAgent) {
        return res.status(400).json({ 
          error: 'New agent not found',
          message: `Agent with ID ${agentId} does not exist`
        });
      }

      await decrementReportsCount(oldAgentId);
      await incrementReportsCount(agentId);
    }

    const updates = {};
    if (date !== undefined) updates.date = date;
    if (content !== undefined) updates.content = content;
    if (agentId !== undefined) updates.agentId = agentId;

    const updatedReport = await updateReport(id, updates);

    res.json(updatedReport);

  } catch (error) {
    console.error('Error updating report:', error);

    if (error.message === 'Report not found') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const report = await getReportById(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const agentId = report.agentId;

    const deletedReport = await deleteReport(id);

    await decrementReportsCount(agentId);

    res.json({ 
      message: 'Report deleted successfully',
      report: deletedReport
    });

  } catch (error) {
    console.error('Error deleting report:', error);

    if (error.message === 'Report not found') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
