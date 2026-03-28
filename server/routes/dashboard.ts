import { Router } from 'express';
import { Screening, Appointment, User, Doctor } from '../models.js';
import { requireAuth, requireRole, AuthRequest } from '../middleware.js';

export const dashboardRouter = Router();

// GET /api/dashboard/clinic - clinic dashboard data
dashboardRouter.get('/clinic', requireAuth, requireRole('clinic', 'admin'), async (_req, res) => {
  try {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalScreenings,
      screeningsThisMonth,
      highRisk,
      crisisCount,
      followUpsDue,
      pendingAppointments,
      confirmedAppointments,
      recentScreenings,
      recentAppointments,
    ] = await Promise.all([
      Screening.countDocuments(),
      Screening.countDocuments({ createdAt: { $gte: monthAgo } }),
      Screening.countDocuments({ riskLevel: 'high' }),
      Screening.countDocuments({ isCrisis: true }),
      Screening.countDocuments({ followUpDone: false, followUpDue: { $lte: now } }),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'confirmed' }),
      Screening.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('anonymousId riskLevel riskScore createdAt isCrisis channel followUpDue followUpDone'),
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('patientId doctorName status riskLevel isCritical dateTime createdAt'),
    ]);

    // Risk distribution
    const riskBreakdown = await Screening.aggregate([
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } }
    ]);

    // Channel breakdown
    const channelBreakdown = await Screening.aggregate([
      { $group: { _id: '$channel', count: { $sum: 1 } } }
    ]);

    // Weekly trend (last 7 days)
    const weeklyTrend = await Screening.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        highRisk: { $sum: { $cond: [{ $eq: ['$riskLevel', 'high'] }, 1, 0] } }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      kpis: { totalScreenings, screeningsThisMonth, highRisk, crisisCount, followUpsDue, pendingAppointments, confirmedAppointments },
      riskBreakdown,
      channelBreakdown,
      weeklyTrend,
      recentScreenings,
      recentAppointments,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/admin - system-wide stats
dashboardRouter.get('/admin', requireAuth, requireRole('admin'), async (_req, res) => {
  try {
    const [totalUsers, totalScreenings, totalAppointments, crisisEvents, doctors] = await Promise.all([
      User.countDocuments(),
      Screening.countDocuments(),
      Appointment.countDocuments(),
      Screening.countDocuments({ isCrisis: true }),
      Doctor.countDocuments(),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({ totalUsers, totalScreenings, totalAppointments, crisisEvents, doctors, usersByRole });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
