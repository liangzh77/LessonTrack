'use client'

import { useState } from 'react'

interface FilterBarProps {
  onFilterChange: (startDate: string, endDate: string, limit: number) => void
  totalRecords: number
}

export default function FilterBar({ onFilterChange, totalRecords }: FilterBarProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [limit, setLimit] = useState(50)

  const handleFilterSubmit = () => {
    onFilterChange(startDate, endDate, limit)
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setLimit(50)
    onFilterChange('', '', 50)
  }

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            开始日期
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            结束日期
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            显示条数
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10条</option>
            <option value={20}>20条</option>
            <option value={50}>50条</option>
            <option value={100}>100条</option>
            <option value={0}>全部</option>
          </select>
        </div>
        <div className="flex flex-col justify-end gap-2">
          <button
            onClick={handleFilterSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            筛选
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            清除
          </button>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-600">
        共找到 {totalRecords} 条记录
      </div>
    </div>
  )
}