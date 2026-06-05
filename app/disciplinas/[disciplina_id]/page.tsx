'use server'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { prisma } from "@/lib/prisma";
import { ChevronRight, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import Form from "next/form"
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormLoading } from "@/components/form-loading";

export default async function DisciplinasPage({ params, searchParams }: PageProps<"/disciplinas/[disciplina_id]">) {

    const { disciplina_id } = await params
    const { id: edit, action } = await searchParams

    if(action == "deletar") {
        await prisma.subject.delete({
            where: {id: String(edit) }
        })

        redirect(`/disciplinas/${disciplina_id}`)
    }


    const data = await prisma.discipline.findFirst({
        where: {
            id: disciplina_id
        },
        orderBy: { createdAt: `asc` },
        include: { subjects: true }
    })

    const inputName = edit ? data?.subjects.find(s => s.id == edit)?.name : ""

    async function handleAction(_data: FormData) {
        'use server'

        const name = _data.get("name")?.toString() ?? ""


        await prisma.subject.upsert({
            where: {
                id: String(edit)
            },
            create: {
                disciplineid: data!.id,
                name
            },
            update: {
                name
            }
        })
        revalidatePath(`/disciplinas/${disciplina_id}`)
        redirect(`/disciplinas/${disciplina_id}`)
    }


    return (<div>
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
                    <BreadcrumbPage>{data?.name}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-4">
            <Dialog open={!!action}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>
                            Editar Aula
                        </DialogTitle>
                    </DialogHeader>
                    <Form action={handleAction} >

                        <Input name="name" defaultValue={inputName} />
                        <DialogFooter className="mt-4">
                            <Button variant={`outline`} asChild>
                                <Link href={`/disciplinas/${disciplina_id}`}>Cancelar</Link>
                            </Button>
                            <Button type="submit" variant={'default'}>
                                <FormLoading />
                                Salvar</Button>
                        </DialogFooter>
                    </Form>
                </DialogContent>
            </Dialog>

            <div>
                <Form action={''} formMethod="GET">
                    <input type="hidden" name="action" value={'adicionar'} />
                    <Button variant={'outline'} type="submit">Cadastrar</Button>
                </Form>
            </div>

            <ItemGroup className="mt-4">
                {data?.subjects.map(item => (
                    <Item variant={'outline'} key={item.id}>
                        <ItemContent>
                            <ItemTitle>
                                <Link href={`/disciplinas/${disciplina_id}/${item.id}`}>
                                    {item.name}
                                </Link>
                            </ItemTitle>
                        </ItemContent>
                        <ItemActions>
                            <Form action={``} formMethod="GET">
                                <input type="hidden" name="action" value={"editar"} />
                                <input type="hidden" name="id" value={item.id} />
                                <Button type="submit" variant={'ghost'} >
                                    <PencilIcon />
                                </Button>
                            </Form>
                            <Form formMethod="GET" action={``}>
                                <input type="hidden" name="action" value={"deletar"} />
                                <input type="hidden" name="id" value={item.id} />
                                <Button variant={'ghost'} type="submit">
                                    <Trash2Icon />
                                </Button>
                            </Form>
                        </ItemActions>
                    </Item>
                ))}
            </ItemGroup>
        </div>
    </div>)
}
