import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    router.back();
  };

  // Função para buscar os clientes da API
  const {
    data: clientes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await axios.get<Cliente[]>(
        "http://localhost:3333/clientes"
      );
      return response.data;
    },
  });

  // Estado para edição de cliente
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [showAtivoForm, setShowAtivoForm] = useState(false);
  const [clienteIdForAtivo, setClienteIdForAtivo] = useState<number | null>(
    null
  );
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
        await axios.put(
          `http://localhost:3333/clientes/${editingClient.id}`,
          data
        );
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
      await axios.post(
        `http://localhost:3333/clientes/${clienteIdForAtivo}/ativos`,
        {
          nome: nomeAtivo,
          valor: parseFloat(valorAtivo),
        }
      );
      alert("Ativo adicionado com sucesso!");
      setShowAtivoForm(false);
      setNomeAtivo("");
      setValorAtivo("");
      refetch();
    } catch (error) {
      alert("Erro ao cadastrar ativo");
    }
  };

  if (isLoading)
    return <p className="text-center text-gray-500">Carregando...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Erro ao carregar os clientes</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
      >
        Voltar
      </Button>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Lista de Clientes
      </h1>

      {/* Tabela de Clientes com o componente Table do ShadCN */}
      <Table className="min-w-full bg-white rounded-lg shadow-md">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="px-4 py-2">ID</TableHead>
            <TableHead className="px-4 py-2">Nome</TableHead>
            <TableHead className="px-4 py-2">Email</TableHead>
            <TableHead className="px-4 py-2">Status</TableHead>
            <TableHead className="px-4 py-2">Ativos</TableHead>
            <TableHead className="px-4 py-2">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes?.map((cliente) => (
            <TableRow key={cliente.id} className="hover:bg-gray-100">
              <TableCell className="px-4 py-2 border-t">{cliente.id}</TableCell>
              <TableCell className="px-4 py-2 border-t">
                {cliente.nome}
              </TableCell>
              <TableCell className="px-4 py-2 border-t">
                {cliente.email}
              </TableCell>
              <TableCell className="px-4 py-2 border-t">
                {cliente.status ? "Ativo" : "Inativo"}
              </TableCell>
              <TableCell className="px-4 py-2 border-t">
                <Link
                  href={`/ativos-cliente/${cliente.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver
                </Link>
              </TableCell>
              <TableCell className="px-4 py-2 border-t flex space-x-2">
                <Button
                  onClick={() => handleEdit(cliente)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => handleDelete(cliente.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                >
                  Deletar
                </Button>
                <Button
                  onClick={() => handleAddAtivo(cliente.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Adicionar Ativo
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8">
        {editingClient ? "Editar Cliente" : "Cadastrar Novo Cliente"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Input
            type="text"
            placeholder="Nome"
            {...register("nome")}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
        </div>

        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Select
            onValueChange={(value) => setValue("status", value === "true")}
            value={watch("status") ? "true" : "false"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          {editingClient ? "Atualizar Cliente" : "Cadastrar Cliente"}
        </Button>
      </form>

      {showAtivoForm && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Cadastrar Novo Ativo
          </h2>
          <form onSubmit={handleCadastrarAtivo} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Nome do Ativo"
                value={nomeAtivo}
                onChange={(e) => setNomeAtivo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Valor"
                value={valorAtivo}
                onChange={(e) => setValorAtivo(e.target.value)}
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <Button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              Cadastrar Ativo
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
