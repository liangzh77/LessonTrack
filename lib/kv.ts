import { kv } from '@vercel/kv'
import { LocalKV } from './kv-local'

export interface Student {
  id: string
  name: string
  createdAt: string
}

export interface LessonRecord {
  id: string
  studentId: string
  studentName: string
  date: string
  time: string
  note: string
  createdAt: string
}

export interface LessonFilter {
  studentId?: string
  startDate?: string
  endDate?: string
  limit?: number
}

// 检查是否是本地开发环境
const isLocalDev = process.env.NODE_ENV === 'development' &&
  (process.env.KV_REST_API_URL === 'https://your-kv-rest-api-url' ||
   !process.env.KV_REST_API_URL)

export class LessonTrackDB {
  private static STUDENTS_KEY = 'students'
  private static RECORDS_KEY = 'lesson_records'

  static async getStudents(): Promise<Student[]> {
    if (isLocalDev) {
      return LocalKV.getStudents()
    }

    try {
      const students = await kv.get<Student[]>(this.STUDENTS_KEY)
      return students || []
    } catch (error) {
      console.error('获取学生列表失败:', error)
      return []
    }
  }

  static async addStudent(name: string): Promise<Student> {
    if (isLocalDev) {
      return LocalKV.addStudent(name)
    }

    try {
      const student: Student = {
        id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        createdAt: new Date().toISOString()
      }

      const students = await this.getStudents()
      students.push(student)
      await kv.set(this.STUDENTS_KEY, students)

      return student
    } catch (error) {
      console.error('Vercel KV addStudent error:', error)
      throw new Error(`添加学生失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  static async deleteStudent(studentId: string): Promise<void> {
    if (isLocalDev) {
      return LocalKV.deleteStudent(studentId)
    }

    const students = await this.getStudents()
    const updatedStudents = students.filter(s => s.id !== studentId)
    await kv.set(this.STUDENTS_KEY, updatedStudents)

    const records = await this.getLessonRecords()
    const updatedRecords = records.filter(r => r.studentId !== studentId)
    await kv.set(this.RECORDS_KEY, updatedRecords)
  }

  static async getLessonRecords(filter?: LessonFilter): Promise<LessonRecord[]> {
    if (isLocalDev) {
      return LocalKV.getLessonRecords(filter)
    }

    try {
      let records = await kv.get<LessonRecord[]>(this.RECORDS_KEY) || []

      if (filter) {
        if (filter.studentId) {
          records = records.filter(r => r.studentId === filter.studentId)
        }
        if (filter.startDate) {
          records = records.filter(r => r.date >= filter.startDate!)
        }
        if (filter.endDate) {
          records = records.filter(r => r.date <= filter.endDate!)
        }
        if (filter.limit && filter.limit > 0) {
          records = records.slice(0, filter.limit)
        }
      }

      return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (error) {
      console.error('获取课程记录失败:', error)
      return []
    }
  }

  static async addLessonRecord(record: Omit<LessonRecord, 'id' | 'createdAt'>): Promise<LessonRecord> {
    if (isLocalDev) {
      return LocalKV.addLessonRecord(record)
    }

    const newRecord: LessonRecord = {
      ...record,
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    const records = await this.getLessonRecords()
    records.push(newRecord)
    await kv.set(this.RECORDS_KEY, records)

    return newRecord
  }

  static async updateLessonRecord(recordId: string, updates: Partial<LessonRecord>): Promise<LessonRecord | null> {
    if (isLocalDev) {
      return LocalKV.updateLessonRecord(recordId, updates)
    }

    const records = await this.getLessonRecords()
    const recordIndex = records.findIndex(r => r.id === recordId)

    if (recordIndex === -1) {
      return null
    }

    records[recordIndex] = { ...records[recordIndex], ...updates }
    await kv.set(this.RECORDS_KEY, records)

    return records[recordIndex]
  }

  static async deleteLessonRecord(recordId: string): Promise<void> {
    if (isLocalDev) {
      return LocalKV.deleteLessonRecord(recordId)
    }

    const records = await this.getLessonRecords()
    const updatedRecords = records.filter(r => r.id !== recordId)
    await kv.set(this.RECORDS_KEY, updatedRecords)
  }

  static async getStatistics(studentId?: string, startDate?: string, endDate?: string) {
    if (isLocalDev) {
      return LocalKV.getStatistics(studentId, startDate, endDate)
    }

    const records = await this.getLessonRecords({ studentId, startDate, endDate })

    const totalLessons = records.length
    const studentStats = records.reduce((acc, record) => {
      acc[record.studentName] = (acc[record.studentName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalLessons,
      studentStats,
      records
    }
  }
}