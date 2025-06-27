import React from 'react'
import { BarChart3, FileText, ShoppingCart, Package, Users } from 'lucide-react'
import { MenuItem } from '../types'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userType: string
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userType }) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['ADMIN', 'CLIENT', 'SUPPLIER'] },
    { id: 'quotes', label: 'Cotações', icon: FileText, roles: ['ADMIN', 'CLIENT', 'SUPPLIER'] },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart, roles: ['ADMIN', 'CLIENT'] },
    { id: 'products', label: 'Produtos', icon: Package, roles: ['ADMIN'] },
    { id: 'users', label: 'Usuários', icon: Users, roles: ['ADMIN'] },
  ]

  return (
    <div className="w-64 h-screen bg-white border-r shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800">Portal Cotações</h1>
        <p className="mt-1 text-sm text-gray-500">Sistema de Gestão</p>
      </div>
      <nav className="mt-6">
        {menuItems
          .filter(item => item.roles.includes(userType))
          .map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                activeTab === item.id ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700' : 'text-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
      </nav>
    </div>
  )
}

export default Sidebar