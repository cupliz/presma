import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import './App.scss'
import NotFound from 'pages/404'
import Header from 'components/header'
import Home from 'pages/home'
import Biodata from 'pages/biodata'
import Pembayaran from 'pages/pembayaran'
import Konfirmasi from 'pages/konfirmasi'
import Login from 'pages/login'
import Admin from 'admin/pendaftaran'
import Pelatihan from 'admin/pelatihan'
import Jadwal from 'admin/jadwal'

const AppRoute = ({ component: Component, ...rest }) => {
  return <Route
    {...rest} render={props => (
      <div>
        <Header />
        <Component {...props} />
      </div>
    )}
  />
}

const AdminRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector(state => state.auth)
  if (auth) {
    return <AppRoute {...rest} component={Component} />
  } else {
    return <Route {...rest} render={props => <Redirect to={{ pathname: '/login', from: props.location }} />} />
  }
}

class AuthRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <ToastContainer />
        <Switch>
          <AppRoute exact path='/' component={Home} />
          <AppRoute path='/biodata' component={Biodata} />
          <AppRoute path='/pembayaran' component={Pembayaran} />
          <AppRoute path='/konfirmasi' component={Konfirmasi} />
          <Route path='/login' component={Login} />

          <AdminRoute path='/admin/pelatihan' component={Pelatihan} />
          <AdminRoute path='/admin/jadwal' component={Jadwal} />
          <AdminRoute exact path='/admin' component={Admin} />
          <Route path='/404' component={NotFound} />
          <Route render={() => <Redirect to='/404' />} />
        </Switch>
      </BrowserRouter>
    )
  }
}
export default AuthRouter
