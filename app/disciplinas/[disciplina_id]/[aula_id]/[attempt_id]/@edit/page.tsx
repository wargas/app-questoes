'use server'
import { FormLoading } from "@/components/form-loading";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Form from "next/form";
import { redirect } from "next/navigation";

export default async function EditQuestion(props: PageProps<"/disciplinas/[disciplina_id]/[aula_id]/[attempt_id]">) {
    const { q, edit } = await props.searchParams
    const { aula_id, disciplina_id, attempt_id } = await props.params

    const pathname = `/disciplinas/${disciplina_id}/${aula_id}/${attempt_id}?q=${q}`


    const question = await prisma.question.findFirst({
        skip: parseInt(String(q))-1,
        orderBy: { createdAt: `asc` },
        include: { options: {orderBy: {index:'asc'}} }
    })


    async function handleSave(input: FormData) {
        'use server'
        if (!question) return;
        await prisma.question.update({
            where: { id: question.id },
            data: { statement: input.get("statement")?.toString() }
        })

        const inputOptions = [...input.keys()].filter(i => i.startsWith("option:")).map(i => i.replace('option:',''))
        
        for await (const input_id of inputOptions) {
            console.log({input_id, inputOptions}, input.get(`option:${input_id}`))
            await prisma.option.update({
                where: { id: input_id},
                data: {
                    text: input.get(`option:${input_id}`)?.toString()
                }
            })
        }

        revalidatePath(pathname)
        redirect(pathname)
    }

    return <Drawer open={!!edit} direction="right">
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Editar questão</DrawerTitle>
            </DrawerHeader>
            <div className="no-scrollbar overflow-y-auto px-4 flex flex-col gap-4">

                <Field>
                    <FieldLabel>Enunciado</FieldLabel>
                    <Textarea form="form2" name="statement" defaultValue={question?.statement} />
                </Field>
                {question?.options.map(o => (
                    <Field key={o.id}>
                        <FieldLabel>Opção {o.index}</FieldLabel>
                        <Textarea form="form2" defaultValue={o.text} name={`option:${o.id}`} />
                    </Field>
                ))}
            </div>
            <DrawerFooter>
                <Form id="form2" action={handleSave} className="flex justify-between">

                    <Button variant={`outline`}>Cancelar</Button>
                    <Button type="submit">
                        <FormLoading />
                        Salvar</Button>
                </Form>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
}