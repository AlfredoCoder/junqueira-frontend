"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { GraduationCap, Download, Users } from "lucide-react"

interface WelcomeHeaderProps {
  title?: string
  description?: string
  iconMain?: React.ReactNode

  // Botão da esquerda
  titleBtnLeft?: string
  iconBtnLeft?: React.ReactNode
  classNameBtnLeft?: string
  onClickBtnLeft?: () => void

  // Botão da direita
  titleBtnRight?: string
  iconBtnRight?: React.ReactNode
  classNameBtnRight?: string
  onClickBtnRight?: () => void

  // Classes adicionais
  className?: string
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  title = "Bem-vindo!",
  description = "Descrição padrão aqui...",
  iconMain = <GraduationCap className="h-8 w-8 text-white" />,

  titleBtnLeft,
  iconBtnLeft,
  classNameBtnLeft,
  onClickBtnLeft,

  titleBtnRight,
  iconBtnRight,
  classNameBtnRight,
  onClickBtnRight,

  className,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm ${className}`}
    >
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 ultra-fast-fade">
          {/* Header content */}
          <div className="space-y-3 ultra-fast-fade">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                {iconMain}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
                <p className="text-[#F9CD1D] font-semibold text-lg">
                  Sistema de Gestão Escolar Complexo Abilio Junqueira
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm max-w-2xl">{description}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {titleBtnLeft && (
              <Button
                variant="outline"
                className={`border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${classNameBtnLeft}`}
                onClick={onClickBtnLeft}
              >
                {iconBtnLeft || <Download className="w-5 h-5 mr-2" />}
                {titleBtnLeft}
              </Button>
            )}

            {titleBtnRight && (
              <Button
                className={`bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${classNameBtnRight}`}
                onClick={onClickBtnRight}
              >
                {iconBtnRight || <Users className="w-5 h-5 mr-2" />}
                {titleBtnRight}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#D2B48C]/5 rounded-full"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
    </div>
  )
}

export default WelcomeHeader
