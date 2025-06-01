import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const app = Fastify()
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

// Iniciar o servidor
app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(` Servidor rodando em: ${address}`)
})
