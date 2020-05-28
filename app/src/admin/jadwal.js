import React, { useState, useEffect } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import ReactTable from 'react-table-v6'
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import { IoMdCreate, IoMdTrash, IoMdCheckmark, IoMdClose } from 'react-icons/io'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { toast } from 'react-toastify'

const REST_URL = process.env.REACT_APP_REST_URL
const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']
export default (props) => {
  const [data, setData] = useState([])
  const [show, showModal] = useState(false)
  const [kelas, setKelas] = useState([])
  const [detail, setDetail] = useState({})
  useEffect(() => {
    fetchData()
    fetchKelas()
  }, [])
  const fetchKelas = async () => {
    let response = await fetch(`${REST_URL}/pelatihan`)
    response = await response.json()
    setKelas(response)
  }
  const fetchData = async () => {
    let response = await fetch(`${REST_URL}/jadwal`)
    response = await response.json()
    setData(response)
  }
  const tambahData = () => {
    showModal(true)
    setDetail({ aktif: 1 })
  }
  const editData = (index) => {
    showModal(true)
    setDetail(data[index])
  }
  const deleteData = async (index) => {
    const { id, pelatihan } = data[index]
    const confirmed = window.confirm(`Apakah anda yakin menghapus jadwal ${pelatihan}?`)
    if (confirmed) {
      await axios.delete(`${REST_URL}/jadwal/${id}`)
      showModal(false)
      fetchData()
    }
  }
  const onSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!detail.pelatihan) {
        return toast.error('Pilih kelas!')
      }
      console.log('submit', detail)
      let { data } = await axios.post(`${REST_URL}/jadwal`, detail)
      toast.success(data.message)
      showModal(false)
      fetchData()
    } catch (error) {
      toast.error(error.message)
    }
  }
  const columns = [
    {
      Header: '', accessor: 'id', width: 110,
      Cell: props => {
        return <div>
          <button className="btn px-2 py-0 text-success" onClick={() => editData(props.index)}><IoMdCreate /></button>
          <button className="btn px-2 py-0 text-danger" onClick={() => deleteData(props.index)}><IoMdTrash /></button>
        </div>
      }
    },
    { Header: 'Kelas', accessor: 'pelatihan', width: 100 },
    { Header: 'Hari', accessor: 'hari', width: 100 },
    { Header: 'Tanggal', accessor: 'tanggal', width: 200 },
    {
      Header: 'Aktif', accessor: 'aktif', width: 200, Cell: props =>
        <div className="text-center">{props.value ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</div>
    },

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
              <big className="text-white">Jadwal Pelatihan</big>
              <Button variant="success" className="btn-sm float-right" onClick={() => tambahData()} >Tambah Baru</Button>
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
            <Modal.Title>{detail.id ? 'Edit Jadwal' : 'Tambah Jadwal'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>Kelas<span className='text-danger'>*</span></Form.Label>
              <Col xs='9'>
                <Select
                  className='p-0 form-control-sm'
                  placeholder='Pilih kelas'
                  options={kelas}
                  value={[{ nama: detail.pelatihan, deskripsi: detail.pelatihan }]}
                  onChange={(option) => {
                    detail.pelatihan = option.nama
                    setDetail({ ...detail })
                  }}
                  getOptionLabel={option => option.deskripsi}
                  getOptionValue={option => option.nama}
                  required={true}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>Tanggal<span className='text-danger'>*</span></Form.Label>
              <Col xs='9'>
                <DatePicker
                  className="form-control"
                  // showTimeSelect
                  // timeFormat="HH:mm"
                  dateFormat="yyyy-MM-dd HH:mm"
                  selected={detail.tanggal ? dayjs(detail.tanggal)['$d'] : ''}
                  onChange={(tgl) => {
                    detail.tanggal = dayjs(tgl).format('YYYY-MM-DD HH:mm:ss')
                    detail.hari = days[dayjs(detail.tanggal).format('d')]
                    setDetail({ ...detail })
                  }}
                  injectTimes={[9, 20]}
                  timeIntervals={15}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>Hari<span className='text-danger'>*</span></Form.Label>
              <Col xs='4' md='3' lg="2">
                <Form.Control
                  className="capitalize " size='sm' type='text' name='hari'
                  value={detail.hari || ''} readOnly
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm' xs='3'>Aktif<span className='text-danger'>*</span></Form.Label>
              <Col xs='3'>
                <Form.Check type="switch" id="switch-status" label="Aktif"
                  checked={detail.aktif ? true : false}
                  onChange={e => {
                    detail.aktif = e.target.checked ? 1 : 0
                    setDetail(Object.assign({}, detail))
                  }}
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
