import Link from 'next/link'
 
export default function NotFound() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
        <div className=" mx-auto h-screen flex justify-center items-center flex-col">
        <span className='text-6xl font-extrabold'>404</span> 
          <h1 className="text-xl font-bold  text-center">Not Found</h1>
            <p>Could not find requested resource</p>
            <Link href="/" className='underline'>Return Home</Link>
        </div>
    </main>
  )
}