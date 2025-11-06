"use client"

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ChartCardProps {
  title: string
  children: React.ReactNode
  icon: LucideIcon
  action?: React.ReactNode | null
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  icon: Icon, 
  action = null 
}) => {
  return (
    <div className="bg-white rounded-2xl border-0 p-6 backdrop-blur-sm bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59]/10 to-[#1a3260]/5">
            <Icon className="h-5 w-5 text-[#182F59]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {action && action}
      </div>
      {children}
    </div>
  )
}

export default ChartCard