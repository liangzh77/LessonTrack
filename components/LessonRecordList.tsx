'use client'

import { LessonRecord } from '@/lib/kv'
import { Edit, Trash2 } from 'lucide-react'

interface LessonRecordListProps {
  records: LessonRecord[]
  onEdit: (record: LessonRecord) => void
  onDelete: (recordId: string) => void
}

export default function LessonRecordList({ records, onEdit, onDelete }: LessonRecordListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        暂无课程记录
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div
          key={record.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div className="font-medium text-gray-900">
                  {record.studentName}
                </div>
                <div className="text-gray-600">
                  {formatDate(record.date)}
                  {record.time && (
                    <span className="ml-2 text-blue-600">
                      {record.time}
                    </span>
                  )}
                </div>
              </div>
              {record.note && (
                <div className="mt-2 text-gray-700 text-sm">
                  备注: {record.note}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(record)}
                className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit size={16} />
                修改
              </button>
              <button
                onClick={() => onDelete(record.id)}
                className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 size={16} />
                删除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}