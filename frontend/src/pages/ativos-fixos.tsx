import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type AtivoFixo = {
  id: number
  nome: string
  valor: number
}

export default function AtivosFixosPage() {
  const router = useRouter()

  const handleBack = () => {
    router.back(); // Retorna para a página anterior
  };

  const { data: ativos, isLoading, error } = useQuery({
    queryKey: ['ativos-fixos'],
    queryFn: async () => {
      const response = await axios.get<AtivoFixo[]>('http://localhost:3333/ativos-fixos')
      return response.data
    }
  });

  if (isLoading) return <p>Carregando ativos fixos...</p>;
  if (error) return <p>Erro ao carregar ativos fixos</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Button onClick={handleBack}>Voltar</Button>
      <h1>Lista de Ativos Fixos (Mercado)</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ativos?.map((ativo) => (
            <TableRow key={ativo.id}>
              <TableCell>{ativo.id}</TableCell>
              <TableCell>{ativo.nome}</TableCell>
              <TableCell>R$ {ativo.valor.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
