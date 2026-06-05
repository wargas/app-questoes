import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default async function (props: PageProps<"/disciplinas/[disciplina_id]/[aula_id]/[attempt_id]">) {

    const { showList = "0", q = "1" } = await props.searchParams
    const { aula_id, attempt_id } = await props.params

    if (showList != "true") return <></>

    const questoes = await prisma.question.findMany({
        where: { subjectid: aula_id },
        orderBy: { createdAt: `asc` },
        include: { responses: { where: { attemptid: attempt_id } } }
    })



    return <Drawer open={true} direction="right">
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Lista de questões</DrawerTitle>
            </DrawerHeader>
            <div className="grid-cols-5 grid p-4 gap-4">
                {questoes.map((q, i) => (
                    <Link className={cn({ "bg-green-100 border-green-500 text-green-500": q.responses.at(0)?.correct, "bg-red-100 border-red-500 text-red-500": q.responses.length > 0 && !q.responses.at(0)?.correct },"flex items-center justify-center border rounded")} key={i} href={`?q=${i + 1}&showList=false`}>
                        {i + 1} 
                    </Link>
                ))}
            </div>
            <DrawerFooter>
                <Button asChild>
                    <Link href={`?q=${q}&showList=false`}>Fechar</Link>
                </Button>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}