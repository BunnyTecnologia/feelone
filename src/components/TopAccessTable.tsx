import React from 'react';
import { Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const accessData = [
  { name: "Michael Knight", state: "Minas Gerais", views: 250 },
  { name: "Jonathan Higgins", state: "Pernambuco", views: 99 },
  { name: "Willie Tanner", state: "Para", views: 75 },
  { name: "Murdock", state: "São Paulo", views: 63 },
  { name: "Theodore T.C. Calvin", state: "Pernambuco", views: 50 },
];

const TopAccessTable = () => {
  return (
    <Card className="shadow-lg border-none rounded-xl bg-white dark:bg-gray-800">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Top acessos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="text-gray-500 dark:text-gray-400 border-b-gray-200 dark:border-b-gray-700">
              <TableHead className="w-[40%] font-semibold">Nome</TableHead>
              <TableHead className="w-[30%] font-semibold">Estados</TableHead>
              <TableHead className="w-[20%] font-semibold">Visualizações</TableHead>
              <TableHead className="w-[10%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessData.map((item, index) => (
              <TableRow key={index} className="text-gray-800 dark:text-gray-200 border-b-gray-100 dark:border-b-gray-700/50">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.state}</TableCell>
                <TableCell>{item.views}</TableCell>
                <TableCell className="text-center">
                  <Eye className="h-5 w-5 text-gray-400 mx-auto cursor-pointer hover:text-gray-600" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopAccessTable;