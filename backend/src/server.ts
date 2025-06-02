import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import fastifyCors from '@fastify/cors'

const app = Fastify()
app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir todas as origens
})
const prisma = new PrismaClient()

// Rota de teste
app.get('/ping', async () => {
  return { message: 'Servidor está funcionando!' }
})

// Rota: listar todos os clientes
app.get('/clientes', async () => {
  const clientes = await prisma.cliente.findMany()
  return clientes
})

// Rota: criar novo cliente
app.post('/clientes', async (request, reply) => {
  const schema = z.object({
    nome: z.string(),
    email: z.string().email(),
    status: z.boolean(),
  })

  const data = schema.parse(request.body)

  const cliente = await prisma.cliente.create({
    data,
  })

  return reply.status(201).send(cliente)
})

// Rota: editar cliente existente
app.put('/clientes/:id', async (request, reply) => {
  const schemaParams = z.object({
    id: z.string(),
  })

  const schemaBody = z.object({
    nome: z.string(),
    email: z.string().email(),
    status: z.boolean(),
  })

  const { id } = schemaParams.parse(request.params)
  const data = schemaBody.parse(request.body)

  const clienteAtualizado = await prisma.cliente.update({
    where: { id: Number(id) },
    data,
  })

  return reply.send(clienteAtualizado)
})

// Rota: listar todos os ativos
app.get('/ativos', async () => {
  const ativos = await prisma.ativo.findMany()
  return ativos
})

// Rota: criar novo ativo
app.post('/ativos', async (request, reply) => {
  const schema = z.object({
    nome: z.string(),
    valor: z.number().min(0),  // valor do ativo não pode ser negativo
    clienteId: z.number(),
  })

  const data = schema.parse(request.body)

  const ativo = await prisma.ativo.create({
    data,
  })

  return reply.status(201).send(ativo)
})

// Rota: listar ativos de um cliente específico
app.get('/clientes/:id/ativos', async (request, reply) => {
  const schemaParams = z.object({
    id: z.string(),
  })
  const { id } = schemaParams.parse(request.params)

  const clienteAtivos = await prisma.ativo.findMany({
    where: {
      clienteId: Number(id),
    },
  })

  return reply.send(clienteAtivos)
})

// Rota: criar novo ativo para um cliente específico
app.post('/clientes/:id/ativos', async (request, reply) => {
  const schemaParams = z.object({
    id: z.string(),
  })

  const schemaBody = z.object({
    nome: z.string(),
    valor: z.number().min(0),
  })

  const { id } = schemaParams.parse(request.params)
  const data = schemaBody.parse(request.body)

  const ativo = await prisma.ativo.create({
    data: {
      nome: data.nome,
      valor: data.valor,
      clienteId: Number(id), // Associando o ativo ao cliente com o ID
    },
  })

  return reply.status(201).send(ativo)
})
// Rota: editar ativo existente
app.put('/ativos/:id', async (request, reply) => {
  const schemaParams = z.object({
    id: z.string(),
  })

  const schemaBody = z.object({
    nome: z.string(),
    valor: z.number().min(0),
  })

  const { id } = schemaParams.parse(request.params)
  const data = schemaBody.parse(request.body)

  try {
    const ativoAtualizado = await prisma.ativo.update({
      where: { id: Number(id) },
      data,
    })
    return reply.status(200).send(ativoAtualizado)
  } catch (error) {
    return reply.status(400).send({ message: 'Erro ao editar o ativo' })
  }
})

// Rota: deletar ativo
app.delete('/ativos/:id', async (request, reply) => {
  const schemaParams = z.object({
    id: z.string(),
  })

  const { id } = schemaParams.parse(request.params)

  try {
    await prisma.ativo.delete({
      where: { id: Number(id) },
    })
    return reply.status(200).send({ message: 'Ativo deletado com sucesso!' })
  } catch (error) {
    return reply.status(400).send({ message: 'Erro ao deletar o ativo' })
  }
})


// Rota: deletar cliente
app.delete('/clientes/:id', async (request, reply) => {
  const schemaParams = z.object({
    id: z.string(),
  })
  const { id } = schemaParams.parse(request.params)

  try {
    // Deleta o cliente com o ID especificado
    await prisma.cliente.delete({
      where: { id: Number(id) },
    })

    return reply.status(200).send({ message: 'Cliente deletado com sucesso!' })
  } catch (error) {
    return reply.status(400).send({ message: 'Erro ao deletar o cliente' })
  }
})

// Rota: listar ativos fixos
app.get('/ativos-fixos', async () => {
  const ativosFixos = [
    { id: 1, nome: 'Ação XYZ', valor: 150.5 },
    { id: 2, nome: 'Fundo ABC', valor: 250.01 },
    { id: 3, nome: 'Tesouro Direto', valor: 1200.0 }
  ]

  return ativosFixos
})

// Iniciar o servidor
app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em: ${address}`)
})
