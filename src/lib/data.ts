export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  description: string;
  type: 'pdf' | 'notes' | 'slides';
  uploadedAt: string;
  fileSize: string;
  downloads: number;
}

export const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Economics',
] as const;

export const sampleMaterials: StudyMaterial[] = [];
