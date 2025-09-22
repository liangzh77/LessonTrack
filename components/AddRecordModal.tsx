'use client'

import { useState, useEffect } from 'react'
import { Student } from '@/lib/kv'
import { X } from 'lucide-react'

interface AddRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    studentId: string
    studentName: string
    date: string
    time: string
    note: string
  }) => void
  students: Student[]
  selectedStudentId?: string
}

export default function AddRecordModal({
  isOpen,
  onClose,
  onSubmit,
  students,
  selectedStudentId
}: AddRecordModalProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    note: ''
  })

  useEffect(() => {
    if (selectedStudentId) {
      setFormData(prev => ({ ...prev, studentId: selectedStudentId }))
    }
  }, [selectedStudentId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.studentId || !formData.date) {
      alert('请填写学生和日期')
      return
    }

    const student = students.find(s => s.id === formData.studentId)
    if (!student) {
      alert('请选择有效的学生')
      return
    }

    onSubmit({
      studentId: formData.studentId,
      studentName: student.name,
      date: formData.date,
      time: formData.time,
      note: formData.note
    })

    setFormData({
      studentId: selectedStudentId || '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      note: ''
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">新增课程记录</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学生 *
              </label>
              <select
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">请选择学生</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日期 *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                时间
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                备注
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="可选的课程备注信息"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                保存
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}