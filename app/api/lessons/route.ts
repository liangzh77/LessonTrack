import { NextRequest, NextResponse } from 'next/server'
import { LessonTrackDB, LessonFilter } from '@/lib/kv'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filter: LessonFilter = {
      studentId: searchParams.get('studentId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    }

    const records = await LessonTrackDB.getLessonRecords(filter)
    return NextResponse.json({ success: true, data: records })
  } catch (error) {
    console.error('获取课程记录失败:', error)
    return NextResponse.json(
      { success: false, error: '获取课程记录失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, studentName, date, time, note } = await request.json()

    if (!studentId || !studentName || !date) {
      return NextResponse.json(
        { success: false, error: '学生ID、姓名和日期不能为空' },
        { status: 400 }
      )
    }

    const record = await LessonTrackDB.addLessonRecord({
      studentId,
      studentName,
      date,
      time: time || '',
      note: note || ''
    })

    return NextResponse.json({ success: true, data: record }, { status: 201 })
  } catch (error) {
    console.error('添加课程记录失败:', error)
    return NextResponse.json(
      { success: false, error: '添加课程记录失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: '记录ID不能为空' },
        { status: 400 }
      )
    }

    const updatedRecord = await LessonTrackDB.updateLessonRecord(id, updates)

    if (!updatedRecord) {
      return NextResponse.json(
        { success: false, error: '记录不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updatedRecord })
  } catch (error) {
    console.error('更新课程记录失败:', error)
    return NextResponse.json(
      { success: false, error: '更新课程记录失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recordId = searchParams.get('id')

    if (!recordId) {
      return NextResponse.json(
        { success: false, error: '记录ID不能为空' },
        { status: 400 }
      )
    }

    await LessonTrackDB.deleteLessonRecord(recordId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除课程记录失败:', error)
    return NextResponse.json(
      { success: false, error: '删除课程记录失败' },
      { status: 500 }
    )
  }
}