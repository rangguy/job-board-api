// src/routes/index.js
const express = require('express');
const router = express.Router();

const user = require('../controllers/userController');
const job  = require('../controllers/jobController');
const { authenticate, requireRole } = require('../middlewares/auth');

// Auth
router.post('/register', user.register);
router.post('/login', user.login);

// Jobs
router.get('/jobs', job.getJobs);

// Hanya EMPLOYER yang boleh post job
router.post('/jobs', authenticate, requireRole('EMPLOYER'), job.createJob);

// Hanya JOB_SEEKER yang boleh apply
router.post('/jobs/:id/apply', authenticate, requireRole('JOB_SEEKER'), job.applyJob);

module.exports = router;
