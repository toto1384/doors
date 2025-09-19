
import { ReactNode } from "react"
import { TriangleAlert } from "lucide-react"


export function FormInputError(props: { error?: ReactNode, errors?: any, color?: string, className?: string, dataCy?: string }) {


    return props.error ?
        <div role='alert' data-cy={props.dataCy} className={`${props.color ?? 'text-red-800'} flex flex-row items-center w-fit ${props.className}`}>
            <div className="w-4 h-4 mr-2"> <TriangleAlert /> </div>
            {props.error ? props.error : (props.errors ? (Object.keys(props.errors).length !== 0 ? 'Complete Form' : undefined) : undefined)}
        </div> :
        <></>
}

