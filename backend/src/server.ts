import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import fastifyCors from '@fastify/cors'

const app = Fastify()
app.register(fastifyCors, {
  origin: '*', // Permitir todas as origens. Ajuste conforme necessário.
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

// Iniciar o servidor
app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Servidor rodando em: ${address}`)
})
