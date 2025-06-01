import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'

type Ativo = {
  id: number
  nome: string
  valor: number
}

export default function AtivosPorClientePage() {
  const router = useRouter()
  const { id } = router.query

  const { data: ativos, isLoading, error } = useQuery({
    queryKey: ['ativos', id],
    queryFn: async () => {
      const response = await axios.get<Ativo[]>(`http://localhost:3333/clientes/${id}/ativos`)
      return response.data
    },
    enabled: !!id, // Garante que a requisição só será feita se o `id` estiver presente
  })

  const [nomeAtivo, setNomeAtivo] = useState('')
  const [valorAtivo, setValorAtivo] = useState('')

  // Função de envio de formulário para cadastrar o novo ativo
  const handleCadastrarAtivo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nomeAtivo || !valorAtivo) {
      alert('Preencha todos os campos!')
      return
    }

    try {
      // Enviar os dados do novo ativo para o backend
      await axios.post(`http://localhost:3333/clientes/${id}/ativos`, {
        nome: nomeAtivo,
        valor: parseFloat(valorAtivo)
      })

      // Limpar os campos após o cadastro
      setNomeAtivo('')
      setValorAtivo('')
      alert('Ativo cadastrado com sucesso!')

      // Recarregar a lista de ativos para mostrar o novo ativo
      router.replace(router.asPath)
    } catch (err) {
      alert('Erro ao cadastrar ativo')
    }
  }

  if (isLoading) return <p>Carregando ativos...</p>
  if (error) return <p>Erro ao carregar ativos</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ativos do Cliente {id}</h1>

      {/* Tabela de ativos */}
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

      {/* Formulário de cadastro de ativo */}
      <h2 style={{ marginTop: '2rem' }}>Cadastrar novo ativo</h2>
      <form onSubmit={handleCadastrarAtivo}>
        <div>
          <input
            type="text"
            placeholder="Nome do ativo"
            value={nomeAtivo}
            onChange={(e) => setNomeAtivo(e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Valor"
            value={valorAtivo}
            onChange={(e) => setValorAtivo(e.target.value)}
            step="0.01"
          />
        </div>
        <button type="submit" style={{ marginTop: '0.5rem' }}>Cadastrar Ativo</button>
      </form>
    </div>
  )
}
