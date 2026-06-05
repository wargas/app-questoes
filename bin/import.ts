import { prisma } from "@/lib/prisma"

const text = await Bun.file(`temp/prova1.txt`).text()

const items = text.split("\n----\n")

const gabarito = items.pop()?.split("\n").map(item => {
    const [num, letra] = item.trim().split(/\s+/)

    return { num: parseInt(num), letra }

}) ?? []

const questoes = items.map((questao, i) => {

    let [enunciado, ...options] = questao.split("\n---").map(p => p.trim())

    return {
        enunciado: enunciado,
        options,
        gabarito: gabarito[i].letra
    }
})

if(gabarito.length != questoes.length) {
    console.error("Numero de questoes diferente do numero de gabarito")
}

for await(var questao of questoes) {
    await prisma.question.create({
        data: {
            statement: questao.enunciado,
            option_correct: questao.gabarito,
            subjectid: 'cmpzwnoag0003evgnp3awxyma',
            options: {
                create: questao.options.map((o, i) => {

                    const letras = ["A", "B", "C", "D", "E"]

                    return {
                        text: o,
                        index: letras[i]
                    }
                })
            }
        }
    })

    console.log(`Questao ${questoes.indexOf(questao)+1}`)
}

export {}