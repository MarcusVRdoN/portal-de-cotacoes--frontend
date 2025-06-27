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
import { Edit, Plus, Trash2 } from "lucide-react";
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
import { apiService } from "../services/apiService";
import { User } from "../types";

const UsersManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo_usuario: "CLIENT",
  });

  // Load admin token from storage (adjust as needed)
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  // Fetch all users on mount
  useEffect(() => {
    console.log(token)
    if (!token) return;
    apiService
      .listUsers(token)
      .then((res) => setUsers(res.usuarios))
      .catch((err) => console.error("Failed to load users", err));
  }, [token]);

  const handleCreateUser = async () => {
    if (!token) return;
    try {
      const { user } = await apiService.signup({
        nome: newUser.nome,
        email: newUser.email,
        senha: newUser.senha,
        tipo_usuario: newUser.tipo_usuario as "ADMIN" | "CLIENT" | "SUPPLIER",
      });
      setUsers((prev) => [...prev, user]);
      setNewUser({ nome: "", email: "", senha: "", tipo_usuario: "CLIENT" });
      setIsNewUserOpen(false);
    } catch (error) {
      console.error("Error creating user", error);
      // optionally show toast
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Usuários</h3>
          <p className="text-gray-600">Gerencie usuários do sistema</p>
        </div>
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
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={newUser.nome}
                  onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={newUser.senha}
                  onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
                  placeholder="Senha"
                />
              </div>
              <div>
                <Label htmlFor="tipo_usuario">Tipo de Usuário</Label>
                <Select
                  value={newUser.tipo_usuario}
                  onValueChange={(value) => setNewUser({ ...newUser, tipo_usuario: value })}
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
              <Button onClick={handleCreateUser}>Criar Usuário</Button>
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
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
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