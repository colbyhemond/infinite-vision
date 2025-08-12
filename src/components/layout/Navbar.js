'use client'

import Link from "next/link"
import { Menu, Phone } from "react-feather"
import { useState } from "react"
import ScrollProgress from "./ScrollProgress"

const translateShow = '-translate-y-0'
const translateHide = '-translate-y-[120vh]'

const Navbar = ({title}) => {

    const [translate, setTranslate] = useState(translateHide)

    const handleNavToggle = () => {
        if (translate === translateHide) {
        setTranslate(translateShow)
        }

        if (translate === translateShow) {
        setTranslate(translateHide)
        }
    }
    
    

    return (<>
        <div className=" w-[100vw] shadow pointer-events-none fixed top-0 z-50 ">
            <div className="hidden md:flex justify-between items-center p-5 bg-base-100">
                <div className="hidden md:flex md:flex-1">
                    {/* <Link href='/' className="btn btn-ghost text-xl pointer-events-auto"></Link> */}
                    <Link href="/" className="btn btn-ghost text-xl pointer-events-auto">{title}</Link>
                </div>
                <div className="pr-10">
                    <Link href="tel:9899035123" className="btn btn-sm btn-accent pointer-events-auto">
                        <span className="hidden md:inline">Call Us</span>
                        <span className="hidden md:inline"> (989) 903-5123</span>
                    </Link>
                </div>
                <div className="hidden md:flex md:flex-none pointer-events-auto">
                    <ul className="menu menu-horizontal px-1 gap-4">
                        <Link href="/" className="btn btn-ghost pointer-events-auto">Home</Link>
                        <Link href="/services" className="btn btn-ghost pointer-events-auto">Services</Link>
                        <Link href="/projects" className="btn btn-ghost pointer-events-auto">Projects</Link>
                        <Link href="/about" className="btn btn-ghost pointer-events-auto">About</Link>
                        {/* <Link href="/blog" className="btn btn-ghost pointer-events-auto">Blog</Link> */}
                        <Link href="/contact" className="btn btn-ghost pointer-events-auto">Contact</Link>
                    </ul>
                </div>
                
            </div>
            

            <div className=" md:hidden w-full h-full overflow-hidden flex-col top-5 shadow-xl pointer-events-auto h-20">
                <div className="w-full p-5 text-base-content flex justify-between items-center bg-base-100">
                    <div>
                        <Link href='/' onClick={()=>{setTranslate(translateHide)}} className="btn btn-ghost text-xl">{title}</Link>
                    </div>
                    <div className="">
                        <Link href="tel:9899035123" className="btn btn-sm rounded-full w-12 h-12 btn-ghost pointer-events-auto">
                            <Phone />
                        </Link>
                    </div>
                    <div>
                        <div onClick={()=>{handleNavToggle()}}><Menu className='bg-current w-12 h-12 p-2 rounded-full stroke-base-200 cursor-pointer'/></div>
                    </div>
                
                </div>
                
                
            </div>
            {/* <ScrollProgress /> */}
            <div className={`transition-all duration-700 ease-in-out flex flex-col h-screen bg-neutral bg-opacity-95 text-neutral-content text-center gap-5 p-10 sticky top-0 w-full font-bold !z-[999] ${translate} pointer-events-auto overflow-y-scroll`}>
                <Link className="pointer-events-auto text-3xl" href='/' onClick={()=>{setTranslate(translateHide)}}>Home</Link>
                <Link className="pointer-events-auto text-3xl" href='/services' onClick={()=>{setTranslate(translateHide)}}>Services</Link>
                <Link className="pointer-events-auto text-3xl" href='/projects' onClick={()=>{setTranslate(translateHide)}}>Projects</Link>
                <Link className="pointer-events-auto text-3xl" href='/about' onClick={()=>{setTranslate(translateHide)}}>About</Link>
                {/* <Link className="pointer-events-auto text-3xl" href='/blog' onClick={()=>{setTranslate(translateHide)}}>Blog</Link> */}
                <Link className="pointer-events-auto text-3xl" href='/contact' onClick={()=>{setTranslate(translateHide)}}>Contact</Link>
            </div>
            
        </div>
        
    </>)
}

export default Navbar