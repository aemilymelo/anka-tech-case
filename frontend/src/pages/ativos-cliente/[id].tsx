import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

// Definindo o tipo do Ativo
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

  if (isLoading) return <p className="text-center text-gray-500">Carregando ativos...</p>
  if (error) return <p className="text-center text-red-500">Erro ao carregar ativos</p>

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-[#161616] mb-6">Ativos do Cliente {id}</h1>

      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-[#d8d8d5]">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Nome</th>
            <th className="px-4 py-2 text-left">Valor</th>
            <th className="px-4 py-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {ativos?.map((ativo) => (
            <tr key={ativo.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-t">{ativo.id}</td>
              <td className="px-4 py-2 border-t">{ativo.nome}</td>
              <td className="px-4 py-2 border-t">R$ {ativo.valor.toFixed(2)}</td>
              <td className="px-4 py-2 border-t flex space-x-2 justify-start">

                <Button onClick={() => handleEdit(ativo)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">Editar</Button>
                <Button onClick={() => handleDelete(ativo.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Deletar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold text-[#161616] mt-8">{editingAtivo ? 'Editar Ativo' : 'Cadastrar Novo Ativo'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div>
          <Input type="text" placeholder="Nome do ativo" {...register('nome')} className="w-full p-2 border border-[#d8d8d5] rounded-md" />
          {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
        </div>
        <div>
          <Input
            type="number"
            step="0.01"
            placeholder="Valor"
            {...register('valor')}
            className="w-full p-2 border border-[#d8d8d5] rounded-md"
          />
          {errors.valor && <p className="text-red-500">{errors.valor.message}</p>}
        </div>
        <Button type="submit" className="w-full py-3 bg-[#fa4515] hover:bg-[#e03d10] text-white rounded-md">
          {editingAtivo ? 'Atualizar Ativo' : 'Cadastrar Ativo'}
        </Button>
      </form>
    </div>
  )
}
