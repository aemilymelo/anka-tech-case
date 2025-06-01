import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'

type Ativo = {
  id: number
  nome: string
  valor: number
}

export default function AtivosPorClientePage() {
  const router = useRouter()
  const { id } = router.query // Pega o id do cliente na URL

  const { data: ativos, isLoading, error } = useQuery({
    queryKey: ['ativos', id],
    queryFn: async () => {
      const response = await axios.get<Ativo[]>(`http://localhost:3333/clientes/${id}/ativos`)
      return response.data
    },
  })

  if (isLoading) return <p>Carregando ativos...</p>
  if (error) return <p>Erro ao carregar ativos </p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ativos do Cliente {id}</h1>
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
              <td>{ativo.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
