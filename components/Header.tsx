import React from 'react'
import { Settings, LogOut } from 'lucide-react'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { User } from '../types'

interface HeaderProps {
  user: User
  onLogout: () => void
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="px-6 py-4 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Bem-vindo, {user.nome}
          </h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-xs">
            {user.tipo_usuario}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative w-8 h-8 rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/avatars/01.png" alt={user.nome} />
                  <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.nome}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Header