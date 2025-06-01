import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

type Ativo = {
  id: number
  nome: string
  valor: number
}

// Schema de validação com Zod
const ativoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  valor: z.coerce.number().positive('Valor deve ser maior que 0'),
})

type AtivoFormData = z.infer<typeof ativoSchema>

export default function AtivosPorClientePage() {
  const router = useRouter()
  const { id } = router.query

  const { data: ativos, isLoading, error, refetch } = useQuery({
    queryKey: ['ativos', id],
    queryFn: async () => {
      const response = await axios.get<Ativo[]>(`http://localhost:3333/clientes/${id}/ativos`)
      return response.data
    },
    enabled: !!id,
  })

  const [editingAtivo, setEditingAtivo] = useState<Ativo | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AtivoFormData>({
    resolver: zodResolver(ativoSchema),
  })

  const onSubmit = async (data: AtivoFormData) => {
    try {
      if (editingAtivo) {
        await axios.put(`http://localhost:3333/ativos/${editingAtivo.id}`, data)
        alert('Ativo atualizado com sucesso!')
      } else {
        await axios.post(`http://localhost:3333/clientes/${id}/ativos`, data)
        alert('Ativo cadastrado com sucesso!')
      }

      reset()
      setEditingAtivo(null)
      refetch()
    } catch (err) {
      alert('Erro ao cadastrar ou editar ativo')
    }
  }

  const handleEdit = (ativo: Ativo) => {
    setValue('nome', ativo.nome)
    setValue('valor', ativo.valor)
    setEditingAtivo(ativo)
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3333/ativos/${id}`)
      alert('Ativo deletado com sucesso!')
      refetch()
    } catch (err) {
      alert('Erro ao deletar ativo')
    }
  }

  if (isLoading) return <p>Carregando ativos...</p>
  if (error) return <p>Erro ao carregar ativos</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ativos do Cliente {id}</h1>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {ativos?.map((ativo) => (
            <tr key={ativo.id}>
              <td>{ativo.id}</td>
              <td>{ativo.nome}</td>
              <td>R$ {ativo.valor.toFixed(2)}</td>
              <td>
                <Button onClick={() => handleEdit(ativo)}>Editar</Button>
                <Button onClick={() => handleDelete(ativo.id)}>Deletar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '2rem' }}>
        {editingAtivo ? 'Editar Ativo' : 'Cadastrar Novo Ativo'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input type="text" placeholder="Nome do ativo" {...register('nome')} />
          {errors.nome && <p style={{ color: 'red' }}>{errors.nome.message}</p>}
        </div>
        <div>
          <Input
            type="number"
            step="0.01"
            placeholder="Valor"
            {...register('valor')}
          />
          {errors.valor && <p style={{ color: 'red' }}>{errors.valor.message}</p>}
        </div>
        <Button type="submit">
          {editingAtivo ? 'Atualizar Ativo' : 'Cadastrar Ativo'}
        </Button>
      </form>
    </div>
  )
}
