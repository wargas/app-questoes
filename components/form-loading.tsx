'use client'

import { useFormStatus } from "react-dom"
import { Fragment } from "react/jsx-runtime"
import { Spinner } from "./ui/spinner"

export function FormLoading() {
    const { pending } = useFormStatus()

    return <Fragment>
        {pending && (
            <Spinner />
        )}
    </Fragment>
}