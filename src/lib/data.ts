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

export const subjects: string[] = [];

export const sampleMaterials: StudyMaterial[] = [];
