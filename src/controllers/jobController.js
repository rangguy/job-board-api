// src/controllers/jobController.js
const prisma = require('../helpers/db');

exports.createJob = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { title, description, company_name, salary_min, salary_max, location } = req.body;

    if (!title) {
      return res.status(422).json({ success: false, message: 'title wajib' });
    }

    const job = await prisma.job.create({
      data: {
        employerId,
        title,
        description,
        company_name,
        salary_min: salary_min ?? null,
        salary_max: salary_max ?? null,
        location,
      },
    });

    return res.status(201).json({ success: true, message: 'job created', data: job });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'create job failed' });
  }
};

exports.getJobs = async (_req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: { employer: { select: { id: true, email: true, name: true } } },
    });
    return res.json({ success: true, data: jobs });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'get jobs failed' });
  }
};

exports.applyJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const userId = req.user.id;

    const [user, job] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.job.findUnique({ where: { id: jobId } }),
    ]);

    if (!job) return res.status(404).json({ success: false, message: 'job tidak ditemukan' });

    const application = await prisma.application.create({
      data: { jobId: job.id, userId },
    });

    return res.status(201).json({ success: true, message: 'applied', data: application });
  } catch (e) {
    if (e?.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'sudah pernah melamar job ini' });
    }
    console.error(e);
    return res.status(500).json({ success: false, message: 'apply failed' });
  }
};
