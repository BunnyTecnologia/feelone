import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const RescueForm = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">
          Cadastre-se e Resgate a Sua Gratuitamente!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Seus dados são cruciais para o envio. Por favor, preencha todas as informações com atenção para garantir a entrega correta de sua pulseira.
          <br />
          <span className="font-semibold">Limite de 01 pulseira por CPF</span>
        </p>

        <div className="bg-blue-50 dark:bg-blue-950 p-8 rounded-lg shadow-inner border border-blue-200 dark:border-blue-800">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Input placeholder="Nome" className="border-blue-500 focus:border-blue-700" />
              <Input placeholder="Endereço" className="border-blue-500 focus:border-blue-700" />
              <div className="flex space-x-4">
                <Input placeholder="Número" className="border-blue-500 focus:border-blue-700 w-1/2" />
                <Input placeholder="Cidade" className="border-blue-500 focus:border-blue-700 w-1/2" />
              </div>
            </div>
            <div className="space-y-4">
              <Input placeholder="CPF" className="border-blue-500 focus:border-blue-700" />
              <Input placeholder="Cep" className="border-blue-500 focus:border-blue-700" />
              <Input placeholder="Complemento" className="border-blue-500 focus:border-blue-700" />
            </div>
            <div className="md:col-span-2 mt-4">
              <Button type="submit" className="w-full md:w-auto bg-blue-900 hover:bg-blue-800 text-white px-8 py-2">
                Resgatar a minha
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RescueForm;