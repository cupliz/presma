import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactTable from 'react-table-v6'
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import { IoMdCreate, IoMdTrash } from 'react-icons/io'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { formatRibuan } from 'helpers/index'

const REST_URL = process.env.REACT_APP_REST_URL
const requirement = [
  { nama: "BST", deskripsi: "Setifikat BST" },
  { nama: "AFF", deskripsi: "Setifikat AFF" },
  { nama: "MFA", deskripsi: "Setifikat MFA" },
  { nama: "KTP", deskripsi: "Nomor Induk Kewarganegaraan (NIK)" },
  { nama: "SKES", deskripsi: "Surat Keterangan Sehat dari Rumah Sakit yang ditunjuk oleh Dirjen Hubla" },
  { nama: "IJAZAH", deskripsi: "Ijazah Umum legalisir" },
  { nama: "AKTE", deskripsi: "Akta kelahiran" },
  { nama: "FOTO", deskripsi: "Foto warna terbaru ukuran 3×4" },
]
export default (props) => {
  const [data, setData] = useState([])
  const [show, showModal] = useState(false)
  const [detail, setDetail] = useState({})

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    let response = await fetch(REST_URL + '/pelatihan')
    response = await response.json()
    setData(response)
  }
  const tambahData = () => {
    showModal(true)
    setDetail({})
  }
  const editData = (index) => {
    showModal(true)
    setDetail(data[index])
  }
  const onChange = (e) => {
    detail[e.target.name] = e.target.value
    setDetail(detail)
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      let response = await axios.post(REST_URL + '/pelatihan', detail)
      if (response.message) {
      } else {
        showModal(false)
        fetchData()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const onDelete = async (index) => {
    const { id, nama } = data[index]
    const confirmed = window.confirm(`Apakah anda yakin menghapus pelatihan ${nama}?`)
    if (confirmed) {
      let response = await fetch(REST_URL + '/pelatihan/' + id, {
        method: 'DELETE',
      })
      if (response.statusText === "OK") {
        showModal(false)
        fetchData()
      }
    }
  }

  const columns = [
    {
      Header: '', accessor: 'id', width: 100,
      Cell: props => {
        return <div>
          <button className="btn px-2 py-0 text-success" onClick={() => editData(props.index)}><IoMdCreate /></button>
          <button className="btn px-2 py-0 text-danger" onClick={() => onDelete(props.index)}><IoMdTrash /></button>
        </div>
      }
    },
    { Header: 'Nama', accessor: 'nama', width: 100 },
    { Header: 'Deskripsi', accessor: 'deskripsi', width: 200 },
    { Header: 'Waktu', accessor: 'waktu', width: 80, Cell: props => props.value + ' hari' },
    { Header: 'Biaya', accessor: 'biaya', width: 100, Cell: props => formatRibuan(props.value) },
    { Header: 'Prasyarat', accessor: 'prasyarat', Cell: props => props.value.join(', ') },

  ]
  const pagination = {
    limit: 10
  }
  return (
    <Container className='mt-4'>
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="bg-primary">
              <big className="text-white">Daftar Pelatihan</big>
              <Button size="sm" variant="success" className="float-right" onClick={() => tambahData()} >Tambah Baru</Button>
            </Card.Header>
            <ReactTable
              data={data}
              columns={columns}
              minRows={pagination.limit}
            />
          </Card>
        </Col>
      </Row>
      <Modal show={show} onHide={() => showModal(false)} size="lg">
        <Form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{detail ? detail.nama : 'Data Pelatihan'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>ID<span className='text-danger'>*</span></Form.Label>
              <Col xs="4" sm='3' md='2'><Form.Control size='sm' type='text' name='nama' onChange={onChange} placeholder="ex: BST" defaultValue={detail.nama || ''} required /></Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>Nama<span className='text-danger'>*</span></Form.Label>
              <Col xs='9'><Form.Control size='sm' type='text' name='deskripsi' onChange={onChange} placeholder="ex: Basic Safety Training" defaultValue={detail.deskripsi || ''} required /></Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>Waktu<span className='text-danger'>*</span></Form.Label>
              <Col xs='3' sm='2'><Form.Control size='sm' type='number' name='waktu' onChange={onChange} defaultValue={detail.waktu || ''} required /></Col>
              <Col xs='3'>hari</Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>Biaya<span className='text-danger'>*</span></Form.Label>
              <Col xs='9'><Form.Control size='sm' type='number' name='biaya' onChange={onChange} defaultValue={detail.biaya || ''} required /></Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>Prasyarat<span className='text-danger'>*</span></Form.Label>
              <Col xs='9'>
                <Select
                  isMulti
                  isSearchable
                  className='p-0 form-control-sm'
                  placeholder='Pilih persyaratan'
                  options={requirement}
                  value={detail.prasyarat && detail.prasyarat.map(option => ({ nama: option, deskripsi: option }))}
                  onChange={opt => {
                    detail.prasyarat = opt ? opt.map(r => r.nama) : []
                    setDetail(Object.assign({}, detail))
                  }}
                  getOptionLabel={option => option.deskripsi}
                  getOptionValue={option => option.nama}
                />
              </Col>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit"> Save Changes </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}
