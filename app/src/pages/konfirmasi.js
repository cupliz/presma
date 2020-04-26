import axios from 'axios'
import React, { useState, useEffect } from 'react'
// import { useSelector } from 'react-redux'
// import { useHistory, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

const REST_URL = process.env.REACT_APP_REST_URL
export default (props) => {
  // const history = useHistory()
  const [konfirmasi, setKonfirmasi] = useState({})
  const [status, setStatus] = useState({})
  const [sertifikatHtml, setSertifikat] = useState(null)
  useEffect(() => { }, [])
  const onChangeKonfirmasi = (e) => {
    if (e.target.files) {
      konfirmasi[e.target.name] = e.target.files[0]
    } else {
      konfirmasi[e.target.name] = e.target.value
    }
    setKonfirmasi(Object.assign({}, konfirmasi))
  }
  const onKonfirmasi = async (e) => {
    e.preventDefault()
    const { kode, bukti } = konfirmasi
    const formData = new FormData();
    formData.append('file', bukti)
    formData.append('kode', kode)
    const config = { headers: { 'content-type': 'multipart/form-data' } }
    const { status } = await axios.post(`${REST_URL}/konfirmasi`, formData, config)
    if (status === 200) {
      const message = <div>Kami akan lakukan verifikasi pembayaran anda. Terima kasih.</div>
      toast.success(message, {
        onClose: () => setKonfirmasi({})
      })
    }
  }
  const onCekStatus = (e) => {
    e.preventDefault()
    const { code } = e.target
    console.log('onCekStatus')
    setStatus({ code, biodata: true, pembayaran: false })
  }
  const verifikasi = (status) => {
    console.log(status)
    return <span className={`text-${status ? 'success' : 'danger'}`}>{status ? 'OK' : 'GAGAL'}</span>
  }
  const onCekSertifikat = async (e) => {
    e.preventDefault(e)
    try {
      const { kodeSertifikat, kodePelaut } = e.target
      let params = { "sentdata[0][basepath]": "/", "sentdata[0][captcha]": "" }
      if (kodePelaut.value) {
        params["sentdata[0][stringtofind]"] = kodePelaut.value
        params["sentdata[0][searchmode]"] = "1"
      }
      if (kodeSertifikat.value) {
        params["sentdata[0][stringtofind]"] = kodeSertifikat.value
        params["sentdata[0][searchmode]"] = "2"
      }
      const body = Object.keys(params).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      }).join('&')
      const response = await fetch('https://pelaut.dephub.go.id/webapp/finddata', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body
      })
      if (kodeSertifikat) {
        if (response.type !== 'type:opaque') {
          const result = await response.json()
          let html = result.hasile.split('\t')
          const test = html[1].match(new RegExp(/src='.*.g'/))
          const test1 = test[0].split('/').slice(-1).pop().replace("'", '')
          const test2 = html[1].replace(/src='.*'/, `src='https://pelaut.dephub.go.id/asset/images/${test1}'/`)
          html[1] = test2 + `</div><div class='col-lg-8'>`
          setSertifikat(html.join('\t'))
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Container>
      <Row>
        <Col xs={12} md={6}>
          <br />
          <Card>
            <Card.Header className="bg-warning"> Konfirmasi pembayaran </Card.Header>
            <Card.Body>
              <Form name="konfirmasi" onSubmit={onKonfirmasi}>
                <Form.Group as={Row}>
                  <Form.Label column='sm' sm='4'>Kode Pendaftaran<span className='text-danger'>*</span></Form.Label>
                  <Col sm='8'><Form.Control size='sm' type='text' name='kode' placeholder='kode pendaftaran'
                    onChange={onChangeKonfirmasi} value={konfirmasi.kode || ''} required /></Col>
                </Form.Group>
                <Form.Group>
                  <Form.File type="file" name="bukti" onChange={onChangeKonfirmasi} custom
                    label={konfirmasi.bukti ? konfirmasi.bukti.name : 'Upload bukti pembayaran'} />
                </Form.Group>
                <Button type="submit">Kirimkan</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <br />
          <Card>
            <Card.Header className="bg-warning"> Cek status peserta </Card.Header>
            <Card.Body>
              <Form name="konfirmasi" onSubmit={onCekStatus}>
                <Form.Group as={Row}>
                  <Form.Label column='sm' sm='4'>Kode Daftar<span className='text-danger'>*</span></Form.Label>
                  <Col sm='8'><Form.Control size='sm' type='text' name='code' placeholder='kode pendaftaran' required /></Col>
                </Form.Group>
                <Button type="submit">Cari</Button>
              </Form>
              <br />
              {status && status.code && <div>
                <li>Verifikasi Biodata: {verifikasi(status.biodata || false)} </li>
                <li>Verifikasi Pembayaran: {verifikasi(status.pembayaran || false)} </li>
              </div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12}>
          <br />
          <Card>
            <Card.Header className="bg-warning">Verifikasi Pelaut & Sertifikat</Card.Header>
            <Card.Body>
              <Form name="konfirmasi" onSubmit={onCekSertifikat}>
                <Form.Group as={Row}>
                  <Form.Label column='sm' sm='4'>Kode Sertifikat<span className='text-danger'>*</span></Form.Label>
                  <Col sm='6'><Form.Control size='sm' type='text' name='kodeSertifikat' placeholder='kode sertifikat' /* defaultValue="6200597510012420" */ /></Col>
                </Form.Group>
                <Form.Group as={Row}>
                  <Form.Label column='sm' sm='4'>Kode Pelaut<span className='text-danger'>*</span></Form.Label>
                  <Col sm='6'><Form.Control size='sm' type='text' name='kodePelaut' placeholder='kode pelaut' /* defaultValue="6200597510" */ /></Col>
                </Form.Group>
                <Button type="submit">Cari</Button>
              </Form>
              <br />
              {sertifikatHtml && <div dangerouslySetInnerHTML={{ __html: (sertifikatHtml || '') }}></div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container >
  )
}
