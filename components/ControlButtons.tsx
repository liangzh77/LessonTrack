'use client'

import { Plus, User } from 'lucide-react'

interface ControlButtonsProps {
  onAddRecord: () => void
  onManageStudents: () => void
}

export default function ControlButtons({ onAddRecord, onManageStudents }: ControlButtonsProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onAddRecord}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={18} />
          新增记录
        </button>
        <button
          onClick={onManageStudents}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <User size={18} />
          管理学生
        </button>
      </div>
    </div>
  )
}