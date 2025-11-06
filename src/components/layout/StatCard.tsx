"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color: string
  bgColor: string
  accentColor: string
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color, 
  bgColor, 
  accentColor 
}) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl ${bgColor} border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${accentColor} shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {changeType === 'up' ? (
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          ) : changeType === 'down' ? (
            <TrendingDown className="h-3 w-3 text-red-500" />
          ) : (
            <Activity className="h-3 w-3 text-blue-500" />
          )}
          <span className={`font-bold text-xs ${
            changeType === 'up' ? 'text-emerald-600' : 
            changeType === 'down' ? 'text-red-600' : 'text-blue-600'
          }`}>
            {change}
          </span>
        </div>
      </div>
      <div>
        <p className={`text-sm font-semibold mb-2 ${color}`}>{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
    </div>
  )
}

export default StatCard