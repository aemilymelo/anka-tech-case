import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Cliente = {
  id: number
  nome: string
  email: string
  status: boolean
}

export default function ClientesPage() {
  // Buscar dados da API
  const { data: clientes, isLoading, error } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const response = await axios.get<Cliente[]>('http://localhost:3333/clientes')
      return response.data
    }
  })

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar os clientes </p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista de Clientes</h1>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {clientes?.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.status ? 'Ativo' : 'Inativo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
