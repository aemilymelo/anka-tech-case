import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type AtivoFixo = {
  id: number
  nome: string
  valor: number
}

export default function AtivosFixosPage() {
  const { data: ativos, isLoading, error } = useQuery({
    queryKey: ['ativos-fixos'],
    queryFn: async () => {
      const response = await axios.get<AtivoFixo[]>('http://localhost:3333/ativos-fixos')
      return response.data
    }
  })

  if (isLoading) return <p>Carregando ativos fixos...</p>
  if (error) return <p>Erro ao carregar ativos fixos 😢</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista de Ativos Fixos (Mercado)</h1>
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {ativos?.map((ativo) => (
            <tr key={ativo.id}>
              <td>{ativo.id}</td>
              <td>{ativo.nome}</td>
              <td>R$ {ativo.valor.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
