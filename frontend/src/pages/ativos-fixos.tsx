import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type AtivoFixo = {
  id: number;
  nome: string;
  valor: number;
};

export default function AtivosFixosPage() {
  const router = useRouter();

  // Função para voltar à página anterior
  const handleBack = () => {
    router.back(); // Retorna para a página anterior
  };

  // Função para buscar os ativos fixos da API
  const { data: ativos, isLoading, error } = useQuery({
    queryKey: ['ativos-fixos'],
    queryFn: async () => {
      const response = await axios.get<AtivoFixo[]>('http://localhost:3333/ativos-fixos');
      return response.data;
    }
  });

  if (isLoading) return <p className="text-center text-gray-500">Carregando ativos fixos...</p>;
  if (error) return <p className="text-center text-red-500">Erro ao carregar ativos fixos</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
        Voltar
      </Button>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Lista de Ativos Fixos (Mercado)</h1>

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
