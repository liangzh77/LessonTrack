'use client'

import { Student } from '@/lib/kv'

interface StudentTabsProps {
  students: Student[]
  activeStudentId: string | null
  onStudentSelect: (studentId: string | null) => void
}

export default function StudentTabs({ students, activeStudentId, onStudentSelect }: StudentTabsProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => onStudentSelect(null)}
          className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeStudentId === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          全部学生
        </button>
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => onStudentSelect(student.id)}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeStudentId === student.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {student.name}
          </button>
        ))}
      </div>
    </div>
  )
}