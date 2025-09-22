// 本地开发用的模拟 KV 数据库
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

// 内存存储 (仅用于本地开发测试)
let studentsData: Student[] = [
  {
    id: 'student_1',
    name: '张三',
    createdAt: new Date().toISOString()
  },
  {
    id: 'student_2',
    name: '李四',
    createdAt: new Date().toISOString()
  }
]

let recordsData: LessonRecord[] = [
  {
    id: 'record_1',
    studentId: 'student_1',
    studentName: '张三',
    date: '2024-01-15',
    time: '14:00',
    note: '今日学习数学',
    createdAt: new Date().toISOString()
  },
  {
    id: 'record_2',
    studentId: 'student_2',
    studentName: '李四',
    date: '2024-01-16',
    time: '15:30',
    note: '英语口语练习',
    createdAt: new Date().toISOString()
  }
]

export class LocalKV {
  static async getStudents(): Promise<Student[]> {
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 100))
    return [...studentsData]
  }

  static async addStudent(name: string): Promise<Student> {
    await new Promise(resolve => setTimeout(resolve, 100))

    const student: Student = {
      id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      createdAt: new Date().toISOString()
    }

    studentsData.push(student)
    return student
  }

  static async deleteStudent(studentId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))

    studentsData = studentsData.filter(s => s.id !== studentId)
    recordsData = recordsData.filter(r => r.studentId !== studentId)
  }

  static async getLessonRecords(filter?: LessonFilter): Promise<LessonRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 100))

    let records = [...recordsData]

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
  }

  static async addLessonRecord(record: Omit<LessonRecord, 'id' | 'createdAt'>): Promise<LessonRecord> {
    await new Promise(resolve => setTimeout(resolve, 100))

    const newRecord: LessonRecord = {
      ...record,
      id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    }

    recordsData.push(newRecord)
    return newRecord
  }

  static async updateLessonRecord(recordId: string, updates: Partial<LessonRecord>): Promise<LessonRecord | null> {
    await new Promise(resolve => setTimeout(resolve, 100))

    const recordIndex = recordsData.findIndex(r => r.id === recordId)

    if (recordIndex === -1) {
      return null
    }

    recordsData[recordIndex] = { ...recordsData[recordIndex], ...updates }
    return recordsData[recordIndex]
  }

  static async deleteLessonRecord(recordId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))

    recordsData = recordsData.filter(r => r.id !== recordId)
  }

  static async getStatistics(studentId?: string, startDate?: string, endDate?: string) {
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