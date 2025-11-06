"use client"

import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Menu,
  Shield,
} from 'lucide-react'
import { AuthContext } from '@/contexts/auth.context'

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, onLogout }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Função para gerar iniciais do nome
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const currentUser = {
    name: user?.nome || "Usuário",
    username: user?.username || "",
    avatar: "/api/placeholder/40/40",
    role: user?.tipoDesignacao || "Usuário",
    initials: user?.nome ? getInitials(user.nome) : "U"
  };
  return (
    <header className="bg-gradient-to-r from-white via-gray-50/80 to-white backdrop-blur-md border-b border-gray-200 h-20 px-6 flex items-center justify-between ">
      {/* Left Section - Search and Menu */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            console.log('Mobile menu button clicked');
            onToggleMobileSidebar?.();
          }}
          className="h-10 w-10 p-0 text-gray-600 hover:text-[#182F59] hover:bg-[#182F59]/5 rounded-xl lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Right Section - Actions and User */}
      <div className="flex items-center space-x-3">
        {/* Quick Actions */}
          
    
        {/* Divider */}
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm border border-gray-200/40 rounded-2xl px-4 py-2 hover:bg-white/80 hover:shadow-md transition-all duration-200">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-[#FFD002]/20 ring-offset-2">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#182F59] to-[#1a3260] text-[#FFD002] text-sm font-bold">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Shield className="h-2 w-2 text-white" />
            </div>
          </div>
          
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-600 font-medium">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header