import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Edit, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth, useUsers } from "@/hooks/useApi";
import { LoadingSpinner, ErrorMessage } from './LoadingAndError'
import { UserType } from "@/@types";

const UsersManager = () => {
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", userType: UserType.CLIENT });
  const [editingUser, setEditingUser] = useState({ id_usuario: 0, name: "", email: "", newPassword: "", userType: UserType.CLIENT });
  const { users, loading, error, fetchUsers, deleteUser, updateUser } = useUsers()
  const { loading: loadingAuth, signUp } = useAuth()

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    await signUp(newUser)
    fetchUsers();
    setIsNewUserOpen(false)
    setNewUser({ name: "", email: "", password: "", userType: UserType.CLIENT })
  };

  const handleEditUser = (user: { id_usuario: number; nome: string, email: string, newPassword: string, tipo_usuario: UserType }) => {
    setEditingUser({
      id_usuario: user.id_usuario,
      name: user.nome,
      email: user.email,
      newPassword: user.newPassword,
      userType: user.tipo_usuario
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    await updateUser(editingUser.id_usuario, {
      name: editingUser.name,
      email: editingUser.email,
      newPassword: editingUser.newPassword,
      userType: editingUser.userType
    });
    fetchUsers();
    setIsEditUserOpen(false);
    setEditingUser({ id_usuario: 0, name: "", email: "", newPassword: "", userType: UserType.CLIENT });
  };

  const getUserTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      ADMIN: { variant: "destructive", label: "Admin" },
      CLIENT: { variant: "default", label: "Cliente" },
      SUPPLIER: { variant: "secondary", label: "Fornecedor" },
    };
    const config = variants[type] || { variant: "default", label: type };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading && users.length === 0) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} onRetry={() => fetchUsers()} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Usuários</h3>
          <p className="text-gray-600">Gerencie usuários do sistema</p>
        </div>
        {/* Dialog de criação de novo usuário */}
        <Dialog open={isNewUserOpen} onOpenChange={setIsNewUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Usuário</DialogTitle>
              <DialogDescription>Cadastre um novo usuário no sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-name">Nome</Label>
                <Input
                  id="new-name"
                  value={newUser.name}
                  onChange={(event) => setNewUser({ ...newUser, name: event.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(event) => setNewUser({ ...newUser, email: event.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="new-password">Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(event) => setNewUser({ ...newUser, password: event.target.value })}
                  placeholder="Senha"
                />
              </div>
              <div>
                <Label htmlFor="new-userType">Tipo de Usuário</Label>
                <Select
                  value={newUser.userType}
                  onValueChange={(value) => setNewUser({ ...newUser, userType: value as UserType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Cliente</SelectItem>
                    <SelectItem value="SUPPLIER">Fornecedor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewUserOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser} disabled={loadingAuth}>
                {loadingAuth ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Usuário'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Dialog de edição de usuário */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>Edite as informações do usuário no sistema</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(event) => setEditingUser({ ...editingUser, name: event.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(event) => setEditingUser({ ...editingUser, email: event.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="edit-password">Senha</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editingUser.newPassword}
                  onChange={(event) => setEditingUser({ ...editingUser, newPassword: event.target.value })}
                  placeholder="Senha"
                />
              </div>
              <div>
                <Label htmlFor="edit-userType">Tipo de Usuário</Label>
                <Select
                  value={editingUser.userType}
                  onValueChange={(value) => setEditingUser({ ...editingUser, userType: value as UserType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Cliente</SelectItem>
                    <SelectItem value="SUPPLIER">Fornecedor</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateUser} disabled={loadingAuth}>
                {loadingAuth ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>{users.length} usuários cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id_usuario}
                className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.nome}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getUserTypeBadge(user.tipo_usuario)}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={loading}
                    onClick={() => handleEditUser(user as any)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={loading}
                    onClick={() => deleteUser(user.id_usuario)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManager;