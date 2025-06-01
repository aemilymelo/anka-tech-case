import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center gap-4">
      <h1 className="text-4xl font-bold text-blue-600">Bem-vindo ao sistema</h1>

      <Link href="/clientes" className="text-lg text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
        Ir para Clientes
      </Link>

      <Link href="/ativos" className="text-lg text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600">
        Ir para Ativos
      </Link>
    </div>
  )
}
