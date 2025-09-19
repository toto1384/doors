
import { KeyboardEventHandler, useState, useEffect, useCallback } from "react";


const keyboardSelectorId = 'keyboardSelectorIds';

export function useKeyboardSelector(
    onSelect: (selected: number) => any,
    arrayLength: number
): {
    index: number;
    onKeyDown: KeyboardEventHandler<HTMLInputElement>;
    parentId: string;
    childId: (i: number) => string;
    resetSelector: () => void;
} {
    const [selected, setSelected] = useState(-1);

    useEffect(() => {
        if (selected >= arrayLength) setSelected(arrayLength - 1);
    }, [arrayLength]);

    const ensureInView = useCallback(
        (bool: boolean) => {
            const container = document.getElementById(keyboardSelectorId)!;
            const element = document.getElementById(
                `${keyboardSelectorId}-${selected}`
            )!;
            if (!element || !container) {
                return;
            }
            const cTop = container.scrollTop;
            const cBottom = cTop + container.clientHeight;
            const eTop = element.offsetTop;
            const eBottom = eTop + element.clientHeight;

            if (eTop < cTop + 50 || eBottom + 50 > cBottom) {
                console.log('top');
                element.scrollIntoView({
                    block: 'center',
                    inline: 'center'
                });
            }
        },
        [selected]
    );

    return {
        index: selected,
        onKeyDown: (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (selected <= arrayLength) setSelected(selected + 1);
                ensureInView(true);
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (selected >= 0) setSelected(selected - 1);
                ensureInView(false);
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                onSelect(selected);
            }
        },
        childId: (i) => `${keyboardSelectorId}-${i}`,
        parentId: keyboardSelectorId,
        resetSelector: () => setSelected(-1)
    };
}

