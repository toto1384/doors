import { useRouter } from "next/router";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { X, Expand } from 'lucide-react'
import { useDebouncedCallback } from "use-debounce";

import StickyBox from "react-sticky-box";
import { TranslatableObject, UntranslatableObject } from "@/utils/nomenclators";
import { FormInputError } from "./formInputError";
import { useSize } from "@/utils/hooks/useSize";
import { useKeyboardSelector } from "@/utils/hooks/useKeyboardSelector";
import { getNameOfSelectItem } from "@/utils/selectorsHelper";
import { DropDownOrBottomSheetAlt } from "./dropdownOrBottomSheet";



export const paddingTextField = { x: "px-3", y: 'py-2.5', ysm: "py-2" }

export const maxWFields = '' // 'max-w-sm'


function getFullNameOfSelectedItem(item: UntranslatableObject | TranslatableObject | undefined,) {
    if (!item) return ''
    if ('name' in item) return item.name
    return `${item.nameEn} ${item.nameRo}`
}

function newList<T>(list: T[], newItem: T, selected: boolean) {
    console.log(selected);
    return selected ? [...list, newItem] : list.filter((i) => i !== newItem);
}

export type SearchSelectorProps<T> = MainProps<T> & (MultiProps<T> | UniProps<T>)

export type MainProps<T> = {
    id: string;
    error?: string;
    hintInside?: boolean;
    hint: string;
    small?: boolean;
    "data-cy"?: string;
    className?: string;
    render: (item: T) => TranslatableObject | UntranslatableObject;
    renderTrailing?: (item: T) => ReactNode
    optionalIsSelected?: (sel: T) => boolean;
    showSelected?: boolean;
    textFieldRef?: any;
    icon?: any;
    iconClassname?: string;
    topWidget?: ReactNode | ((s: (open: boolean) => void) => ReactNode);
    roundedFull?: boolean
    lastItem?: { element: ((highlighted: boolean, searchTerm: string, onSelect: (open: boolean) => void) => ReactNode), onClick: (searchTerm: string) => void }
    emptyText?: string
    disableScrollToSee?: boolean
    textColor?: string
    scrollLess?: boolean
}

export type MultiProps<T> = {
    type: 'dynamic';
    queryFunction: (keyword: string) => Promise<Array<T>>;
    selected: T[];
    hideInitial?: boolean;
    onSelect: (items: T[]) => void;
    clear: () => void;
}
    | {
        type: 'static';
        items: T[] | readonly T[];
        selected: T[];
        onSelect: (items: T[]) => void;
        clear: () => void;
    }

export type UniProps<T> = {
    type: 'uni-static';
    items: T[] | readonly T[];
    selected: T | undefined;
    onSelect: (items: T | undefined | null) => void;
    hideClear?: boolean;
}
    | {
        type: 'uni-dynamic';
        queryFunction: (keyword: string) => Promise<Array<T>>;
        hideInitial?: boolean;
        selected: T | undefined;
        onSelect: (items: T | undefined | null) => void;
        hideClear?: boolean;
    }

export function scrollToOffset(offset?: number, scrollLess?: boolean) {
    console.log('offset', offset)
    if (offset) {
        const top = offset - (scrollLess ? 600 : 300)
        window.scrollTo({ top: top > 0 ? top : 0, behavior: 'smooth' });
    }
}

const isIOS = (function() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    return isIOS;
});

export const refToOffset = (ref: any) => {
    const offset = isIOS() ? ref.current?.scrollTop : ref.current.offsetTop

    return offset
}

