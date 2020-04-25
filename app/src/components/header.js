import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Navbar, Nav } from 'react-bootstrap'

export default () => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }
  return (
    <div>
      <Navbar expand='lg' className='navbar-dark bg-primary'>
        <Container>
          <Link className='navbar-brand' to='/'><img src='/img/logo.png' height='50' alt='' /></Link>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            {auth && auth.user ?
              <Nav className='ml-auto'>
                <Link to='/admin' className='nav-link'>Peserta</Link>
                <Link to='/admin/pelatihan' className='nav-link'>Pelatihan</Link>
                <Link to='/admin/jadwal' className='nav-link'>Jadwal</Link>
                <Link to='#' className='nav-link' onClick={logout}>Logout</Link>
              </Nav>
              :
              <Nav className='ml-auto'>
                <Link to='/konfirmasi' className='nav-link'>Konfirmasi</Link>
                <Link to='/login' className='nav-link'>Login</Link>
              </Nav>
            }

          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='bg-warning py-1'>
        <div className='container text-center'>
          <small>Kami membatalkan beberapa jadwal pelatihan untuk mengantisipasi COVID-19. Kamu tetap bisa mendaftar pelatihan secara online.</small>
        </div>
      </div>
    </div>
  )
}
