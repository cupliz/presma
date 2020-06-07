import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Container, Row, Col, Card, Button, Form, Table } from 'react-bootstrap'
import { formatRibuan } from 'helpers/index'

const REST_URL = process.env.REACT_APP_REST_URL
export default (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [pelatihan, setPelatihan] = useState({})
  const [kelas, setKelas] = useState([])
  const [jadwal, setJadwal] = useState([])

  useEffect(() => { // componentDidMount
    const fetchKelas = async () => {
      let { data } = await axios.get(`${REST_URL}/pelatihan`)
      setKelas(data)
    }
    fetchKelas()
  }, [])
  const onPilihProgram = (e) => {
    const data = kelas.filter(r => r.id.toString() === e.target.value)[0]
    setPelatihan(data)
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
              <Card.Header className='bg-warning text-center'>Pilih Program Pelatihan</Card.Header>
              <Card.Body>
                <Form.Control as='select' onChange={onPilihProgram} value={pelatihan.id || ""}>
                  <option value='' disabled>--Pilih program</option>
                  {kelas.map((k, i) => <option key={i} value={k.id}>({k.nama}) {k.deskripsi}</option>)}
                </Form.Control>
                <br />
                {pelatihan && pelatihan.nama ?
                  <div>
                    <label className='primary'>Biaya</label>: <b className='text-primary'>{formatRibuan(pelatihan.biaya)}</b> <br />
                    <label className='primary'>Waktu</label>: {pelatihan.waktu} hari <br />
                    <img src={pelatihan.gambar ? `${REST_URL}/upload/pelatihan/${pelatihan.gambar}` : `/img/no-img.png`} className='rounded img-fluid' alt='bst' />
                    <h5 className='mt-4'>Persyaratan:</h5>
                    <ul className='p-2 ml-4'>
                      <li>Usia minimal 16 thn </li>
                      {pelatihan.prasyarat.map(syarat => {
                        if (syarat == 'KTP') {
                          return <li> FC KTP (2lbr) </li>
                        } else if (syarat == 'SKES') {
                          return <li>Surat Keterangan Sehat dari Rumah Sakit yang ditunjuk oleh Dirjen Hubla</li>
                        } else if (syarat == 'IJAZAH') {
                          return <li>FC Ijazah Umum legalisir (2lbr)</li>
                        } else if (syarat == 'AKTE') {
                          return <li>FC Akta kelahiran (2lbr)</li>
                        } else if (syarat == 'FOTO') {
                          return <li>Foto warna terbaru ukuran 3×4 (2lbr)</li>
                        } else {
                          return <li>FC sertifikat {syarat} legalisir (2lbr)</li>
                        }
                      })}
                    </ul>
                  </div> : null
                }
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            {jadwal.length ?
              <Card className='p-0'>
                <Card.Header className='bg-warning text-center'>Pilih Waktu Pelatihan</Card.Header>
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
