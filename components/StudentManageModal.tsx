'use client'

import { useState } from 'react'
import { Student } from '@/lib/kv'
import { X, Plus, Trash2 } from 'lucide-react'

interface StudentManageModalProps {
  isOpen: boolean
  onClose: () => void
  students: Student[]
  onAddStudent: (name: string) => void
  onDeleteStudent: (studentId: string) => void
}

export default function StudentManageModal({
  isOpen,
  onClose,
  students,
  onAddStudent,
  onDeleteStudent
}: StudentManageModalProps) {
  const [newStudentName, setNewStudentName] = useState('')

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newStudentName.trim()) {
      alert('请输入学生姓名')
      return
    }

    onAddStudent(newStudentName.trim())
    setNewStudentName('')
  }

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (confirm(`确定要删除学生 "${studentName}" 吗？这将同时删除该学生的所有课程记录。`)) {
      onDeleteStudent(studentId)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">学生管理</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAddStudent} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="输入学生姓名"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <Plus size={16} />
                添加
              </button>
            </div>
          </form>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              当前学生列表 ({students.length}人)
            </h3>

            {students.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                暂无学生
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-gray-500">
                        添加时间: {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteStudent(student.id, student.name)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}