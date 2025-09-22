import { NextRequest, NextResponse } from 'next/server'
import { LessonTrackDB } from '@/lib/kv'

export async function GET() {
  try {
    const students = await LessonTrackDB.getStudents()
    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    console.error('获取学生列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取学生列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '学生姓名不能为空' },
        { status: 400 }
      )
    }

    const student = await LessonTrackDB.addStudent(name.trim())
    return NextResponse.json({ success: true, data: student }, { status: 201 })
  } catch (error) {
    console.error('添加学生失败:', error)
    return NextResponse.json(
      { success: false, error: '添加学生失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('id')

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: '学生ID不能为空' },
        { status: 400 }
      )
    }

    await LessonTrackDB.deleteStudent(studentId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除学生失败:', error)
    return NextResponse.json(
      { success: false, error: '删除学生失败' },
      { status: 500 }
    )
  }
}