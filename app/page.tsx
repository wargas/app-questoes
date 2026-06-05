`use server`
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { password } from "bun"

export default async function Home() {

  const acertosHoje = await prisma.response.count({
    where: { correct: true}
  })

  const errosHoje = await prisma.response.count({
    where: { correct: false}
  })

  return (
   <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-4 grid-cols-4 mt-4">
        <Card>
          <CardHeader>
            <CardDescription>Hoje</CardDescription>
            <CardTitle className="text-2xl">{acertosHoje}/{errosHoje+acertosHoje}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Semana</CardDescription>
            <CardTitle className="text-2xl">{acertosHoje}/{errosHoje+acertosHoje}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Mês</CardDescription>
            <CardTitle className="text-2xl">{acertosHoje}/{errosHoje+acertosHoje}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Ano</CardDescription>
            <CardTitle className="text-2xl">{acertosHoje}/{errosHoje+acertosHoje}</CardTitle>
          </CardHeader>
        </Card>
      </div>
   </div>
  );
}
