import { useState, useEffect } from "react"


export function useDidMount() {
    const [didMount, setDidMount] = useState(false)
    useEffect(() => { setDidMount(true) }, [])

    return didMount
}

