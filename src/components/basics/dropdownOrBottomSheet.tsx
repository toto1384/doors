
import { DropdownPropsAlternative, DropdownProps, isDropdownAlternative } from "@/app/_components/dropdown";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { DropDown } from "./dropdown";
import { BottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'
import { useSize } from "@/utils/hooks/useSize";
import { useDidMount } from "@/utils/hooks/useDidMount";

//dropdown on desktop, bototm sheet on mobile
export function DropDownOrBottomSheet(props: DropdownProps | DropdownPropsAlternative) {
    const size = useSize(true)

    const [openState, setOpenState] = useState(false)
    const [toggled, setToggled] = isDropdownAlternative(props) ? [props.open, props.setOpen] : [openState, setOpenState]

    const didMount = useDidMount()
    // useEffect(() => {
    //     if (toggled && didMount) window.scrollTo({ top: 0, behavior: 'smooth' });
    // }, [toggled])

    const onClick = (event: any) => {
        event.stopPropagation();
        // console.log('got andiak')
        if (React.isValidElement(props.dropdown) && !(props.disableShowOnClick ?? false)) setToggled(!toggled)
    }

    if (size.llg) {
        return <div className={`relative overflow-y-hidden ${props.dropdownClassName}`}>
            <div className={`cursor-pointer left-0 `} data-cy={`dropdown-${props.dataCy ?? props.id}`} {...props.onMouseDownAlternative ? { onMouseDown: onClick } : { onClick }}>{(props.dropdown instanceof Function) ? props.dropdown(setToggled) : props.dropdown}</div>

            {toggled && <div className="backdrop fixed inset-0 z-40 overflow-y-hidden h-screen w-screen" {...props.onMouseDownAlternative ? { onMouseDown: onClick } : { onClick }}></div>}
            <div className={`fixed left-0 right-0 transition-all overflow-scroll bg-white mt-20 z-50 ${props.topBs ? 'max-h-[60vh] min-h-[60vh]' : 'max-h-[85vh]'}  rounded-md ${toggled ? "bottom-0 mt-32" : "bottom-[-400vh]"}`}>
                {/* <div className=""></div> */}
                <div className='flex px-3 pt-3 flex-row items-center'>
                    <ArrowLeft {...props.onMouseDownAlternative ? { onMouseDown: onClick } : { onClick }} className='h-10 w-10 icon-button p-1' />
                </div>
                <div className='px-6 pb-10 h-full'>
                    {(props.children instanceof Function) ? props.children(setToggled) : props.children}
                </div>
            </div>
        </div>
    }

    return <DropDown {...props} />
}


export function DropDownOrBottomSheetAlt(props: (DropdownProps | DropdownPropsAlternative) & { additionalMobileHeader?: ReactNode }) {
    const size = useSize(true)

    const [openState, setOpenState] = useState(false)
    const [toggled, setToggled] = isDropdownAlternative(props) ? [props.open, props.setOpen] : [openState, setOpenState]

    const didMount = useDidMount()
    // useEffect(() => {
    //     if (toggled && didMount) window.scrollTo({ top: 0, behavior: 'smooth' });
    // }, [toggled])

    const onClick = (event: any) => {
        event.stopPropagation();
        // console.log('got andiak')
        setToggled(!toggled)
    }

    const randomRef = useRef(null)

    if (size.llg) {

        return <div className={`relative overflow-y-hidden ${props.dropdownClassName}`}>
            <div className={`cursor-pointer left-0`} data-cy={`dropdown-${props.dataCy ?? props.id}`}>
                {(props.dropdown instanceof Function) ? props.dropdown(setToggled) : props.dropdown}
            </div>
            <BottomSheet
                open={toggled} className="w-full bg-white absolute z-[50]"
                snapPoints={({ minHeight, maxHeight }: any) => maxHeight / 2}
                // defaultSnap={({ maxHeight }) => maxHeight}
                onDismiss={() => setToggled(false)}
                initialFocusRef={randomRef}
                // blocking={false}
                autoFocus={false}
                header={<>
                    <div className='flex px-3 pt-3 flex-row items-center'>
                        <ArrowLeft {...props.onMouseDownAlternative ? { onMouseDown: onClick } : { onClick }} className='h-10 w-10 icon-button p-1' />
                    </div>
                    {props.additionalMobileHeader}
                </>
                }
            >
                <div className='px-6 pb-10 h-full'>
                    {(props.children instanceof Function) ? props.children(setToggled) : props.children}
                </div>
            </BottomSheet>
        </div>


    }

    return <DropDown {...props} />
}

