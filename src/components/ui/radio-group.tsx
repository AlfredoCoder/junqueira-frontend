"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

interface RadioGroupItemProps {
  value: string
  id: string
  className?: string
}

const RadioGroup = ({ value, onValueChange, className, children }: RadioGroupProps) => {
  return (
    <div className={cn("grid gap-2", className)} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { selectedValue: value, onValueChange })
        }
        return child
      })}
    </div>
  )
}

const RadioGroupItem = ({ value, id, className, selectedValue, onValueChange }: RadioGroupItemProps & { selectedValue?: string, onValueChange?: (value: string) => void }) => {
  const isSelected = selectedValue === value

  return (
    <input
      type="radio"
      id={id}
      name="radio-group"
      value={value}
      checked={isSelected}
      onChange={() => onValueChange?.(value)}
      className={cn(
        "h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2",
        className
      )}
    />
  )
}

export { RadioGroup, RadioGroupItem }
