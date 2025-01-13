import { RiAlertLine, RiArrowLeftLine } from '@remixicon/react'
import PropTypes from 'prop-types'

export default function Forbidden({ messaje }) {
    return (
        <div className='bg-gray-900 min-h-screen flex justify-center items-center'>
            <div className='flex flex-col justify-center items-center min-h-1/2 bg-gray-800/70 p-10 rounded-lg shadow-lg'>
                <RiAlertLine className='text-orange-500 mb-3' size={100} />
                <h3 className='text-lg mb-3 text-white font-semibold'>{messaje}</h3>
                <button
                    onClick={() => { window.location.href = '/dashboard' }}
                    className='bg-blue-700 hover:bg-blue-600 w-11/12 p-3 rounded my-2 flex items-center justify-center flex-row font-semibold text-white transition-colors duration-300'
                >
                    <RiArrowLeftLine className='mr-2' size={24} /> Dashboard
                </button>
            </div>
        </div>
    )
}

Forbidden.propTypes = {
    messaje: PropTypes.string.isRequired,
}
