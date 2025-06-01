import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'

type Ativo = {
  id: number
  nome: string
  valor: number
}

// Página para listar ativos
export default function AtivosPage() {
  const { data: ativos, isLoading, error } = useQuery({
    queryKey: ['ativos'],
    queryFn: async () => {
      const response = await axios.get<Ativo[]>('http://localhost:3333/ativos')
      return response.data
    }
  })

  if (isLoading) return <p>Carregando ativos...</p>
  if (error) return <p>Erro ao carregar ativos 😢</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista de Ativos</h1>
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {ativos?.map(ativo => (
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
        <input
          type="text"
          placeholder="Nome do Ativo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <input
          type="number"
          placeholder="ID do Cliente"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}