export function SearchSelector<T>(props: SearchSelectorProps<T>) {
    const uni = props.type === 'uni-dynamic' || props.type === 'uni-static';
    const dynamic = props.type === 'dynamic' || props.type === 'uni-dynamic';

    const router = useRouter();
    const languageObject = {} //getLanguageObject();
    const [stateItems, setItems] = useState<T[] | readonly T[]>(dynamic ? [] : props.items);
    const [keyword, setKeyword] = useState('');

    const size = useSize(true)

    const items = dynamic ? stateItems : props.items

    const showSelected = props.showSelected ?? uni

    const includes = (i: T) => uni ?
        (props.optionalIsSelected ? props.optionalIsSelected(i) : i === props.selected) :
        (props.optionalIsSelected ? props.optionalIsSelected(i) : props.selected?.includes(i))

    // if uni return everything, if not filter to not contain selected and non search terms
    const filteredItems = items.filter((i) => showSelected ? true : !includes(i)).filter((i) => dynamic ? true : getFullNameOfSelectedItem(props.render(i))?.toLowerCase().includes(keyword.toLowerCase()));

    const { index, onKeyDown, childId, parentId, resetSelector } =
        useKeyboardSelector((i) => {
            if (i === -1) return
            if (i === filteredItems.length && props.lastItem) {
                //last item has been selected
                props.lastItem.onClick(keyword)
                setOpen(false)
                select()
            }
            if (uni) {
                props.onSelect(filteredItems[i]);
                setOpen(false);
                select();
            } else
                props.onSelect(newList(props.selected, filteredItems[i]!, !includes(filteredItems[i]!)));
        }, filteredItems.length);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) {
            const doc: any = document.getElementById(props.id);
            if (doc) doc.value = '';
            setKeyword('')
        }
    }, [open]);

    const debounced = useDebouncedCallback(async (value) => {
        if (dynamic) setItems(await props.queryFunction(value));
    }, 300);

    const initial = (
        <div className="w-max flex justify-center mt-5 p-2 text-gray-600">
            {'dpl'/* languageObject.globalStrings.dynamicPlaceholder*/}
        </div>
    );

    const onFocusChange = (b: boolean, focus?: boolean) => {
        if (b && !props.disableScrollToSee) {
            scrollToOffset(size.llg ? window.scrollY : refToOffset(inputRef), props.scrollLess)
        }
        resetSelector();
        setFocused(b)
        if (open != b) {
            if (size.llg) {
                if (b) setOpen(b)
            } else setOpen(b);

        }
        if (focus) b ? inputRef.current?.focus() : inputRef.current?.blur()
        // unselect if uni
        /* if (uni && b) props.onSelect(undefined); */
    };

    function select() {
        const doc: any = document.getElementById(props.id);
        if (doc) {
            doc.blur();
            doc.value = '';
        }
        setKeyword('')
        resetSelector();
    }

    const inputRef = useRef<HTMLInputElement>(null);

    const insideInputref = useRef<HTMLInputElement>(null)

    const [focused, setFocused] = useState(false)

    const inputClassName = `outline-none bg-transparent ${props.textColor} ` + (!(uni && props.selected != undefined) ? '' : '') + ((uni && !focused && props.selected) ? 'w-0' : '')


    return (
        <DropDownOrBottomSheetAlt
            topBs className={props.className} dataCy={props['data-cy']}
            additionalMobileHeader={<>
                <div
                    className={`flex flex-row justify-between items-center ${props.roundedFull ? 'rounded-full' : 'rounded'} border border-gray-300 ${maxWFields} ${paddingTextField.x} ${paddingTextField.ysm}`}
                    // onMouseDown={(e) => { e.preventDefault(); onFocusChange(!focused, true) }}
                    ref={props.textFieldRef}
                >
                    <div
                        className={`flex flex-wrap my-0.5 w-full cursor-text`}
                    // onClick={(e) => { e.preventDefault()  /*if (focused) inputRef.current?.focus()*/ }}
                    >
                        {uni ? ((props.selected && !focused) && <div className='self-center thirty-chars flex flex-row w-fit items-center space-x-2 min-w-[150px]'>
                            {props.icon && React.createElement(props.icon, { className: `w-5 h-5 ` })}
                            {getNameOfSelectItem(props.render(props.selected), router)}
                        </div>
                        ) : getSelectedWrap(router, props.selected, props.render, (item) => { props.onSelect(newList(props.selected, item, false)) })}
                        <input
                            ref={insideInputref}
                            className={
                                `outline-none bg-transparent ${props.textColor} ` +
                                (!(uni && props.selected != undefined) ? '' : '') +
                                ((uni && !focused && props.selected) ? 'w-0' : '')
                            }
                            // onBlur={() => onFocusChange(false)}
                            data-cy={props['data-cy']}
                            data-open={`${open}`}
                            // onClick={() => {
                            //     if (size.llg) setOpen(!open)
                            // }}
                            onKeyDown={(e: any) => {
                                if (e.key == 'Backspace' && e.target.value === '' && !uni) {
                                    console.log('backspace');
                                    props.onSelect(props.selected.slice(0, props.selected.length - 1));
                                }
                                onKeyDown(e);
                            }}
                            id={props.id}
                            placeholder={props.hintInside ? ((focused || !props.selected || !uni) ? props.hint : '') : undefined}
                            autoComplete="off"
                            onChange={async (e) => {
                                const t = e.target.value;
                                // if (!open) setOpen(t != '');
                                setKeyword(t);
                                if (dynamic) {
                                    await debounced(t);
                                }
                            }}
                        />
                    </div>

                    {(uni && props.selected && !focused && !props.hideClear) ? <X className='icon-button w-5 h-5' onMouseDown={(e) => { props.onSelect(null); e.stopPropagation() }} /> : <Expand className='icon-button w-5 h-5' />}
                </div>
            </>}
            customOnCloseButton={() => { setOpen(!open); inputRef.current?.blur() }} closeButton={true} setOpen={setOpen}
            id={parentId} open={open} disableShowOnClick disableHideOnTap onMouseDownAlternative dropdownClassName="w-full" dropdown={
                <div className={`flex flex-col`} data-cy={`${props['data-cy']}-secondary`}>
                    {!props.hintInside && props.hint && <p className='text-gray-500'>{props.hint}</p>}
                    <div
                        className={`flex flex-row justify-between items-center ${props.roundedFull ? 'rounded-full' : 'rounded'} border border-gray-300 ${maxWFields} ${paddingTextField.x} ${paddingTextField.ysm}`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            if (size.llg) {
                                setOpen(true)
                                setTimeout(() => {
                                    insideInputref.current?.focus()
                                }, 500);
                            } else {
                                onFocusChange(!focused, true)
                            }
                        }}
                        ref={props.textFieldRef}
                    >
                        <div
                            className={`flex flex-wrap my-0.5 w-full cursor-text`}
                        // onClick={(e) => { e.preventDefault()  /*if (focused) inputRef.current?.focus()*/ }}
                        >
                            {uni ? ((props.selected && !focused) && <div className='self-center thirty-chars flex flex-row w-fit items-center space-x-2 min-w-[150px]'>
                                {props.icon && React.createElement(props.icon, { className: `w-5 h-5 ` })}
                                {getNameOfSelectItem(props.render(props.selected), router)}
                            </div>
                            ) : getSelectedWrap(router, props.selected, props.render, (item) => { props.onSelect(newList(props.selected, item, false)) })}

                            {size.llg ? <div className={`${inputClassName} text-gray-400`}>{props.hintInside ? ((focused || !props.selected || !uni) ? props.hint : '') : undefined}</div> :
                                <input
                                    ref={inputRef}
                                    className={inputClassName}
                                    onBlur={() => onFocusChange(false)}
                                    data-cy={props['data-cy']}
                                    data-open={`${open}`}
                                    onClick={() => {
                                        // if (size.llg) setOpen(!open)
                                    }}
                                    onKeyDown={(e: any) => {
                                        if (e.key == 'Backspace' && e.target.value === '' && !uni) {
                                            console.log('backspace');
                                            props.onSelect(props.selected.slice(0, props.selected.length - 1));
                                        }
                                        onKeyDown(e);
                                    }}
                                    id={props.id}
                                    placeholder={props.hintInside ? ((focused || !props.selected || !uni) ? props.hint : '') : undefined}
                                    autoComplete="off"
                                    onChange={async (e) => {
                                        const t = e.target.value;
                                        if (!open) setOpen(t != '');
                                        setKeyword(t);
                                        if (dynamic) {
                                            await debounced(t);
                                        }
                                    }}
                                />
                            }
                        </div>

                        {(uni && props.selected && !focused && !props.hideClear) ? <X className='icon-button w-5 h-5' onMouseDown={(e) => { props.onSelect(null); e.stopPropagation() }} /> : <Expand className='icon-button w-5 h-5' />}
                    </div>
                    <FormInputError error={props.error} />
                </div>
            }
            disableBackDrop
            preventUnfocus
        >
            {/* {size.llg && <StickyBox className={`flex flex-col bg-white`}>
                {!props.hintInside && props.hint && <p className='text-gray-500 text-sm'>{props.hint}</p>}
                <div
                    className={`flex flex-row justify-between items-center ${props.roundedFull ? 'rounded-full' : 'rounded'} border border-gray-300 ${maxWFields} ${paddingTextField.x} `}
                    ref={props.textFieldRef}
                >
                    <div className={`flex flex-row overflow-scroll w-full cursor-text`} >
                        {uni ? ((props.selected && !focused) && <div className='self-center thirty-chars flex flex-row w-fit items-center space-x-2 min-w-[150px]'>
                            {props.icon && React.createElement(props.icon, { className: `w-5 h-5 ` })}
                            {getNameOfSelectItem(props.render(props.selected), router)}
                        </div>
                        ) : getSelectedWrap(router, props.selected, props.render, (item) => { props.onSelect(newList(props.selected, item, false)) })}
                        {keyword}
                        <div className="w-[1.2px] motion-safe:animate-pulse min-h-[16px] h-full bg-gray-700 my-2"></div>
                    </div>

                    {(uni && props.selected && !focused && !props.hideClear) ? <MdClose className='icon-button w-5 h-5' /> : <MdExpandMore className='icon-button w-5 h-5' />}
                </div>
                <FormInputError error={props.error} />
            </StickyBox>} */}


            {props.topWidget && <div className='pt-2'>
                {(props.topWidget instanceof Function) ? props.topWidget((b) => { b ? inputRef.current?.focus() : inputRef.current?.blur() }) : props.topWidget}
                <hr className='my-2' />
            </div>}
            {(filteredItems.length === 0 && keyword !== '' && !props.lastItem) && <p className='mx-auto text-center mr-7 my-1.5'>
                {props.emptyText ?? 'ept' /*languageObject.globalStrings.noResults*/}
            </p>}
            <div className="p-1">
                {dynamic && items.length === 0 && !(props.hideInitial ?? false) ? (keyword.length < 3 ? initial : <></>) : <>
                    {filteredItems.map((item, ind) => {
                        const renderedItem = props.render(item);
                        return (
                            <div
                                id={childId(ind)}
                                className={'px-3 hoverable-square my-2 py-2 flex flex-row space-x-2 items-center cursor-pointer selector-element' + (index === ind ? ' hovered' : '')}
                                key={renderedItem.id}
                                data-cy={`${props['data-cy']}-${ind}`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (uni) {
                                        select();
                                        if (dynamic) setItems([]);
                                        props.onSelect(item);
                                        setOpen(false);
                                    } else {
                                        props.onSelect(newList(props.selected, item, !includes(item)));
                                        const doc: any = document.getElementById(props.id);
                                        if (doc) doc.value = '';
                                        setKeyword('')
                                        resetSelector()
                                    }
                                }}
                            >
                                <div className="flex max-w-[90%] w-full flex-row space-x-2 items-center">
                                    {props.icon && React.createElement(props.icon, { className: `w-5 h-5 ${props.iconClassname}` })}
                                    <p className='max-w-[90%] fourty-chars'>{getNameOfSelectItem(renderedItem, router)}</p>

                                </div>
                                {props.renderTrailing && props.renderTrailing(item)}
                            </div>
                        );
                    })}
                </>}
                {(props.lastItem && keyword.length > 2) && <>{props.lastItem.element(index === filteredItems.length, keyword, (b) => { setOpen(b); select() })}</>}
            </div>
        </DropDownOrBottomSheetAlt>
    );
}

export function getSelectedWrap<T>(router: any, items: T[], render: (item: T) => TranslatableObject | UntranslatableObject, onDelete: (item: T) => void): ReactNode[] {
    return items
        .filter((i) => i != undefined)
        .map((item, ind) => (
            <div
                key={ind}
                className="flex cursor-pointer bg-[color:var(--pillBgColor)]  m-1 rounded pl-2.5 pr-0.5 py-1 group w-min"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation()
                    onDelete(item);
                }}
            >
                <p className="text-xs select-none text-[color:var(--primary)] fifteen-chars">
                    {getNameOfSelectItem(render(item), router)}
                </p>
                <X className="text-[color:var(--primary)] lg:text-transparent group-hover:text-[color:var(--primary)]" />
            </div>
        ));
}


