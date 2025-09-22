import { NextRequest, NextResponse } from 'next/server'
import { LessonTrackDB } from '@/lib/kv'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const studentId = searchParams.get('studentId') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const stats = await LessonTrackDB.getStatistics(studentId, startDate, endDate)
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}