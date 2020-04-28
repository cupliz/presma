import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Modal, Image, Form } from 'react-bootstrap'
// import { IoMdEye, IoMdCreate, IoMdTrash, IoMdClose, IoMdCheckmark } from 'react-icons/io'
// import Image from 'components/image'

const REST_URL = process.env.REACT_APP_REST_URL
export default ({ detail, show, onHide }) => {
  const [requirement, setRequirement] = useState([])
  const [enlarge, setEnlarge] = useState(null)
  const [confirmed, setConfirmed] = useState({ cekBiodata: detail.cekBiodata, cekPembayaran: detail.cekPembayaran })
  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = async () => {
    let { data } = await axios.get('/requirement.json')
    setRequirement(data)
  }
  const showImage = (e) => {
    setEnlarge(e.target.src)
  }
  const onChange = async (e) => {
    const { id, checked } = e.target
    const payload = {
      kode: detail.kode,
      [id]: checked ? 1 : 0
    }
    let { data } = await axios.post(REST_URL + '/verifikasi', payload)
    setConfirmed(data)
  }
  return (
    <Modal show={show} onHide={onHide} size="lg" className="text-gray-dark">
      <Modal.Header closeButton>
        <Form className="w-100">
          <Modal.Title className="text-center text-primary">VERIFIKASI</Modal.Title>
          <Form.Check
            custom
            type="checkbox"
            id="cekBiodata"
            label="Biodata sudah sesuai dengan dokumen"
            checked={confirmed.cekBiodata}
            onChange={onChange}
          />
          <Form.Check
            custom
            type="checkbox"
            id="cekPembayaran"
            label="Bukti pembayaran telah diterima dan sesuai"
            checked={confirmed.cekPembayaran}
            onChange={onChange}
          />
        </Form>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={6}>
            <pre className="playground text-gray">
              <Col><label>Nama: </label> {detail.nama}</Col>
              <Col><label>NIK: </label> {detail.ktp}</Col>
              <Col><label>NISN: </label> {detail.nisn}</Col>
              <Col><label>TTL: </label> {detail.tempatLahir}/{detail.tanggalLahir}</Col>
              <Col><label>JK: </label> {detail.gender}</Col>
              <Col><label>Agama: </label> {detail.agama}</Col>
              <Col><label>Kewarganegaraan: </label> {detail.warga}</Col>
              <Col><label>Nama Ayah: </label> {detail.ayah}</Col>
              <Col><label>Nama Ibu: </label> {detail.ibu}</Col>
            </pre>
          </Col>
          <Col md={6}>
            <pre className="playground text-gray">
              <Col><label>Alamat: </label> {detail.alamat}</Col>
              <Col><label>Provinsi: </label> {detail.provinsi}</Col>
              <Col><label>Kabupaten: </label> {detail.kabupaten}</Col>
              <Col><label>Kecamatan: </label> {detail.kecamatan}</Col>
              <Col><label>Kelurahan: </label> {detail.kelurahan}</Col>
              <Col><label>RT/RW: </label> {detail.rt}/{detail.rw}</Col>
              <Col><label>Kodepos: </label> {detail.kodepos}</Col>
              <Col><label>email: </label> {detail.email}</Col>
            </pre>
          </Col>
        </Row>
        <br />
        <Row>
          {detail.buktiPembayaran &&
            <Col xs={6} sm={2} className="text-center">
              <Image className="pointer" height="50" src={`${REST_URL}/upload/pembayaran/${detail.buktiPembayaran}`} onClick={showImage} />
              <div className="card-title" >Transfer</div>
            </Col>
          }
          {requirement && requirement.map((req, i) => {
            return detail[req.name] &&
              <Col key={i} xs={6} sm={2} className="text-center">
                <Image className="pointer" height="50" src={`${REST_URL}/upload/dokumen/${detail[req.name]}`} rounded onClick={showImage} />
                <div style={{ overflow: 'hidden' }}>{req.id}</div>
              </Col>
          })}
        </Row>
        <i className="text-danger">*klik pada gambar untuk melihat lebih besar</i>
        {enlarge && <Image src={enlarge} width="100%" rounded />}
      </Modal.Body>

      <Modal.Footer className="justify-content-between">
      </Modal.Footer>
    </Modal>
  )
}
