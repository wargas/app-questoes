'use server'
export async function Markdown({text}:{text:string}) {
    return <div dangerouslySetInnerHTML={{__html: Bun.markdown.html(text)}}>

    </div>
}