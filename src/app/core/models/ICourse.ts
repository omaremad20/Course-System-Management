export interface ICourse {
  id: string;
  courseName: string;
  instructorName: string;
  category: string;
  duration: number;
  price: number;
  status: 'active' | 'draft' | 'archived';
  description?: string;
  createdDate: Date;
}
