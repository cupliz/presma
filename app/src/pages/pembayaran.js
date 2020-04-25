import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { Container, Row, Col, Card, ListGroup, Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

const REST_URL = process.env.REACT_APP_REST_URL
const daftarBank = [
  { id: 'mandiri', label: 'Mandiri', rek: '101.00.98300.997', nama: 'Dompet Dhuafa' },
  { id: 'bca', label: 'BCA', rek: '237.301.8881', nama: 'Dompet Dhuafa' },
  { id: 'bni', label: 'BNI', rek: '000.530.2291', nama: 'Dompet Dhuafa' },
  { id: 'muamalat', label: 'Muamalat', rek: '301.001.5515', nama: 'Dompet Dhuafa' },
]
export default (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const jadwalTerpilih = useSelector(state => state.jadwalTerpilih)
  const pelatihanTerpilih = useSelector(state => state.pelatihanTerpilih)
  const biodataPeserta = useSelector(state => state.biodataPeserta)
  const kodePembayaran = useSelector(state => state.kodePembayaran)
  const [bank, setBank] = useState(null)

  useEffect(() => {
    // if (!cart) {
    //   history.push('/')
    // }
  })

  const onChange = (e) => {
    setBank(e.target.value)
  }
  const onBayar = async () => {
    const message = <div>Kami telah mengirim invoice ke alamat email {biodataPeserta.email}. Segera lakukan pembayaran agar dapat diproses oleh admin.</div>
    const payload = {
      kode: nanoid(),
      pelatihan: pelatihanTerpilih.id,
      jadwal: jadwalTerpilih.id,
      jadwal: jadwalTerpilih.id,
      peserta: biodataPeserta.id,
      bank: bank,
    }
    let { data } = await axios.post(`${REST_URL}/pendaftaran`, payload)
    if (data) {
      toast.success(message/* , { onClose: () =>  } */)
      dispatch({ type: 'KONFIRMASI', data: payload })
    }

  }
  const bankTerpilih = kodePembayaran.bank ? daftarBank.filter(r => r.id === kodePembayaran.bank)[0] : {}
  return (
    <Container className='mt-4'>
      <Row>
        <Col xs={12} sm={4}>
          <div>
            <Card className='p-0'>
              <Card.Body>
                <span>Detail Peserta:</span>
                <hr />
                <label>Nama: </label><span className='float-right text-primary capitalize'>{biodataPeserta.nama}</span> <br />
                <label>Email: </label><span className='float-right text-primary'>{biodataPeserta.email}</span> <br />
                <label>Handphone: </label><span className='float-right text-primary'>{biodataPeserta.phone}</span> <br />
              </Card.Body>
            </Card>
            <Card className='p-0 mt-4'>
              <Card.Body>
                <span>Program yang telah anda pilih:</span>
                <hr />
                <label>Kelas: </label><span className='float-right text-primary'>{pelatihanTerpilih.nama}</span> <br />
                <label>Biaya: </label><span className='float-right text-primary'>{pelatihanTerpilih.biaya}</span> <br />
                <label>Waktu: </label><span className='float-right text-primary'>{jadwalTerpilih.tanggal}</span> <br />
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col>
          {kodePembayaran ?
            <Card>
              <Card.Header className="bg-primary text-white">Pilih metode pembayaran</Card.Header>
              <Card.Body>
                <p>
                  Silahkan lakukan pembayaran ke: <br />
                  Bank: <b className="text-primary">{bankTerpilih.label}</b> <br />
                  A/N: <b className="text-primary">{bankTerpilih.nama}</b> <br />
                  REK: <b className="text-primary">{bankTerpilih.rek}</b> <br />
                  <br/>
                  KODE PEMBAYARAN: <b className="text-primary">{kodePembayaran.kode}</b> <br />
                  <br />
                  <i className="text-danger">* Cantumkan kode pembayaran di bagian deskripsi transfer</i><br/>
                  <i className="text-danger">* Copy paste kode unik untuk melakukan konfirmasi</i>
                </p>
                <Button onClick={() => history.push('/konfirmasi')}>Konfirmasi</Button>
              </Card.Body>
            </Card>
            :
            <Card>
              <Card.Header className="bg-primary text-white">Pilih metode pembayaran</Card.Header>
              <ListGroup>
                {daftarBank ? daftarBank.map((b, i) =>
                  <ListGroup.Item key={i}>
                    <Form.Check name="bank" custom type="radio" id={b.id} value={b.id} onChange={onChange}
                      label={
                        <div>
                          <img height="12" src={`https://ecs7.tokopedia.net/img/toppay/sprites/${b.id}.png`} alt="" />
                          <span className="ml-3">{b.label}</span>
                        </div>
                      } />
                  </ListGroup.Item>
                ) : null}
              </ListGroup>
              {bank && <Card.Footer><Button block variant="primary" onClick={onBayar}>Bayar</Button> </Card.Footer>}
            </Card>
          }
        </Col>
      </Row>
    </Container>
  )
}
