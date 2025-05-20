import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalClasses,
      totalNewsletters,
      recentClasses,
      recentNews
    ] = await Promise.all([
      prisma.class.count(),
      prisma.newsletter.count(),
      prisma.class.findMany({
        take: 5,
        orderBy: { startDate: 'desc' },
        select: {
          id: true,
          title: true,
          teacher: true,
          startDate: true
        }
      }),
      prisma.news.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true
        }
      })
    ])

    return NextResponse.json({
      totalClasses,
      totalNewsletters,
      recentClasses,
      recentNews
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت آمار داشبورد' },
      { status: 500 }
    )
  }
} 