import { Router } from 'express';
import { Screening } from '../models.js';
import { requireAuth, AuthRequest } from '../middleware.js';

export const screeningRouter = Router();

// POST /api/screenings - save a screening result
screeningRouter.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { phqScore, gadScore, riskLevel, riskScore, userContext, channel, isCrisis } = req.body;
    const anonymousId = `anon-${req.user!.id.slice(-8)}-${Date.now()}`;

    const screening = new Screening({
      anonymousId,
      userId: req.user!.id,
      phqScore,
      gadScore,
      riskLevel,
      riskScore,
      userContext: userContext?.slice(0, 500) || '', // limit stored context
      channel: channel || 'web',
      isCrisis: isCrisis || false,
      followUpDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await screening.save();

    // If crisis, trigger immediate alert (in production: send email/SMS to clinic)
    if (isCrisis) {
      console.log(`CRISIS ALERT: User ${anonymousId} flagged at ${new Date().toISOString()}`);
      // TODO: integrate SendGrid/Twilio for real alerts
    }

    res.status(201).json({ id: screening._id, anonymousId, followUpDue: screening.followUpDue });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/screenings/my - patient's own screening history
screeningRouter.get('/my', requireAuth, async (req: AuthRequest, res) => {
  try {
    const screenings = await Screening.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-userContext'); // never return raw context to client
    res.json({ screenings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/screenings/stats - for clinic/admin dashboards
screeningRouter.get('/stats', requireAuth, async (req: AuthRequest, res) => {
  try {
    const [total, high, moderate, low, crisis, followUpsDue] = await Promise.all([
      Screening.countDocuments(),
      Screening.countDocuments({ riskLevel: 'high' }),
      Screening.countDocuments({ riskLevel: 'moderate' }),
      Screening.countDocuments({ riskLevel: 'low' }),
      Screening.countDocuments({ isCrisis: true }),
      Screening.countDocuments({ followUpDone: false, followUpDue: { $lte: new Date() } }),
    ]);

    const recentScreenings = await Screening.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('anonymousId riskLevel riskScore createdAt isCrisis followUpDue followUpDone channel');

    res.json({ total, high, moderate, low, crisis, followUpsDue, recentScreenings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
