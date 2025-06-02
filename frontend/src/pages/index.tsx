import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-100 text-center flex flex-col items-center justify-center gap-4">
      {/* Logo da Empresa */}
      <div className="absolute top-4 left-4 flex items-center space-x-4">
        <img
          src="/img/logoanka.png"
          alt="Logo da Empresa"
          className="w-50 h-auto object-contain"
        />
      </div>

      {/* Título da Página */}
      <h1 className="text-4xl font-bold text-blue-600">Bem-vindo ao Sistema de Gestão de Clientes e Ativos</h1>

      {/* Texto explicativo */}
      <p className="text-lg text-gray-700 max-w-4xl mx-auto mt-4 px-6">
        Um escritório de investimentos precisa de uma aplicação para gerenciar
        clientes e visualizar informações básicas de ativos financeiros. A
        aplicação será containerizada com Docker, com uma instância de banco de
        dados para persistir as informações de clientes.
      </p>

      {/* Botões de navegação */}
      <div className="space-y-4 mt-8">
        <Link href="/clientes">
          <Button className="text-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
            Ir para Clientes
          </Button>
        </Link>

        <Link href="/ativos">
          <Button className="text-lg bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg">
            Ir para Ativos
          </Button>
        </Link>
      </div>

      {/* Tecnologias utilizadas */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Tecnologias Utilizadas
        </h2>
        <div className="flex justify-center space-x-6 mt-4">
          <img src="/img/logonext.png" alt="Next.js" className="w-16 h-16" />
          <img
            src="/img/logotypescript.png"
            alt="React"
            className="w-16 h-16"
          />
          <img src="/img/logodocker.png" alt="Docker" className="w-16 h-16" />
          <img src="/img/logodb.png" alt="PostgreSQL" className="w-16 h-16" />
        </div>
      </div>

      <a
        href="https://wa.me/11930981708" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg z-50"
      >
        <img src="/img/wpplogo.png" alt="WhatsApp" className="w-10 h-10" />
      </a>
    </div>
  );
}
