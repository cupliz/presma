import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap'
import axios from 'axios'

const REST_URL = process.env.REACT_APP_REST_URL
export default (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const pelatihanTerpilih = useSelector(state => state.pelatihanTerpilih)
  const [kelas, setKelas] = useState([])
  const [jadwal, setJadwal] = useState([])

  useEffect(() => { // componentDidMount
    fetchKelas()
  }, [])
  const fetchKelas = async () => {
    let { data } = await axios.get(`${REST_URL}/pelatihan`)
    if (pelatihanTerpilih) {
      const getPelatihanTerpilih = data.filter(r => r.id == pelatihanTerpilih.id)
      if (getPelatihanTerpilih.length) {
        findJadwal(getPelatihanTerpilih[0].nama)
      }
    }
    setKelas(data)
  }
  const onPilihProgram = (e) => {
    const data = kelas.filter(r => r.id == e.target.value)[0]
    dispatch({ type: 'SET_PELATIHAN', data })
    findJadwal(data.nama)
  }
  const findJadwal = async (nama) => {
    let { data } = await axios.get(`${REST_URL}/jadwal?pelatihan=${nama}`)
    setJadwal(data)
  }
  const nextStep = (data) => {
    dispatch({ type: 'SET_JADWAL', data })
    history.push('/biodata')
  }
  return (
    <div className='mt-4'>
      <Container>
        <Row>
          <Col xs={12} sm={6}>
            <Card className='p-0' >
              <Card.Header className='bg-primary text-white text-center'>Pilih Program Pelatihan</Card.Header>
              <Card.Body>
                <Form.Control as='select' onChange={onPilihProgram} value={pelatihanTerpilih.id}>
                  <option value='' disabled>--Pilih program</option>
                  {kelas.map((k, i) => <option key={i} value={k.id}>({k.nama}) {k.deskripsi}</option>)}
                </Form.Control>
                <br />
                {pelatihanTerpilih && pelatihanTerpilih.nama === 'BST' &&
                  <div>
                    <label className='primary'>Biaya</label>: <b className='text-primary'>{pelatihanTerpilih.biaya}</b> <br />
                    <label className='primary'>Waktu</label>: {pelatihanTerpilih.waktu} hari
                    <img src='/img/BST.jpg' className='rounded img-fluid' alt='bst' />
                    <h5 className='mt-4'>Persyaratan:</h5>
                    <div className='p-2'>
                      1. Usia minimal 16 thn <br />
                    2. FC KTP (2lbr) <br />
                    3. Surat Keterangan Sehat dari Rumah Sakit yang ditunjuk oleh Dirjen Hubla <br />
                    4. FC Ijazah Umum legalisir (2lbr) <br />
                    5. FC Akta kelahiran (2lbr) <br />
                    6. Foto warna terbaru ukuran 3×4 (2lbr) <br />
                    </div>
                  </div>}
                {pelatihanTerpilih && pelatihanTerpilih.nama === 'AFF' &&
                  <div>
                    <label className='primary'>Biaya</label>: <b className='text-primary'>{pelatihanTerpilih.biaya}</b> <br />
                    <label className='primary'>Waktu</label>: {pelatihanTerpilih.waktu} hari
                    <img src='/img/AFF.jpg' className='rounded img-fluid' alt='aff' />
                    <h5 className='mt-4'>Persyaratan:</h5>
                    <div className='p-2'>
                      1. Usia minimal 16 thn <br />
                    2. FC sertifikat BST legalisir (2lbr) <br />
                    3. FC KTP (2lbr) <br />
                    4. Surat Keterangan Sehat dari Rumah Sakit yag ditunjuk oleh Dirjen Hubla <br />
                    5. FC Ijazah Umum legalisir (2lbr) <br />
                    6.FC Akta kelahiran (2lbr) <br />
                    7. Foto warna terbaru ukuran 3×4 (2lbr) <br />
                    </div>
                  </div>}
                {pelatihanTerpilih && pelatihanTerpilih.nama === 'MFA' &&
                  <div>
                    <label className='primary'>Biaya</label>: <b className='text-primary'>{pelatihanTerpilih.biaya}</b> <br />
                    <label className='primary'>Waktu</label>: {pelatihanTerpilih.waktu} hari
                    <img src='/img/MFA.jpg' className='rounded img-fluid' alt='mfa' />
                    <h5 className='mt-4'>Persyaratan:</h5>
                    <div className='p-2'>
                      1. Usia minimal 16 thn <br />
                    2. FC sertifikat BST legalisir (2lbr) <br />
                    3. FC KTP (2lbr) <br />
                    4. Surat Keterangan Sehat dari Rumah Sakit yag ditunjuk oleh Dirjen Hubla <br />
                    5. FC Ijazah Umum legalisir (2lbr) <br />
                    6. FC Akta kelahiran (2lbr) <br />
                    7. Foto warna terbaru ukuran 3×4 (2lbr) <br />
                    </div>
                  </div>}
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            {jadwal.length ?
              <Card className='p-0'>
                <Card.Header className='bg-primary text-white text-center'>Pilih Waktu Pelatihan</Card.Header>
                <Card.Body>
                  <Table responsive='sm' size='md' borderless>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Kelas</th>
                        <th>Hari</th>
                        <th>Tanggal</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {jadwal.map((kls, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{kls.pelatihan}</td>
                          <td>{kls.hari}</td>
                          <td>{kls.tanggal}</td>
                          <td><Button size='sm' variant='primary' onClick={(e) => nextStep(kls)}>Pilih</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card> : null}
          </Col>
        </Row>
      </Container>
    </div>
  )
}
