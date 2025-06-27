'use client'

import React, { useState, createContext } from 'react'
import Dashboard from './Dashboard'
import QuotesManager from './QuotesManager'
import LoginForm from './LoginForm'
import Sidebar from './Sidebar'
import Header from './Header'
import UsersManager from './UsersManager'
import OrdersManager from './OrdersManager'
import ProductsManager from './ProductsManager'
import { User } from '@/types'

const AppContext = createContext<any>(null)

const PortalCotacoes = () => {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogin = (userData: User) => {
    setUser(userData)
    setActiveTab('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setActiveTab('dashboard')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user as User} />
      case 'quotes':
        return <QuotesManager user={user as User} />
      case 'orders':
        return <OrdersManager user={user as User} />
      case 'products':
        return <ProductsManager />
      case 'users':
        return <UsersManager />
      default:
        return <Dashboard user={user as User} />
    }
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userType={user.tipo_usuario} 
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header user={user} onLogout={handleLogout} />
          <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto bg-gray-50">
            {renderContent()}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  )
}

export default PortalCotacoes