import axios from 'axios'
import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap'
import { IoMdCheckmark, IoMdClose } from 'react-icons/io'
import { useHistory } from 'react-router'
import { toast } from 'react-toastify'


const REST_URL = process.env.REACT_APP_REST_URL
export default (props) => {
  const history = useHistory()
  const [konfirmasi, setKonfirmasi] = useState({})
  const [statusPembayaran, setStatusPembayaran] = useState([])
  const [sertifikatHtml, setSertifikat] = useState(null)

  // konfirmasi funtions
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
    const res = await axios.post(`${REST_URL}/konfirmasi`, formData, config)
    if (res.status === 200) {
      const message = <div>Kami akan lakukan verifikasi pembayaran anda. Terima kasih.</div>
      toast.success(message, {
        onClose: () => setKonfirmasi({})
      })
    }
  }

  // status functions
  const onCekStatus = async (e) => {
    e.preventDefault()
    const { email } = e.target
    const { data } = await axios.get(`${REST_URL}/pendaftaran?email=${email.value}`)
    if (data.length) {
      setStatusPembayaran(data)
    } else {
      toast.error('Data tidak ditemukan')
    }
  }
  const copyKode = (value) => {
    navigator.clipboard.writeText(value)
    konfirmasi.kode = value
    setKonfirmasi(Object.assign({}, konfirmasi))
  }

  // sertifikat functions
  const onCekSertifikat = async (e) => {
    e.preventDefault(e)
    try {
      const { kodeSertifikat, kodePelaut } = e.target
      if (!kodeSertifikat.value && !kodePelaut.value) {
        return toast.error('masukkan kode sertifikat atau kode pelaut yang akan diverifikasi')
      }
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
          if (html[1]) {
            const test = html[1].match(new RegExp(/src='.*.g'/))
            const test1 = test[0].split('/').slice(-1).pop().replace("'", '')
            const test2 = html[1].replace(/src='.*'/, `src='https://pelaut.dephub.go.id/asset/images/${test1}'/`)
            html[1] = test2 + `</div><div class='col-lg-8'>`
            setSertifikat(html.join('\t'))
          } else {
            setSertifikat(html.join('\t'))
            return toast.error('kode sertifikat atau kode pelaut tidak ditemukan')
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Container>
      {/* Konfirmasi Pembayaran */}
      <Row>
        <Col xs={12} lg={6}>
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
      </Row>

      {/* Status Pembayaran */}
      <Row>
        <Col xs={12} lg={10}>
          <br />
          <Card>
            <Card.Header className="bg-warning"> Cek status peserta </Card.Header>
            <Card.Body>
              <Form name="konfirmasi" onSubmit={onCekStatus}>
                <Form.Group as={Row}>
                  <Form.Label column='sm' sm={2}>Email<span className='text-danger'>*</span></Form.Label>
                  <Col sm={10} lg={5}><Form.Control size='sm' type='text' name='email' placeholder='email pendaftaran' required /></Col>
                </Form.Group>
                <Button type="submit">Cari</Button>
              </Form>
              {statusPembayaran.length ?
                <div>
                  <Table responsive='sm' size='md' borderless>
                    <thead style={{ color: '#666' }} className="text-center">
                      <tr>
                        <th>Kode </th>
                        <th>Pelatihan</th>
                        <th>Tanggal</th>
                        <th>Bayar</th>
                        <th>Aktif</th>
                        <th>Note</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {statusPembayaran.map((sp, i) => (
                        <tr key={i} className="text-center">
                          <td>{sp.kode} &nbsp; {!sp.buktiPembayaran && <button className="btn btn-primary btn-sm" onClick={() => copyKode(sp.kode)}>Copy</button>}</td>
                          <td>{sp.pelatihan}</td>
                          <td>{sp.tanggal}</td>
                          <td>{sp.buktiPembayaran ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</td>
                          <td>{sp.cekPembayaran && sp.cekBiodata ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</td>
                          <td className="text-danger">
                            {sp.cekPembayaran && sp.cekBiodata ? null : sp.note}
                          </td>
                          <td>
                            {sp.cekPembayaran && sp.cekBiodata ? null :
                              <button className="btn btn-primary btn-sm" onClick={() => history.push(`/biodata?email=${statusPembayaran[0]?.email}`)} >Lengkapi</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                : null}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Verifikasi Pelaut */}
      <Row>
        <Col>
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
      <br />
    </Container >
  )
}
