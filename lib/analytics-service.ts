"use server";

import prisma from "@/prisma/client";

export interface AnalyticsData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalModules: number;
  averageRating: number;
  courseCreationTrend: { month: string; count: number }[];
  enrollmentTrend: { month: string; count: number }[];
  categoryDistribution: { name: string; count: number }[];
  userLevelDistribution: { level: string; count: number }[];
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  // Get total counts
  const [totalUsers, totalCourses, totalEnrollments, totalModules] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.module.count(),
  ]);

  // Get average rating
  const ratingsResult = await prisma.rating.aggregate({
    _avg: {
      rating: true,
    },
  });
  const averageRating = ratingsResult._avg.rating || 0;

  // Get course creation trend (last 12 months)
  const courseCreationTrend = await prisma.$queryRaw<Array<{ month: string; count: number }>>`
    SELECT
      TO_CHAR(created_at, 'YYYY-MM') as month,
      COUNT(*) as count
    FROM "Course"
    WHERE created_at >= NOW() - INTERVAL '12 months'
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY month
  `;

  // Get enrollment trend (last 12 months)
  const enrollmentTrend = await prisma.$queryRaw<Array<{ month: string; count: number }>>`
    SELECT
      TO_CHAR(enrolled_at, 'YYYY-MM') as month,
      COUNT(*) as count
    FROM "Enrollment"
    WHERE enrolled_at >= NOW() - INTERVAL '12 months'
    GROUP BY TO_CHAR(enrolled_at, 'YYYY-MM')
    ORDER BY month
  `;

  // Get category distribution
  const categoryDistribution = await prisma.category.findMany({
    select: {
      name: true,
      _count: {
        select: {
          courses: true,
        },
      },
    },
  });

  // Get user level distribution
  const userLevelDistribution = await prisma.user.groupBy({
    by: ['level'],
    _count: {
      level: true,
    },
  });

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalModules,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    courseCreationTrend,
    enrollmentTrend,
    categoryDistribution: categoryDistribution.map(cat => ({
      name: cat.name,
      count: cat._count.courses,
    })),
    userLevelDistribution: userLevelDistribution.map(level => ({
      level: level.level,
      count: level._count.level,
    })),
  };
}