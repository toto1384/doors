

import React, { ReactNode, useState } from "react"
import { X } from 'lucide-react'


type DropdownPropsMain = {
    axis?: Axis,
    disableBackDrop?: boolean
    disableHideOnTap?: boolean
    disableShowOnClick?: boolean
    preventUnfocus?: boolean
    id?: string
    className?: string
    dropdownClassName?: string
    arrow?: boolean
    closeButton?: boolean
    customOnCloseButton?: (e: any) => void
    fullHeight?: boolean
    dataCy?: string
    zIndex?: string
    lessHtml?: boolean
    onMouseDownAlternative?: boolean
    topBs?: boolean
}

export type DropdownProps = {
    children: React.ReactNode | ((setOpen: (v: boolean) => void) => ReactNode),
    dropdown: React.ReactNode | ((setOpen: (v: boolean) => void) => ReactNode),
} & DropdownPropsMain


export type DropdownPropsAlternative = {
    children: React.ReactNode
    open: boolean
    setOpen(value: boolean): any
    dropdown: React.ReactNode
} & DropdownPropsMain

export type Axis = "right-0 top-0" | "right-0" | "left-0" | "left-0 top-0" | "bottom-0 right-0"

export function isDropdownAlternative(object: any): object is DropdownPropsAlternative {
    return 'setOpen' in object;
}


export function DropDown(props: DropdownProps | DropdownPropsAlternative) {

    const [openState, setOpenState] = useState(false)

    const [open, setOpen] = isDropdownAlternative(props) ? [props.open, props.setOpen] : [openState, setOpenState]

    const axis = props.axis //?? 'right-0'
    const lessHtml = props.lessHtml ?? true

    return (
        <div className={props.className}>
            {((!lessHtml) || open) && (!(props.disableBackDrop ?? false) && <div className={`relative ${!open && 'hidden'}`}>
                <div
                    className="fixed cursor-pointer inset-0 z-40 h-screen w-screen"
                    data-cy={`dropdown-backdrop-${props.dataCy ?? props.id}`}
                    onClick={(event) => { event.stopPropagation(); setOpen(false) }}
                ></div>
            </div>)}


            <div className={`cursor-pointer left-0 ${props.dropdownClassName}`} data-cy={`dropdown-${props.dataCy ?? props.id}`} onClick={(event) => {
                event.stopPropagation();
                // console.log('got andiak')
                if (React.isValidElement(props.dropdown) && !(props.disableShowOnClick ?? false)) setOpen(!open)
            }}>{(props.dropdown instanceof Function) ? props.dropdown(setOpen) : props.dropdown}</div>

            {((!lessHtml) || open) && <div onMouseDown={(e) => { if ((props.preventUnfocus ?? false)) e.preventDefault() }} className={`inset-0 m-0 ${!open && 'hidden'}`}>
                <div onClick={() => { if (!(props.disableHideOnTap ?? false)) setOpen(false) }} className={`w-max min-w-[150px] max-w-xs md:max-w-sm overflow-x-clip ${props.fullHeight ? '' : 'max-h-[400px]'} max-w-xs md:max-w-sm absolute bg-white ${props.zIndex ?? 'z-[48]'} divide-y p-2 divide-gray-100 rounded-lg shadow-xl my-1 ${axis} `} id={props.id ?? 'dropdown'}>
                    {props.closeButton &&
                        <div className={`absolute w-max right-0 top-0 ${props.zIndex ?? 'z-[49]'}`}>
                            <X data-cy={`dropdown-${props.dataCy ?? props.id}-close`} className="icon-button text-[color:var(--primary)] w-14 h-14 p-4" onClick={props.customOnCloseButton ?? (() => setOpen(!open))} />
                        </div>
                    }
                    <div className={`overflow-y-auto max-w-xs md:max-w-sm overflow-x-clip ${props.fullHeight ? '' : 'max-h-[400px]'}`}>
                        {(props.children instanceof Function) ? props.children(setOpen) : props.children}
                    </div>
                </div>
            </div>}

        </div>
    )
}

