'use client'

import { useState, useEffect } from 'react'
import { Student, LessonRecord } from '@/lib/kv'
import StudentTabs from '@/components/StudentTabs'
import ControlButtons from '@/components/ControlButtons'
import FilterBar from '@/components/FilterBar'
import LessonRecordList from '@/components/LessonRecordList'
import AddRecordModal from '@/components/AddRecordModal'
import EditRecordModal from '@/components/EditRecordModal'
import StudentManageModal from '@/components/StudentManageModal'

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])
  const [records, setRecords] = useState<LessonRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<LessonRecord[]>([])
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<LessonRecord | null>(null)

  const [filterParams, setFilterParams] = useState({
    startDate: '',
    endDate: '',
    limit: 50
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [records, activeStudentId, filterParams])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      await Promise.all([loadStudents(), loadRecords()])
    } catch (error) {
      console.error('加载数据失败:', error)
      alert('加载数据失败，请刷新页面重试')
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const result = await response.json()
      if (result.success) {
        setStudents(result.data)
      }
    } catch (error) {
      console.error('获取学生列表失败:', error)
    }
  }

  const loadRecords = async () => {
    try {
      const response = await fetch('/api/lessons')
      const result = await response.json()
      if (result.success) {
        setRecords(result.data)
      }
    } catch (error) {
      console.error('获取课程记录失败:', error)
    }
  }

  const applyFilters = () => {
    let filtered = records

    if (activeStudentId) {
      filtered = filtered.filter(record => record.studentId === activeStudentId)
    }

    if (filterParams.startDate) {
      filtered = filtered.filter(record => record.date >= filterParams.startDate)
    }

    if (filterParams.endDate) {
      filtered = filtered.filter(record => record.date <= filterParams.endDate)
    }

    if (filterParams.limit > 0) {
      filtered = filtered.slice(0, filterParams.limit)
    }

    setFilteredRecords(filtered)
  }

  const handleAddRecord = async (data: {
    studentId: string
    studentName: string
    date: string
    time: string
    note: string
  }) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      if (result.success) {
        await loadRecords()
        setShowAddModal(false)
      } else {
        alert('添加记录失败: ' + result.error)
      }
    } catch (error) {
      console.error('添加记录失败:', error)
      alert('添加记录失败，请重试')
    }
  }

  const handleEditRecord = async (data: Partial<LessonRecord>) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      if (result.success) {
        await loadRecords()
        setShowEditModal(false)
        setEditingRecord(null)
      } else {
        alert('修改记录失败: ' + result.error)
      }
    } catch (error) {
      console.error('修改记录失败:', error)
      alert('修改记录失败，请重试')
    }
  }

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('确定要删除这条记录吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/lessons?id=${recordId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        await loadRecords()
      } else {
        alert('删除记录失败: ' + result.error)
      }
    } catch (error) {
      console.error('删除记录失败:', error)
      alert('删除记录失败，请重试')
    }
  }

  const handleAddStudent = async (name: string) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      const result = await response.json()
      if (result.success) {
        await loadStudents()
      } else {
        alert('添加学生失败: ' + result.error)
      }
    } catch (error) {
      console.error('添加学生失败:', error)
      alert('添加学生失败，请重试')
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students?id=${studentId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        await Promise.all([loadStudents(), loadRecords()])
        if (activeStudentId === studentId) {
          setActiveStudentId(null)
        }
      } else {
        alert('删除学生失败: ' + result.error)
      }
    } catch (error) {
      console.error('删除学生失败:', error)
      alert('删除学生失败，请重试')
    }
  }

  const openEditModal = (record: LessonRecord) => {
    setEditingRecord(record)
    setShowEditModal(true)
  }

  const handleFilterChange = (startDate: string, endDate: string, limit: number) => {
    setFilterParams({ startDate, endDate, limit })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          课程时间记录
        </h1>
        <p className="text-gray-600">记录和管理学生课程时间</p>
      </header>

      <StudentTabs
        students={students}
        activeStudentId={activeStudentId}
        onStudentSelect={setActiveStudentId}
      />

      <ControlButtons
        onAddRecord={() => setShowAddModal(true)}
        onManageStudents={() => setShowStudentModal(true)}
      />

      <FilterBar
        onFilterChange={handleFilterChange}
        totalRecords={filteredRecords.length}
      />

      <LessonRecordList
        records={filteredRecords}
        onEdit={openEditModal}
        onDelete={handleDeleteRecord}
      />

      <AddRecordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddRecord}
        students={students}
        selectedStudentId={activeStudentId}
      />

      <EditRecordModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingRecord(null)
        }}
        onSubmit={handleEditRecord}
        students={students}
        record={editingRecord}
      />

      <StudentManageModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        students={students}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
      />
    </div>
  )
}