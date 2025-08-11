'use client'

import { useEffect } from "react"


const ThemeWrapper = ({theme, children}) => {

    useEffect(() => {
        document.querySelector('#theme-wrapper').setAttribute('data-theme', theme)
        const savedTheme = window.localStorage.getItem('theme')
        if (savedTheme) {
            document.querySelector('#theme-wrapper').setAttribute('data-theme', savedTheme)
        }

    }
    , [])

    return (<>
        <div id='theme-wrapper' data-theme={theme} className={`antialiased min-h-screen flex flex-col justify-between w-full`}>
            {children}
        </div>
    </>)
}

export default ThemeWrapper