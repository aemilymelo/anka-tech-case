import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";

type Cliente = {
  id: number;
  nome: string;
  email: string;
  status: boolean;
};

export default function ClientesPage() {
  // Buscar dados da API
  const {
    data: clientes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await axios.get<Cliente[]>(
        "http://localhost:3333/clientes"
      );
      return response.data;
    },
  });

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os clientes</p>;

  // Formulário de cadastro de cliente
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3333/clientes", {
        nome,
        email,
        status,
      });
      alert("Cliente cadastrado com sucesso!");
    } catch (error) {
      alert("Erro ao cadastrar cliente");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Lista de Clientes</h1>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
            <th>Ativos</th>
          </tr>
        </thead>
        <tbody>
          {clientes?.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.status ? "Ativo" : "Inativo"}</td>
              <td>
                <Link href={`/ativos-cliente/${cliente.id}`}> Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Cadastrar Novo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Nome do Cliente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <select
            value={status.toString()} // Converte o status para string ("true" ou "false")
            onChange={(e) => setStatus(e.target.value === "true")} // Converte a string de volta para booleano
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
        <button type="submit">Cadastrar Cliente</button>
      </form>
    </div>
  );
}
