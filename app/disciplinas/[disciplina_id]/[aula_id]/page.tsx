'use server'
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import Form from "next/form"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ({ params, searchParams }: PageProps<"/disciplinas/[disciplina_id]/[aula_id]">) {
    const { aula_id, disciplina_id } = await params
    const { q: questaoIndex = '1' } = await searchParams

    const pathname = `/disciplinas/${disciplina_id}/${aula_id}?q=${questaoIndex}`

    const total = await prisma.question.count({
        where: { subjectid: aula_id },
    })

    const aula = await prisma.subject.findFirst({
        orderBy: {
            createdAt: `asc`
        },
        where: { id: aula_id },
        include: { attempts: { include: { responses: true } }, discipline: true }
    })

    async function createAttemptAction(input: FormData) {
        'use server'

        const create = await prisma.attempt.create({
            data: {
                subjectid: aula_id,
                done: false
            }
        })

        redirect(`/disciplinas/${disciplina_id}/${aula_id}/${create.id}?q=1`)
    }

    return <div className="flex flex-col gap-4">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={`/disciplinas`}>Disciplinas</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={`/disciplinas/${aula?.disciplineid}`}>{aula?.discipline.name}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                    {aula?.name}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div>
            Questoes: {total}
        </div>

        <ItemGroup>
            {aula?.attempts.map(item => (
                <Item key={item.id} variant={'outline'}>
                    <ItemContent>
                        <ItemTitle>{item.createdAt.toLocaleDateString(`pt-BR`)}</ItemTitle>
                        <ItemDescription>
                            <Badge variant={`outline`}>
                                {item.responses.filter(r => r.correct).length}/
                                {item.responses.filter(r => r.correct).length+item.responses.filter(r => !r.correct).length}
                        {` | `}
                            {(
                                item.responses.filter(r => r.correct).length/
                                (item.responses.filter(r => r.correct).length+item.responses.filter(r => !r.correct).length))
                                .toLocaleString(`pt-BR`, {style: `percent`})}
                            </Badge>
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        {item.done && <Badge variant={`default`}>Concluido</Badge>}
                        <Button variant={`outline`} asChild>
                            <Link href={`/disciplinas/${disciplina_id}/${aula_id}/${item.id}?q=1`}>Responder</Link>
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </ItemGroup>

        <Form action={createAttemptAction}>
            <Button type="submit">Responder</Button>
        </Form>
    </div>
} 