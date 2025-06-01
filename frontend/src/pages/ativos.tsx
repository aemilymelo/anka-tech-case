import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/router';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type Ativo = {
  id: number;
  nome: string;
  valor: number;
};

// Página para listar ativos
export default function AtivosPage() {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };

  const handleRedirectToFixedAssets = () => {
    router.push('/ativos-fixos'); 
  }

  const { data: ativos, isLoading, error } = useQuery({
    queryKey: ['ativos'],
    queryFn: async () => {
      const response = await axios.get<Ativo[]>('http://localhost:3333/ativos');
      return response.data;
    }
  });

  if (isLoading) return <p className="text-center text-gray-500">Carregando ativos...</p>;
  if (error) return <p className="text-center text-red-500">Erro ao carregar ativos</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
        Voltar
      </Button>
      <Button onClick={handleRedirectToFixedAssets} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Ir para Ativos Fixos
      </Button>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Lista de Ativos</h1>

      <Table className="min-w-full bg-white rounded-lg shadow-md">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="px-4 py-2 text-sm text-gray-600">ID</TableHead>
            <TableHead className="px-4 py-2 text-sm text-gray-600">Nome</TableHead>
            <TableHead className="px-4 py-2 text-sm text-gray-600">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ativos?.map((ativo) => (
            <TableRow key={ativo.id} className="hover:bg-gray-50">
              <TableCell className="px-4 py-2 border-t text-sm text-gray-800">{ativo.id}</TableCell>
              <TableCell className="px-4 py-2 border-t text-sm text-gray-800">{ativo.nome}</TableCell>
              <TableCell className="px-4 py-2 border-t text-sm text-gray-800">R$ {ativo.valor.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Página para cadastrar ativos
export function CadastroAtivo() {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [clienteId, setClienteId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3333/ativos', {
        nome,
        valor: parseFloat(valor),
        clienteId: parseInt(clienteId),
      });
      alert('Ativo cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar ativo');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Cadastrar Novo Ativo</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Nome do Ativo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            step="0.01"
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="ID do Cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>
        <Button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
          Cadastrar Ativo
        </Button>
      </form>
    </div>
  );
}
