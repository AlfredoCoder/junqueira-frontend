"use client"

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ActivityItemProps {
  icon: LucideIcon
  title: string
  time: string
  type?: 'success' | 'warning' | 'info' | 'default'
}

const ActivityItem: React.FC<ActivityItemProps> = ({ 
  icon: Icon, 
  title, 
  time, 
  type = 'default' 
}) => {
  const colors = {
    success: 'from-emerald-500 to-green-600',
    warning: 'from-amber-500 to-yellow-600',
    info: 'from-blue-500 to-indigo-600',
    default: 'from-gray-400 to-gray-600'
  }

  return (
    <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[type]}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

export default ActivityItem