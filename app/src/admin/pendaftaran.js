import React, { useState, useEffect } from 'react'
import ReactTable from 'react-table-v6'
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'
import { Container, Row, Col, Card, DropdownButton, Dropdown, Button } from 'react-bootstrap'
import { IoMdEye, IoMdClose, IoMdCheckmark } from 'react-icons/io'
import Detail from './pendaftaranDetail'

const REST_URL = process.env.REACT_APP_REST_URL
export default (props) => {
  const [show, setShow] = useState(false)
  const [detail, setDetail] = useState(null)
  const [data, setData] = useState([])
  const [program, setProgram] = useState([])
  const [filterData, setFilterData] = useState([])
  const [filterPelatihan, setFilterPelatihan] = useState("")
  const [filterTanggal, setFilterTanggal] = useState("")

  useEffect(() => {
    fetchData()
    fetchProgram()
  }, [])
  const fetchData = async () => {
    let response = await fetch(REST_URL + '/pendaftaran')
    response = await response.json()
    setData(response)
    setFilterData(response)
  }
  const fetchProgram = async () => {
    let response = await fetch(REST_URL + '/pelatihan')
    response = await response.json()
    setProgram(response)
  }
  const detailData = (index) => {
    setShow(true)
    setDetail(data[index])
  }
  const onHide = () => {
    fetchData()
    setShow(false)
  }
  const print = () => {
    window.print()
  }

  useEffect(() => {
    if (filterPelatihan) {
      setFilterData(data.filter(item => item.pelatihan === filterPelatihan))
    }
    if (filterTanggal) {
      setFilterData(data.filter(item => item.tanggal === dayjs(filterTanggal).format('YYYY-MM-DD')))
    }
    if (filterPelatihan && filterTanggal) {
      setFilterData(data.filter(item => item.pelatihan === filterPelatihan).filter(item => item.tanggal === dayjs(filterTanggal).format('YYYY-MM-DD')))
    }
  }, [filterPelatihan, filterTanggal])

  const columns = [
    {
      Header: '', accessor: 'id', width: 50,
      Cell: props => <button className="btn px-2 py-0 text-success" onClick={() => detailData(props.index)}><IoMdEye /></button>
    },
    { Header: 'Nama', accessor: 'nama', Cell: props => <span className="capitalize">{props.value}</span> },
    { Header: 'Bank', accessor: 'bank' },
    { Header: 'Pelatihan', accessor: 'pelatihan' },
    { Header: 'Tanggal', accessor: 'tanggal' },
    { Header: 'Biaya', accessor: 'biaya' },
    {
      Header: 'Biodata', accessor: 'cekBiodata',
      Cell: props => <div className="text-center">{props.value ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</div>
    },
    {
      Header: 'Pembayaran', accessor: 'cekPembayaran',
      Cell: props => <div className="text-center">{props.value ? <IoMdCheckmark className="text-success" /> : <IoMdClose className="text-danger" />}</div>
    }
  ]
  const pagination = { limit: 10 }

  return (
    <Container className='mt-4' id="section-to-print">
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="bg-primary">
              <big className="text-white">Daftar Peserta</big>
              <Button size="sm" variant="success" className="float-right" onClick={print}>Print</Button>
              <Button size="sm" variant="success" className="float-right mx-2" onClick={() => { setFilterPelatihan(""); setFilterTanggal(""); setFilterData(data) }}>Reset</Button>
              <div className="float-right" style={{ width: "6rem" }}>
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  className='form-control form-control-sm'
                  selected={filterTanggal ? dayjs(filterTanggal)['$d'] : ''}
                  onChange={(date) => setFilterTanggal(date)}
                />
              </div>
              <DropdownButton
                className="float-right mx-2"
                variant="success"
                title={filterPelatihan ? filterPelatihan : "None"}
                id="select"
                size="sm"
              >
                {program.map((item, i) =>
                  <Dropdown.Item key={i} onClick={() => setFilterPelatihan(item.nama)}>{item.nama}</Dropdown.Item>
                )}
              </DropdownButton>
            </Card.Header>
            <ReactTable
              data={filterData}
              columns={columns}
              minRows={pagination.limit}
              getTrProps={(state, rowInfo) => ({
                onClick: () => detailData(rowInfo.index),
                style: { cursor: rowInfo ? 'pointer' : '' }
              })}
            />
          </Card>
        </Col>
      </Row>
      {show && <Detail show={show} onHide={onHide} detail={detail} />}
    </Container >
  )
}