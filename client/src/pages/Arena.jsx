import React from 'react'
import {Swords,Hourglass,Trophy} from "lucide-react"
const Arena = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100' >
        <div className='flex items-center gap-3 mb-4' >
            <Swords className="w-10 h-10 text-green-600 animate-bounce" />
            <Trophy className='w-10 h-10 text-blue-500 animate-spin' />
        </div>
        <h1 className='text-3xl font-extrabold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent animate-[pulse_2s_ease-in-out_infinite]' >
            Coming soon...
        </h1>
    </div>
  )
}

export default Arena