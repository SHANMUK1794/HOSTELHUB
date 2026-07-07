import React from 'react'

function ToastMessage({ text, success, failed, onClose }) {
  return (
    <div className='fixed inset-0 z-[99999] flex justify-center items-center' style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className='relative w-[90%] md:w-[400px] h-[250px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-center items-center'>
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
         </button>
        {success && (
            <div className='w-full h-full bg-[#E7EEFF] flex flex-col justify-center items-center p-6 text-center'>
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>" alt="Success icon" className="w-20 h-20 mb-6" />
                <h1 className="text-xl font-bold text-[#263765]">{text}</h1>
            </div>
        )}

       {failed && (
            <div className='w-full h-full bg-[#FFE8E8] flex flex-col justify-center items-center p-6 text-center'>
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>" alt="Error icon" className="w-20 h-20 mb-6" />
                <h1 className="text-xl font-bold text-[#E72121]">{text}</h1>
            </div>
       )}
      </div>
    </div>
  )
}

export default ToastMessage