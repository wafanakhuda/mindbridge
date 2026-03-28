/**
 * MindBridge Database Seeder
 * Creates 10 sample records per collection for demo purposes
 * Run: npx tsx server/seed.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Screening, Appointment, Doctor } from './models.js';

dotenv.config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mindbridge';

const SAMPLE_DOCTORS: Array<{
  name: string; email: string; speciality: string;
  clinicName: string; clinicLocation: string;
  acceptsCritical: boolean; languages: string[];
  rating: number; responseTimeMinutes: number;
}> = [
  { name: 'Dr Sarah Chen', email: 'sarah.chen@mindbridge-clinic.com', speciality: 'Psychiatry', clinicName: 'City Mental Health Centre', clinicLocation: 'London, UK', acceptsCritical: true, languages: ['English', 'Mandarin'], rating: 4.9, responseTimeMinutes: 15 },
  { name: 'Dr James Okafor', email: 'james.okafor@mindbridge-clinic.com', speciality: 'Clinical Psychology', clinicName: 'Wellness Hub Lagos', clinicLocation: 'Lagos, Nigeria', acceptsCritical: true, languages: ['English', 'Yoruba'], rating: 4.8, responseTimeMinutes: 20 },
  { name: 'Dr Priya Sharma', email: 'priya.sharma@mindbridge-clinic.com', speciality: 'General Psychiatry', clinicName: 'NIMHANS Community Clinic', clinicLocation: 'Bangalore, India', acceptsCritical: true, languages: ['English', 'Hindi', 'Kannada'], rating: 4.7, responseTimeMinutes: 30 },
  { name: 'Dr Maria Rodriguez', email: 'maria.rodriguez@mindbridge-clinic.com', speciality: 'Counselling Psychology', clinicName: 'Centro de Salud Mental', clinicLocation: 'Madrid, Spain', acceptsCritical: false, languages: ['Spanish', 'English'], rating: 4.8, responseTimeMinutes: 45 },
  { name: 'Dr Ahmed Al-Rashid', email: 'ahmed.alrashid@mindbridge-clinic.com', speciality: 'Psychiatry', clinicName: 'Al Amal Mental Health Hospital', clinicLocation: 'Dubai, UAE', acceptsCritical: true, languages: ['Arabic', 'English'], rating: 4.9, responseTimeMinutes: 10 },
  { name: 'Dr Amara Diallo', email: 'amara.diallo@mindbridge-clinic.com', speciality: 'Community Mental Health', clinicName: 'BasicNeeds Ghana Clinic', clinicLocation: 'Accra, Ghana', acceptsCritical: false, languages: ['English', 'French', 'Twi'], rating: 4.6, responseTimeMinutes: 60 },
  { name: 'Dr Lisa Nguyen', email: 'lisa.nguyen@mindbridge-clinic.com', speciality: 'Trauma & PTSD', clinicName: 'Melbourne Mental Health', clinicLocation: 'Melbourne, Australia', acceptsCritical: true, languages: ['English', 'Vietnamese'], rating: 4.9, responseTimeMinutes: 20 },
  { name: 'Dr Carlos Mendez', email: 'carlos.mendez@mindbridge-clinic.com', speciality: 'Anxiety and Depression', clinicName: 'Instituto de Salud Mental', clinicLocation: 'Buenos Aires, Argentina', acceptsCritical: false, languages: ['Spanish', 'Portuguese'], rating: 4.7, responseTimeMinutes: 40 },
  { name: 'Dr Fatima Al-Hassan', email: 'fatima.alhassan@mindbridge-clinic.com', speciality: 'Child and Adolescent Psychiatry', clinicName: 'Nairobi Community Hospital', clinicLocation: 'Nairobi, Kenya', acceptsCritical: true, languages: ['English', 'Swahili'], rating: 4.8, responseTimeMinutes: 25 },
  { name: 'Dr Wei Zhang', email: 'wei.zhang@mindbridge-clinic.com', speciality: 'Geriatric Psychiatry', clinicName: 'Shanghai Mental Health Centre', clinicLocation: 'Shanghai, China', acceptsCritical: false, languages: ['Mandarin', 'English'], rating: 4.6, responseTimeMinutes: 50 },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Screening.deleteMany({}),
    Appointment.deleteMany({}),
    Doctor.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  // Seed Doctors
  await Doctor.insertMany(SAMPLE_DOCTORS.map(d => ({
    ...d,
    availableSlots: [
      new Date(Date.now() + 2 * 60 * 60 * 1000),
      new Date(Date.now() + 4 * 60 * 60 * 1000),
      new Date(Date.now() + 24 * 60 * 60 * 1000),
      new Date(Date.now() + 48 * 60 * 60 * 1000),
    ],
  })));
  console.log('Seeded 10 doctors');

  // Seed Users (3 of each role)
  const users = [
    { email: 'patient@mindbridge.demo', passwordHash: 'Demo1234!', name: 'Demo Patient', role: 'patient' },
    { email: 'patient2@mindbridge.demo', passwordHash: 'Demo1234!', name: 'Test Patient', role: 'patient' },
    { email: 'clinic@mindbridge.demo', passwordHash: 'Demo1234!', name: 'City Clinic Staff', role: 'clinic' },
    { email: 'clinic2@mindbridge.demo', passwordHash: 'Demo1234!', name: 'Wellness Hub Staff', role: 'clinic' },
    { email: 'admin@mindbridge.demo', passwordHash: 'Demo1234!', name: 'System Administrator', role: 'admin' },
  ];

  const createdUsers: any[] = [];
  for (const u of users) {
    const user = new User(u);
    await user.save();
    createdUsers.push(user);
  }
  console.log('Seeded 5 demo users');

  // Seed 10 Screenings
  const riskLevels: Array<'low' | 'moderate' | 'high'> = ['low', 'low', 'low', 'moderate', 'moderate', 'moderate', 'moderate', 'high', 'high', 'high'];
  const channels = ['web', 'web', 'web', 'whatsapp', 'whatsapp', 'sms', 'web', 'whatsapp', 'web', 'web'];

  const screenings = riskLevels.map((riskLevel, i) => ({
    anonymousId: `anon-demo-${1000 + i}`,
    userId: createdUsers[i % 2]._id.toString(),
    phqScore: riskLevel === 'low' ? Math.floor(Math.random() * 2) : riskLevel === 'moderate' ? 2 + Math.floor(Math.random() * 2) : 4 + Math.floor(Math.random() * 3),
    gadScore: riskLevel === 'low' ? Math.floor(Math.random() * 2) : riskLevel === 'moderate' ? 2 + Math.floor(Math.random() * 2) : 4 + Math.floor(Math.random() * 3),
    riskLevel,
    riskScore: riskLevel === 'low' ? 10 + i * 3 : riskLevel === 'moderate' ? 40 + i * 5 : 70 + i * 5,
    channel: channels[i],
    isCrisis: riskLevel === 'high' && i === 9,
    createdAt: new Date(Date.now() - (10 - i) * 24 * 60 * 60 * 1000),
    followUpDue: new Date(Date.now() + (i % 3 === 0 ? -1 : 7) * 24 * 60 * 60 * 1000),
    followUpDone: i < 3,
  }));

  await Screening.insertMany(screenings);
  console.log('Seeded 10 screenings');

  // Seed 10 Appointments
  const appointments = [
    { patientId: createdUsers[0]._id.toString(), doctorName: 'Dr Sarah Chen', doctorEmail: 'sarah.chen@mindbridge-clinic.com', doctorSpeciality: 'Psychiatry', clinicName: 'City Mental Health Centre', clinicLocation: 'London, UK', dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), status: 'confirmed', riskLevel: 'high', isCritical: true, meetingLink: 'https://meet.jit.si/mindbridge-demo-001' },
    { patientId: createdUsers[0]._id.toString(), doctorName: 'Dr Priya Sharma', doctorEmail: 'priya.sharma@mindbridge-clinic.com', doctorSpeciality: 'General Psychiatry', clinicName: 'NIMHANS Community Clinic', clinicLocation: 'Bangalore, India', dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), status: 'pending', riskLevel: 'moderate', isCritical: false },
    { patientId: createdUsers[1]._id.toString(), doctorName: 'Dr James Okafor', doctorEmail: 'james.okafor@mindbridge-clinic.com', doctorSpeciality: 'Clinical Psychology', clinicName: 'Wellness Hub Lagos', clinicLocation: 'Lagos, Nigeria', dateTime: new Date(Date.now() + 48 * 60 * 60 * 1000), status: 'pending', riskLevel: 'moderate', isCritical: false },
    { patientId: createdUsers[0]._id.toString(), doctorName: 'Dr Lisa Nguyen', doctorEmail: 'lisa.nguyen@mindbridge-clinic.com', doctorSpeciality: 'Trauma & PTSD', clinicName: 'Melbourne Mental Health', clinicLocation: 'Melbourne, Australia', dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'completed', riskLevel: 'high', isCritical: false },
    { patientId: createdUsers[1]._id.toString(), doctorName: 'Dr Maria Rodriguez', doctorEmail: 'maria.rodriguez@mindbridge-clinic.com', doctorSpeciality: 'Counselling Psychology', clinicName: 'Centro de Salud Mental', clinicLocation: 'Madrid, Spain', dateTime: new Date(Date.now() + 72 * 60 * 60 * 1000), status: 'confirmed', riskLevel: 'moderate', isCritical: false },
    { patientId: createdUsers[0]._id.toString(), doctorName: 'Dr Ahmed Al-Rashid', doctorEmail: 'ahmed.alrashid@mindbridge-clinic.com', doctorSpeciality: 'Psychiatry', clinicName: 'Al Amal Mental Health Hospital', clinicLocation: 'Dubai, UAE', dateTime: new Date(Date.now() + 96 * 60 * 60 * 1000), status: 'pending', riskLevel: 'high', isCritical: false },
    { patientId: createdUsers[1]._id.toString(), doctorName: 'Dr Amara Diallo', doctorEmail: 'amara.diallo@mindbridge-clinic.com', doctorSpeciality: 'Community Mental Health', clinicName: 'BasicNeeds Ghana Clinic', clinicLocation: 'Accra, Ghana', dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), status: 'completed', riskLevel: 'low', isCritical: false },
    { patientId: createdUsers[0]._id.toString(), doctorName: 'Dr Fatima Al-Hassan', doctorEmail: 'fatima.alhassan@mindbridge-clinic.com', doctorSpeciality: 'Child and Adolescent Psychiatry', clinicName: 'Nairobi Community Hospital', clinicLocation: 'Nairobi, Kenya', dateTime: new Date(Date.now() + 120 * 60 * 60 * 1000), status: 'pending', riskLevel: 'moderate', isCritical: false },
    { patientId: createdUsers[1]._id.toString(), doctorName: 'Dr Carlos Mendez', doctorEmail: 'carlos.mendez@mindbridge-clinic.com', doctorSpeciality: 'Anxiety and Depression', clinicName: 'Instituto de Salud Mental', clinicLocation: 'Buenos Aires, Argentina', dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'cancelled', riskLevel: 'moderate', isCritical: false },
    { patientId: createdUsers[0]._id.toString(), doctorName: 'Dr Wei Zhang', doctorEmail: 'wei.zhang@mindbridge-clinic.com', doctorSpeciality: 'Geriatric Psychiatry', clinicName: 'Shanghai Mental Health Centre', clinicLocation: 'Shanghai, China', dateTime: new Date(Date.now() + 168 * 60 * 60 * 1000), status: 'pending', riskLevel: 'low', isCritical: false },
  ];

  await Appointment.insertMany(appointments);
  console.log('Seeded 10 appointments');

  console.log('\n=== SEED COMPLETE ===');
  console.log('Demo login credentials:');
  console.log('Patient:  patient@mindbridge.demo / Demo1234!');
  console.log('Clinic:   clinic@mindbridge.demo / Demo1234!');
  console.log('Admin:    admin@mindbridge.demo / Demo1234!');

  await mongoose.disconnect();
}

seed().catch(console.error);
