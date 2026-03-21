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

export const sampleMaterials: StudyMaterial[] = [
  {
    id: '1',
    title: 'Linear Algebra — Complete Notes',
    subject: 'Mathematics',
    description: 'Comprehensive notes covering vectors, matrices, eigenvalues, and linear transformations.',
    type: 'pdf',
    uploadedAt: '2026-03-18',
    fileSize: '2.4 MB',
    downloads: 342,
  },
  {
    id: '2',
    title: 'Organic Chemistry Reactions Summary',
    subject: 'Chemistry',
    description: 'Quick-reference guide for all major organic chemistry reaction mechanisms.',
    type: 'notes',
    uploadedAt: '2026-03-15',
    fileSize: '1.1 MB',
    downloads: 218,
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    description: 'Detailed notes on arrays, trees, graphs, sorting, and dynamic programming.',
    type: 'pdf',
    uploadedAt: '2026-03-12',
    fileSize: '3.8 MB',
    downloads: 567,
  },
  {
    id: '4',
    title: 'Classical Mechanics — Problem Sets',
    subject: 'Physics',
    description: 'Practice problems with solutions for Newtonian mechanics and rotational dynamics.',
    type: 'pdf',
    uploadedAt: '2026-03-10',
    fileSize: '1.7 MB',
    downloads: 189,
  },
  {
    id: '5',
    title: 'Cell Biology Lecture Slides',
    subject: 'Biology',
    description: 'Complete lecture slides covering cell structure, mitosis, meiosis, and cellular respiration.',
    type: 'slides',
    uploadedAt: '2026-03-08',
    fileSize: '5.2 MB',
    downloads: 145,
  },
  {
    id: '6',
    title: 'Microeconomics Fundamentals',
    subject: 'Economics',
    description: 'Supply and demand, market equilibrium, elasticity, and consumer theory.',
    type: 'notes',
    uploadedAt: '2026-03-05',
    fileSize: '980 KB',
    downloads: 276,
  },
  {
    id: '7',
    title: 'Shakespeare — Hamlet Analysis',
    subject: 'English',
    description: 'Critical analysis of themes, characters, and literary devices in Hamlet.',
    type: 'notes',
    uploadedAt: '2026-03-02',
    fileSize: '640 KB',
    downloads: 93,
  },
  {
    id: '8',
    title: 'World War II — Timeline & Key Events',
    subject: 'History',
    description: 'Chronological overview of major events, battles, and political developments.',
    type: 'pdf',
    uploadedAt: '2026-02-28',
    fileSize: '2.1 MB',
    downloads: 164,
  },
];
