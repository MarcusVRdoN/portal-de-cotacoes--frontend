import React, { useMemo, useState } from 'react'
import { Package, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import type { LoginFormProps, User } from '@/@types'
import { useAuth } from '@/hooks/useApi'
// import { useRouter } from 'next/navigation'

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, loading, error, user } = useAuth()
  // const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      await signIn(email, password);
      // router.push('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };

  useMemo(() => onLogin(user as unknown as User), [onLogin, user])

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-full">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Portal de Cotações</h2>
          <p className="mt-2 text-sm text-gray-600">Sistema de Gestão Empresarial</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Entrar no Sistema</CardTitle>
            <CardDescription>Digite suas credenciais para acessar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 border border-red-200 rounded bg-red-50">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="w-full text-sm text-gray-600">
              <div className="p-3 rounded bg-gray-50">
                <p className="mb-2 font-medium">Contas de teste:</p>
                <div className="space-y-1 text-xs">
                  <p><strong>Admin:</strong> admin@portal.com</p>
                  <p><strong>Cliente:</strong> joao.cliente@email.com</p>
                  <p><strong>Fornecedor:</strong> maria.fornecedora@email.com</p>
                  <p><strong>Senha:</strong> 123456</p>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginForm