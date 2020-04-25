import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-v6'
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import { IoMdEye, IoMdCreate, IoMdTrash, IoMdClose, IoMdCheckmark } from 'react-icons/io'
// import Select from 'react-select'

export default (props) => {
  const [show, setShow] = useState(false)
  const [detail, setDetail] = useState({})
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    let response = await fetch('/data/peserta.json')
    response = await response.json()
    setData(response)
  }
  const toggleModal = (toggle) => setShow(toggle ? toggle : !show)
  const tambahData = () => {
    setShow(true)
    setDetail({})
  }
  const editData = (index) => {
    setShow(true)
    setDetail(data[index])
  }
  const deleteData = (id) => {
    const newData = data.filter(r => r.id !== id)
    const c = window.confirm(`Apakah anda yakin menghapus pelatihan ${id}?`)
    if (c) {
      setData(newData)
    }
  }
  const onChange = (e) => {
    detail[e.target.name] = e.target.value
    setDetail(Object.assign({}, detail))
  }
  const onSubmit = (e) => {
    e.preventDefault()
    console.log(detail)
  }

  const columns = [
    {
      Header: '', accessor: 'id', width: 110,
      Cell: props => {
        return <div>
          <button className="btn px-2 py-0 text-success" onClick={() => editData(props.index)}><IoMdEye /></button>
          <button className="btn px-2 py-0 text-danger" onClick={() => deleteData(props.value)}><IoMdTrash /></button>
        </div>
      }
    },
    { Header: 'Nama', accessor: 'nama' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'KTP', accessor: 'ktp' },
    {
      Header: 'Biodata', accessor: 'cekBiodata',
      Cell: props => <div className="text-center">{props.value ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</div>
    },
    {
      Header: 'Pembayaran', accessor: 'cekPembayaran',
      Cell: props => <div className="text-center">{props.value ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</div>
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
              <big className="text-white">Daftar Peserta</big>
              {/* <Button variant="success" className="float-right" onClick={() => tambahData()} >Tambah Baru</Button> */}
            </Card.Header>
            <ReactTable
              data={data}
              columns={columns}
              minRows={pagination.limit}
            />
          </Card>
        </Col>
      </Row>
      <Modal show={show} onHide={() => toggleModal(false)} size="lg">
        <Form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{detail ? detail.name : 'Data Pelatihan'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group as={Row}>
              <Form.Label column='sm' sm='3'>Hari<span className='text-danger'>*</span></Form.Label>
              <Col sm='9'><Form.Control size='sm' type='text' name='hari' onChange={onChange} defaultValue={detail.hari || ''} required /></Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column='sm' sm='3'>Tanggal<span className='text-danger'>*</span></Form.Label>
              <Col sm='9'><Form.Control size='sm' type='text' name='tanggal' onChange={onChange} defaultValue={detail.tanggal || ''} required /></Col>
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
