import { Router } from 'express';
import { Appointment, Doctor } from '../models.js';
import { requireAuth, AuthRequest } from '../middleware.js';

export const appointmentRouter = Router();

// GET /api/appointments/doctors - list available doctors
// Critical cases get doctors who accept emergency appointments
appointmentRouter.get('/doctors', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { critical } = req.query;
    const query = critical === 'true' ? { acceptsCritical: true } : {};
    const doctors = await Doctor.find(query).limit(10);
    res.json({ doctors });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/appointments - book appointment
appointmentRouter.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { doctorEmail, dateTime, riskLevel, notes, isCritical } = req.body;

    const doctor = await Doctor.findOne({ email: doctorEmail });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    // For critical cases, auto-confirm and generate a meeting link
    const status = isCritical ? 'confirmed' : 'pending';
    const meetingLink = isCritical
      ? `https://meet.jit.si/mindbridge-${req.user!.id.slice(-6)}-${Date.now()}`
      : undefined;

    const appointment = new Appointment({
      patientId: req.user!.id,
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      doctorSpeciality: doctor.speciality,
      clinicName: doctor.clinicName,
      clinicLocation: doctor.clinicLocation,
      dateTime: new Date(dateTime),
      status,
      riskLevel,
      isCritical: isCritical || false,
      notes: notes || '',
      meetingLink,
    });

    await appointment.save();

    // For critical cases, log alert (production: email doctor + patient immediately)
    if (isCritical) {
      console.log(`CRITICAL APPOINTMENT: Patient ${req.user!.id} booked with Dr ${doctor.name} at ${dateTime}`);
      console.log(`Meeting link: ${meetingLink}`);
      // Production: sendEmail(doctor.email, 'URGENT - MindBridge Crisis Patient', ...)
      // Production: sendEmail(patientEmail, 'Your emergency appointment is confirmed', ...)
    }

    res.status(201).json({
      appointment: {
        id: appointment._id,
        doctorName: doctor.name,
        clinicName: doctor.clinicName,
        dateTime: appointment.dateTime,
        status: appointment.status,
        meetingLink: appointment.meetingLink,
        isCritical: appointment.isCritical,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appointments/my - patient's appointments
appointmentRouter.get('/my', requireAuth, async (req: AuthRequest, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user!.id })
      .sort({ dateTime: 1 });
    res.json({ appointments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/appointments/all - clinic/admin view of all appointments
appointmentRouter.get('/all', requireAuth, async (req: AuthRequest, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ appointments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/appointments/:id/status - clinic updates status
appointmentRouter.patch('/:id/status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ appointment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
