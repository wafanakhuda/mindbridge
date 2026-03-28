import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// ─── USER MODEL ───────────────────────────────────────────
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'patient' | 'clinic' | 'admin';
  name: string;
  clinicId?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'clinic', 'admin'], required: true },
  name: { type: String, required: true },
  clinicId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

UserSchema.pre('save', async function () {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);

// ─── SCREENING MODEL ──────────────────────────────────────
export interface IScreening extends Document {
  anonymousId: string;
  userId?: string;
  phqScore: number;
  gadScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  riskScore: number;
  userContext: string;
  channel: string;
  followUpDue: Date;
  followUpDone: boolean;
  isCrisis: boolean;
  createdAt: Date;
}

const ScreeningSchema = new Schema<IScreening>({
  anonymousId: { type: String, required: true, index: true },
  userId: { type: String, index: true },
  phqScore: { type: Number, required: true, min: 0, max: 6 },
  gadScore: { type: Number, required: true, min: 0, max: 6 },
  riskLevel: { type: String, enum: ['low', 'moderate', 'high'], required: true },
  riskScore: { type: Number, required: true },
  userContext: { type: String, default: '' },  // Stored for follow-up context only
  channel: { type: String, default: 'web' },
  followUpDue: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  followUpDone: { type: Boolean, default: false },
  isCrisis: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Screening = mongoose.model<IScreening>('Screening', ScreeningSchema);

// ─── APPOINTMENT MODEL ────────────────────────────────────
export interface IAppointment extends Document {
  patientId: string;
  doctorName: string;
  doctorEmail: string;
  doctorSpeciality: string;
  clinicName: string;
  clinicLocation: string;
  dateTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  riskLevel: 'moderate' | 'high' | 'crisis';
  isCritical: boolean;
  notes: string;
  meetingLink?: string;
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  patientId: { type: String, required: true, index: true },
  doctorName: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  doctorSpeciality: { type: String, required: true },
  clinicName: { type: String, required: true },
  clinicLocation: { type: String, required: true },
  dateTime: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  riskLevel: { type: String, enum: ['moderate', 'high', 'crisis'], required: true },
  isCritical: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  meetingLink: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);

// ─── DOCTOR MODEL ─────────────────────────────────────────
export interface IDoctor extends Document {
  name: string;
  email: string;
  speciality: string;
  clinicName: string;
  clinicLocation: string;
  availableSlots: Date[];
  acceptsCritical: boolean;
  languages: string[];
  rating: number;
  responseTimeMinutes: number;
}

const DoctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  speciality: { type: String, required: true },
  clinicName: { type: String, required: true },
  clinicLocation: { type: String, required: true },
  availableSlots: [{ type: Date }],
  acceptsCritical: { type: Boolean, default: false },
  languages: [{ type: String }],
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  responseTimeMinutes: { type: Number, default: 60 },
});

export const Doctor = mongoose.model<IDoctor>('Doctor', DoctorSchema);
