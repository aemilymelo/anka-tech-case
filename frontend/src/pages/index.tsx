import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Bem-vindo ao sistema de clientes e ativos</h1>
      <Link href="/clientes">Ir para Clientes</Link>
      <br />
      <Link href="/ativos">Ir para Ativos</Link>
    </div>
  )
}
