import React, { useEffect } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Card } from 'react-bootstrap'

export default (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  useEffect(() => {
    if (auth && auth.user === 'Administrator') {
      history.push('/admin')
    }
  })
  const onSubmit = (e) => {
    e.preventDefault()
    const { username, password } = e.target
    if (username.value === 'admin' && password.value === '1234') {
      dispatch({ type: 'LOGIN', data: { user: 'Administrator' } })
      history.push('/admin')
    }
  }
  return (
    <Container className='mt-4 full-height'>
      <Card className='col-6'>
        <Card.Body>
          <form onSubmit={onSubmit} method='post' className='py-4'>
            <h3 className='text-center'>Login</h3>
            <label className='grey-text font-weight-light'>Username</label>
            <input type='text' name='username' className='form-control' required />
            <br />
            <label className='grey-text font-weight-light'>Password</label>
            <input type='password' name='password' className='form-control' required />
            <br/>
            {/* demo: admin/1234 */}
            <div className='mt-4 mb-5'>
              <Link to='/' className='btn btn-secondary float-left'>Pendaftaran<i className='fa fa-paper-plane-o ml-2' /></Link>
              <button className='btn btn-primary float-right' type='submit'>Login<i className='fa fa-paper-plane-o ml-2' /></button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  )
}
