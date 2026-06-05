'use server'
import { FormLoading } from "@/components/form-loading"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia } from "@/components/ui/item"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import Form from "next/form"
import Link from "next/link"

export default async function ({ params, searchParams }: PageProps<"/disciplinas/[disciplina_id]/[aula_id]/[attempt_id]">) {
    const { aula_id, disciplina_id, attempt_id } = await params
    const { q: questaoIndex = '1' } = await searchParams

    const pathname = `/disciplinas/${disciplina_id}/${aula_id}/${attempt_id}?q=${questaoIndex}`

    const total = await prisma.question.count({
        where: { subjectid: aula_id },
    })

    const totalAcertos = await prisma.response.count({
        where: { attemptid: attempt_id, correct: true }
    })

    const totalErros = await prisma.response.count({
        where: { attemptid: attempt_id, correct: false }
    })

    if(total == (totalAcertos + totalErros)) {
        await prisma.attempt.update({
            where: {id: attempt_id},
            data: { done: true}
        })

    }

    const questao = await prisma.question.findFirst({
        orderBy: {
            createdAt: `asc`
        },
        where: { subjectid: aula_id },
        take: 1,
        skip: Math.max(0, parseInt(String(questaoIndex)) - 1),
        include: { options: true, subject: {include: { discipline: true}}, responses: {orderBy: {createdAt: `desc`}} }
    })

    const hasResponse = questao?.responses.find(r => r.attemptid == attempt_id)

    async function handleResponse(input: FormData) {
        'use server'

        const optionIndex = input.get("option")?.toString()

        if (!questao) return;

        const option = questao.options.find(o => o.index == optionIndex)

        if (!option) return;

        await prisma.response.create({
            data: {
                questionid: option.questionid,
                optionid: option.id,
                optionIndex: option.index,
                userid: `cmpzodoyf0000w8gnhd5l76kq`,
                attemptid: attempt_id,
                correct: optionIndex == questao.option_correct
            }
        })

        revalidatePath(pathname)

    }

    return <div className="flex flex-col gap-4">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        <BreadcrumbLink asChild>
                            <Link href={`/disciplinas`}>Disciplinas</Link>
                        </BreadcrumbLink>
                    </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={`/disciplinas/${questao?.subject.disciplineid}`}>{questao?.subject?.discipline.name}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={`/disciplinas/${questao?.subject.disciplineid}/${questao?.subject.id}`}>{questao?.subject?.name}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <Form action={handleResponse}>

            <Card key={questao?.id}>
                <CardContent className="border-b flex gap-4">
                    <div className="flex gap-1 mb-4">
                        {questao?.responses.filter((_,i) => i < 10).reverse().map(r => (
                            <Badge key={r.id} className={cn({ "bg-green-500": r.correct, "bg-red-500": !r.correct, "h-4.5": true, })}></Badge>
                        ))}
                        {Array(10 - Math.min(10, questao!.responses.length)).fill("").map((_,i) => (
                            <Badge key={i} className="h-4.5 bg-gray-100"></Badge>
                        ))}
                    </div>
                    <div className="ml-auto">
                        <Badge variant={`ghost`}>
                            Acertos: {totalAcertos}
                        </Badge>
                        <Badge variant={`ghost`}>
                            Erros: {totalErros}
                        </Badge>
                        <Badge variant={`ghost`}>
                            Resultado: {(totalAcertos/(totalErros+totalAcertos)).toLocaleString(`pt-BR`, {style: `percent`})}
                        </Badge>
                    </div>
                </CardContent>
                <CardContent>
                    {questao?.statement}
                </CardContent>
                <CardContent>
                    <ItemGroup>
                        {questao?.options.map(o => (
                            <label key={o.id} htmlFor={o.id}>
                                <Item variant={'outline'} className="has-checked:bg-gray-200">

                                    <ItemMedia>
                                        <Avatar>
                                            <AvatarFallback className={cn({
                                                "bg-red-50 text-red-700": hasResponse && !hasResponse.correct && hasResponse.optionIndex == o.index,
                                                "bg-green-50 text-green-700": hasResponse && questao.option_correct == o.index,
                                            }
                                            )}>{o.index}</AvatarFallback>
                                        </Avatar>
                                    </ItemMedia>
                                    <ItemContent>
                                        {!hasResponse && (
                                            <input className="hidden" type="radio" name="option" value={o.index} id={o.id} />
                                        )}
                                        <ItemDescription>{o.text}</ItemDescription>
                                    </ItemContent>
                                </Item>
                            </label>
                        ))}
                    </ItemGroup>
                </CardContent>
                <CardFooter>
                    <div className="flex items-center gap-4">

                        <Button disabled={!!hasResponse} type="submit" variant={'default'}>
                            <FormLoading />
                            Responder</Button>
                        {hasResponse && (
                            <span className={cn({ "text-red-500": !hasResponse.correct, "text-green-500": hasResponse.correct }, "font-bold")} >{hasResponse.correct ? "Você acertou!!!" : "Você errou!!!"}</span>
                        )}


                    </div>

                    <div className="ml-auto flex gap-2">
                        <Button asChild variant={'outline'}>
                            <Link href={`?q=${Math.max(parseInt(String(questaoIndex)) - 1, 1)}`}>
                                Anterior
                            </Link>
                        </Button>
                        <Button variant={`secondary`} asChild>
                            <Link href={`${pathname}&showList=true`}>

                                <span>{questaoIndex}/{total}</span>
                            </Link>
                        </Button>
                        <Button asChild variant={'outline'}>
                            <Link href={`?q=${Math.min(total, parseInt(String(questaoIndex)) + 1)}`}>
                                Próxima
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </Form>

    </div>
} 