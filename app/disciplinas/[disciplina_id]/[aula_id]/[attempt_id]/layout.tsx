export default async function LayoutAttemps(props: LayoutProps<"/disciplinas/[disciplina_id]/[aula_id]/[attempt_id]">) {

    return <div>
        {props.children}
        {props.list}
        {props.edit}
    </div>
}