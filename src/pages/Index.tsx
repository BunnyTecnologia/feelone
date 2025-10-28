import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";

const pages = [
  { name: "Home (Index)", path: "/" },
  { name: "Login", path: "/login" },
  { name: "Cadastro Dados Pessoais", path: "/cadastro/dados-pessoais" },
  { name: "Cadastro Redes Sociais", path: "/cadastro/redes-sociais" },
  { name: "Cadastro Endereço", path: "/cadastro/endereco" },
  { name: "Dados de Saúde", path: "/dados-saude" },
  { name: "Contato de Emergência", path: "/contato-emergencia" },
  { name: "Configurações", path: "/configuracoes" },
  { name: "Minhas Informações", path: "/minhas-informacoes" },
  { name: "Perfil", path: "/perfil" },
  { name: "Landing Page Home (Desktop)", path: "/landing-page" },
  { name: "Dashboard (Desktop)", path: "/dashboard" },
  { name: "Carteirinha de Emergência", path: "/carteirinha-emergencia" },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold mb-4 text-primary dark:text-primary-foreground">
          Bem-vindo ao Feel One
        </h1>
        <p className="text-xl text-muted-foreground">
          Navegue pelas páginas criadas:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full">
        {pages.map((page) => (
          <Link
            key={page.path}
            to={page.path}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-left border border-gray-200 dark:border-gray-700 block"
          >
            <span className="font-semibold text-lg text-primary dark:text-primary-foreground">
              {page.name}
            </span>
            <p className="text-sm text-muted-foreground mt-1">{page.path}</p>
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;