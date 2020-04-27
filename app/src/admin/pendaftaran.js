import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-v6'
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import { IoMdEye, IoMdCreate, IoMdTrash, IoMdClose, IoMdCheckmark } from 'react-icons/io'
import Detail from './pendaftaranDetail'

const REST_URL = process.env.REACT_APP_REST_URL
export default (props) => {
  const [show, setShow] = useState(false)
  const [detail, setDetail] = useState(null)
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    let response = await fetch(REST_URL + '/pendaftaran')
    response = await response.json()
    setData(response)
  }
  const detailData = (index) => {
    setShow(true)
    setDetail(data[index])
  }

  const columns = [
    {
      Header: '', accessor: 'id', width: 110,
      Cell: props => <button className="btn px-2 py-0 text-success" onClick={() => detailData(props.index)}><IoMdEye /></button>
    },
    { Header: 'Nama', accessor: 'peserta', Cell: props => <span className="capitalize">{props.value}</span> },
    { Header: 'Bank', accessor: 'bank' },
    { Header: 'Pelatihan', accessor: 'pelatihan' },
    { Header: 'Biaya', accessor: 'biaya' },
    {
      Header: 'Biodata', accessor: 'cekBiodata',
      Cell: props => <div className="text-center">{props.value ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</div>
    },
    {
      Header: 'Pembayaran', accessor: 'cekPembayaran',
      Cell: props => <div className="text-center">{props.value ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</div>
    },

  ]
  const pagination = { limit: 10 }
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
      {show && <Detail show={show} setShow={setShow} detail={detail} />}
    </Container>
  )
}
