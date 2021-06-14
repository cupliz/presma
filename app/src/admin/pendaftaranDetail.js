import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Row, Col, Modal, Image, Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

const REST_URL = process.env.REACT_APP_REST_URL
export default ({ detail, show, onHide }) => {
  const [requirement, setRequirement] = useState([])
  const [enlarge, setEnlarge] = useState(null)
  const [confirmed, setConfirmed] = useState({ cekBiodata: detail.cekBiodata, cekPembayaran: detail.cekPembayaran, note: detail.note })

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
  const verifyDoc = async (e) => {
    const { id, checked } = e.target
    const columns = {
      BST: "bstFile",
      KTP: "ktpFile",
      SKES: "skesFile",
      IJAZAH: "ijazahFile",
      AKTE: "akteFile",
      FOTO: "fotoFile"
    }
    const payload = {
      email: detail.email,
      kolom: columns[id],
    }
    if (!checked) {
      await axios.post(REST_URL + '/verifikasidokumen', payload)
      toast.success("Data telah dihapus")
    }
  }
  const sendNote = async (e) => {
    e.preventDefault()
    const payload = {
      kode: detail.kode,
      note: e.target.note.value
    }
    let { data } = await axios.post(REST_URL + '/verifikasi', payload)
    setConfirmed(data)
    toast.success("Note telah ditambahkan")
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" className="text-gray-dark print" id="section-to-print">
      <Modal.Header closeButton>
        <div className="w-100" >
          <Modal.Title className="text-center text-primary">VERIFIKASI</Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Col>
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
            <Col xs={12} md={12}>
              <Form className="w-100" onSubmit={(e) => sendNote(e)}>
                <Form.Check
                  custom
                  type="checkbox"
                  id="cekBiodata"
                  label="Biodata sudah sesuai dengan dokumen"
                  checked={confirmed.cekBiodata}
                  onChange={onChange}
                />
                <Row>
                  {requirement.some(item => item.name === "ktpFile") ? detail.prasyarat.includes('\"KTP\"') &&
                    <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                      <Image className="pointer" height="50" src={detail.ktpFile && `${REST_URL}/upload/dokumen/${detail["ktpFile"]}`} rounded onClick={showImage} />
                      <Form >
                        <Form.Check
                          custom
                          type="checkbox"
                          id="KTP"
                          label="KTP"
                          defaultChecked={detail.ktpFile}
                          onChange={verifyDoc}
                          disabled={confirmed.cekBiodata ? true : false}
                        />
                      </Form>
                    </div> : null}
                  {requirement.some(item => item.name === "fotoFile") ? detail.prasyarat.includes('\"FOTO\"') &&
                    <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                      <Image className="pointer" height="50" src={detail.fotoFile && `${REST_URL}/upload/dokumen/${detail["fotoFile"]}`} rounded onClick={showImage} />
                      <Form >
                        <Form.Check
                          custom
                          type="checkbox"
                          id="FOTO"
                          label="FOTO"
                          defaultChecked={detail.fotoFile}
                          onChange={verifyDoc}
                          disabled={confirmed.cekBiodata ? true : false}
                        />
                      </Form>
                    </div> : null}
                  {requirement.some(item => item.name === "akteFile") ? detail.prasyarat.includes('\"AKTE\"') &&
                    <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                      <Image className="pointer" height="50" src={detail.akteFile && `${REST_URL}/upload/dokumen/${detail["akteFile"]}`} rounded onClick={showImage} />
                      <Form >
                        <Form.Check
                          custom
                          type="checkbox"
                          id="AKTE"
                          label="AKTE"
                          defaultChecked={detail.akteFile}
                          onChange={verifyDoc}
                          disabled={confirmed.cekBiodata ? true : false}
                        />
                      </Form>
                    </div> : null}
                  {requirement.some(item => item.name === "ijazahFile") ? detail.prasyarat.includes('\"IJAZAH\"') &&
                    <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                      <Image className="pointer" height="50" src={detail.ijazahFile && `${REST_URL}/upload/dokumen/${detail["ijazahFile"]}`} rounded onClick={showImage} />
                      <Form >
                        <Form.Check
                          custom
                          type="checkbox"
                          id="IJAZAH"
                          label="IJAZAH"
                          defaultChecked={detail.ijazahFile}
                          onChange={verifyDoc}
                          disabled={confirmed.cekBiodata ? true : false}
                        />
                      </Form>
                    </div> : null}
                  {requirement.some(item => item.name === "skesFile") ? detail.prasyarat.includes('\"SKES\"') &&
                    <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                      <Image className="pointer" height="50" src={detail.skesFile && `${REST_URL}/upload/dokumen/${detail["skesFile"]}`} rounded onClick={showImage} />
                      <Form >
                        <Form.Check
                          custom
                          type="checkbox"
                          id="SKES"
                          label="SKES"
                          defaultChecked={detail.skesFile}
                          onChange={verifyDoc}
                          disabled={confirmed.cekBiodata ? true : false}
                        />
                      </Form>
                    </div> : null}
                  {requirement.some(item => item.name === "bstFile") ? detail.prasyarat.includes('\"BST\"') &&
                    <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                      <Image className="pointer" height="50" src={detail.bstFile && `${REST_URL}/upload/dokumen/${detail["bstFile"]}`} rounded onClick={showImage} />
                      <Form >
                        <Form.Check
                          custom
                          type="checkbox"
                          id="BST"
                          label="BST"
                          defaultChecked={detail.bstFile}
                          onChange={verifyDoc}
                          disabled={confirmed.cekBiodata ? true : false}
                        />
                      </Form>
                    </div> : null}
                  {requirement.some(item => item.name === "affFile") ? detail.prasyarat.includes('\"AFF\"') &&
                    <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                      <Image className="pointer" height="50" src={detail.affFile && `${REST_URL}/upload/dokumen/${detail["affFile"]}`} rounded onClick={showImage} />
                      <Form >
                        <Form.Check
                          custom
                          type="checkbox"
                          id="AFF"
                          label="AFF"
                          defaultChecked={detail.affFile}
                          onChange={verifyDoc}
                          disabled={confirmed.cekBiodata ? true : false}
                        />
                      </Form>
                    </div> : null}
                  {requirement.some(item => item.name === "mfaFile") ? detail.prasyarat.includes('\"MFA\"') &&
                    <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                      <Image className="pointer" height="50" src={detail.mfaFile && `${REST_URL}/upload/dokumen/${detail["mfaFile"]}`} rounded onClick={showImage} />
                      <Form >
                        <Form.Check
                          custom
                          type="checkbox"
                          id="MFA"
                          label="MFA"
                          defaultChecked={detail.mfaFile}
                          onChange={verifyDoc}
                          disabled={confirmed.cekBiodata ? true : false}
                        />
                      </Form>
                    </div> : null}
                </Row>
                <br />
                <Form.Check
                  custom
                  type="checkbox"
                  id="cekPembayaran"
                  label="Bukti pembayaran telah diterima dan sesuai"
                  checked={confirmed.cekPembayaran}
                  onChange={onChange}
                />
                <Row>
                  <div style={{ border: 'solid 1px black', minWidth: "120px", alignItems: "center" }} className="px-1 py-1 mx-3 my-3">
                    <Image className="pointer" height="50" src={detail.buktiPembayaran && `${REST_URL}/upload/pembayaran/${detail.buktiPembayaran}`} onClick={detail.buktiPembayaran && showImage} />
                    <Form>
                      <Form.Check
                        custom
                        type="checkbox"
                        id="transfer"
                        label="Transfer"
                        defaultChecked={confirmed.cekPembayaran}
                        disabled
                      />
                    </Form>
                  </div>
                </Row>
                <br />
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  id="note"
                  label="note"
                  defaultValue={confirmed.note}
                  rows={3}
                />
                <Button className="mt-2 float-right" type="submit">Simpan</Button>
              </Form>
            </Col>
          </Row>
        </Col>
        <br />
        <Col>
          {enlarge && <Image src={enlarge} width="100%" rounded />}
        </Col>
      </Modal.Body>

      <Modal.Footer className="justify-content-between">
        <Col>
          <i className="text-danger">*klik pada gambar untuk melihat lebih besar</i><br />
          <i className="text-danger">**uncheck untuk menghapus gambar</i>
        </Col>
      </Modal.Footer>
    </Modal >
  )
}
