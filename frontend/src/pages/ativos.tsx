import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/router';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type Ativo = {
  id: number
  nome: string
  valor: number
}

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
      const response = await axios.get<Ativo[]>('http://localhost:3333/ativos')
      return response.data
    }
  })

  if (isLoading) return <p>Carregando ativos...</p>
  if (error) return <p>Erro ao carregar ativos </p>

  return (
    <div style={{ padding: '2rem' }}>
      <Button onClick={handleBack}>Voltar</Button>
      <Button onClick={handleRedirectToFixedAssets}>Ir para Ativos Fixos</Button>
      <h1>Lista de Ativos</h1>

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
  )
}
// Página para cadastrar ativos
export function CadastroAtivo() {
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [clienteId, setClienteId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post('http://localhost:3333/ativos', {
        nome,
        valor: parseFloat(valor),
        clienteId: parseInt(clienteId),
      })
      alert('Ativo cadastrado com sucesso!')
    } catch (error) {
      alert('Erro ao cadastrar ativo')
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Cadastrar Ativo</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Nome do Ativo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <Input
          type="number"
          placeholder="ID do Cliente"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />
        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  )
}