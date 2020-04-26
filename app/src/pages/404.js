import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = (props) => {
  return (
    <div className='text-center text-white full-height'>
      <div className='notFound'>
        <h1>404 - Not Found</h1>
        <Link to='/' className='btn btn-warning'>Kembali ke halaman utama</Link>
      </div>
    </div>
  )
}
export default NotFound
