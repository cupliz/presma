import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Row, Col, Modal, Image } from 'react-bootstrap'
// import { IoMdEye, IoMdCreate, IoMdTrash, IoMdClose, IoMdCheckmark } from 'react-icons/io'
// import Image from 'components/image'

const REST_URL = process.env.REACT_APP_REST_URL
export default ({ detail, show, setShow }) => {
  const [requirement, setRequirement] = useState([])
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {

    let { data } = await axios.get('/requirement.json')
    setRequirement(data)
  }
  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        {/* <label>{detail.nama || ''}</label> */}

      </Modal.Body>
      <Modal.Footer>
        <Row>
          {detail.buktiPembayaran &&
            <Col md={6}>
              <Image src={`${REST_URL}/upload/pembayaran/${detail.buktiPembayaran}`} />
              <label>Bukti Pembayaran</label>
            </Col>
          }
        </Row>
        <br />
        <Row>
          {requirement && requirement.map(req => <div>
            <Col xs={2}>
              <Image src={`${REST_URL}/upload/dokumen/${detail[req.name]}`} roundedCircle />
              <label>{req.id}</label>
            </Col>
          </div>)}
        </Row>
      </Modal.Footer>
    </Modal>
  )
}
