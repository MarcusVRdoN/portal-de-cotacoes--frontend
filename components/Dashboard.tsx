import React from 'react'
import { BarChart3, FileText, Check, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { User, Stat } from '../types'

interface DashboardProps {
  user: User
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const stats: Stat[] = [
    { title: 'Cotações Pendentes', value: '5', change: '+2', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { title: 'Pedidos Confirmados', value: '12', change: '+3', color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Produtos Cadastrados', value: '150', change: '+10', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Estoque Baixo', value: '8', change: '-2', color: 'text-red-600', bgColor: 'bg-red-50' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Dashboard</h3>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <BarChart3 className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color}`}>
                {stat.change} em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cards de Informações */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas movimentações do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-blue-100 rounded-full">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova cotação solicitada</p>
                  <p className="text-xs text-gray-500">há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-green-100 rounded-full">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pedido #1234 confirmado</p>
                  <p className="text-xs text-gray-500">há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 mr-3 bg-yellow-100 rounded-full">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Cotação aguardando resposta</p>
                  <p className="text-xs text-gray-500">há 6 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Rápidas</CardTitle>
            <CardDescription>Resumo de performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Taxa de conversão</span>
                <span className="font-bold text-green-600">85%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-600 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Tempo médio resposta</span>
                <span className="font-bold text-blue-600">2.4h</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-600 rounded-full" style={{ width: '70%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Satisfação cliente</span>
                <span className="font-bold text-purple-600">94%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-purple-600 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard