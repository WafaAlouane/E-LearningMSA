export interface Course {
  id?: number;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseSearchParams {
  description?: string;
  duration?: number;
  instructor?: string;
  title?: string;
  price?: number;
}

export interface CourseStatistics {
  totalCourses: number;
  instructorCount: Record<string, number>;
  averagePrice: number;
  averageDuration: number;
  coursesWithPrice: number;
}

export interface StatisticsResponse {
  statistics: CourseStatistics;
  courses: Course[];
}