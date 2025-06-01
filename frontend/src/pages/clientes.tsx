import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { useRouter } from "next/router";

// Definindo o tipo do Cliente
type Cliente = {
  id: number;
  nome: string;
  email: string;
  status: boolean;
};

// Schema para validação com Zod
const clienteSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  status: z.coerce.boolean(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export default function ClientesPage() {
  const router = useRouter();

  // Função para voltar à página anterior
  const handleBack = () => {
    router.back(); // Retorna para a página anterior
  };

  // Função para buscar os clientes da API
  const { data: clientes, isLoading, error, refetch } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await axios.get<Cliente[]>("http://localhost:3333/clientes");
      return response.data;
    },
  });

  // Estado para edição de cliente
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [showAtivoForm, setShowAtivoForm] = useState(false);
  const [clienteIdForAtivo, setClienteIdForAtivo] = useState<number | null>(null);
  const [nomeAtivo, setNomeAtivo] = useState("");
  const [valorAtivo, setValorAtivo] = useState("");

  // Configuração do React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      status: true,
    },
  });

  // Função de submit para cadastrar ou editar cliente
  const onSubmit = async (data: ClienteFormData) => {
    try {
      if (editingClient) {
        await axios.put(`http://localhost:3333/clientes/${editingClient.id}`, data);
        alert("Cliente atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:3333/clientes", data);
        alert("Cliente cadastrado com sucesso!");
      }

      reset();
      setEditingClient(null);
      refetch();
    } catch (error) {
      alert("Erro ao cadastrar ou editar cliente");
    }
  };

  // Função para editar os dados de um cliente
  const handleEdit = (cliente: Cliente) => {
    setValue("nome", cliente.nome);
    setValue("email", cliente.email);
    setValue("status", cliente.status);
    setEditingClient(cliente);
  };

  // Função para deletar um cliente
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3333/clientes/${id}`);
      alert("Cliente deletado com sucesso!");
      refetch();
    } catch (error) {
      alert("Erro ao deletar cliente");
    }
  };

  // Função para adicionar ativo ao cliente
  const handleAddAtivo = (clienteId: number) => {
    setClienteIdForAtivo(clienteId);
    setShowAtivoForm(true);
  };

  // Função para cadastrar um ativo para o cliente
  const handleCadastrarAtivo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeAtivo || !valorAtivo) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      await axios.post(`http://localhost:3333/clientes/${clienteIdForAtivo}/ativos`, {
        nome: nomeAtivo,
        valor: parseFloat(valorAtivo),
      });
      alert("Ativo adicionado com sucesso!");
      setShowAtivoForm(false);
      setNomeAtivo("");
      setValorAtivo("");
      refetch();
    } catch (error) {
      alert("Erro ao cadastrar ativo");
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os clientes</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <Button onClick={handleBack}>Voltar</Button>
      <h1>Lista de Clientes</h1>

      {/* Tabela de Clientes com o componente Table do ShadCN */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ativos</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes?.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>{cliente.id}</TableCell>
              <TableCell>{cliente.nome}</TableCell>
              <TableCell>{cliente.email}</TableCell>
              <TableCell>{cliente.status ? "Ativo" : "Inativo"}</TableCell>
              <TableCell>
                <Link href={`/ativos-cliente/${cliente.id}`}>Ver</Link>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(cliente)}>Editar</Button>
                <Button onClick={() => handleDelete(cliente.id)}>Deletar</Button>
                <Button onClick={() => handleAddAtivo(cliente.id)}>Adicionar Ativo</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2>{editingClient ? "Editar Cliente" : "Cadastrar Novo Cliente"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input type="text" placeholder="Nome" {...register("nome")} />
          {errors.nome && <p style={{ color: "red" }}>{errors.nome.message}</p>}
        </div>

        <div>
          <Input type="email" placeholder="Email" {...register("email")} />
          {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
        </div>

        <div>
          <select
              onChange={(e) => setValue("status", e.target.value === "true")}
              value={watch("status") ? "true" : "false"}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
          </select>

        </div>

        <Button type="submit">
          {editingClient ? "Atualizar Cliente" : "Cadastrar Cliente"}
        </Button>
      </form>

      {showAtivoForm && (
        <div>
          <h2>Cadastrar Novo Ativo</h2>
          <form onSubmit={handleCadastrarAtivo}>
            <div>
              <Input
                type="text"
                placeholder="Nome do Ativo"
                value={nomeAtivo}
                onChange={(e) => setNomeAtivo(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Valor"
                value={valorAtivo}
                onChange={(e) => setValorAtivo(e.target.value)}
                step="0.01"
              />
            </div>
            <Button type="submit">Cadastrar Ativo</Button>
          </form>
        </div>
      )}
    </div>
  );
}
