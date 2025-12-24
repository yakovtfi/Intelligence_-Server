import express from 'express';
import { 
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  getReportsByAgentId
} from '../utils/fileHandler.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const agents = await getAllAgents();
    res.json(agents);
  } catch (error) {
    console.error('Error getting agents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await getAgentById(id);

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    res.json(agent);
  } catch (error) {
    console.error('Error getting agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { id, name, nickname } = req.body;

    if (!id) {
      return res.status(400).json({ 
        error: 'Missing required field: id' 
      });
    }
    if (!name) {
      return res.status(400).json({ 
        error: 'Missing required field: name' 
      });
    }
    if (!nickname) {
      return res.status(400).json({ 
        error: 'Missing required field: nickname' 
      });
    }

    const newAgent = await createAgent({ 
      id, 
      name, 
      nickname,
      reportsCount: 0 
    });

    res.status(201).json(newAgent);

  } catch (error) {
    console.error('Error creating agent:', error);

    if (error.message === 'Agent ID already exists') {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nickname } = req.body;

    const agent = await getAgentById(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (nickname !== undefined) updates.nickname = nickname;


    const updatedAgent = await updateAgent(id, updates);

    res.json(updatedAgent);

  } catch (error) {
    console.error('Error updating agent:', error);

    if (error.message === 'Agent not found') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await getAgentById(id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const agentReports = await getReportsByAgentId(id);
    if (agentReports.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete agent with existing reports',
        message: `Agent has ${agentReports.length} report(s). Delete them first.`
      });
    }

    const deletedAgent = await deleteAgent(id);

    res.json({ 
      message: 'Agent deleted successfully',
      agent: deletedAgent
    });

  } catch (error) {
    console.error('Error deleting agent:', error);

    if (error.message === 'Agent not found') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
