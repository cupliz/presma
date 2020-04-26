import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { IoIosCloseCircleOutline, IoIosCheckmarkCircleOutline } from 'react-icons/io'
import Papa from 'papaparse'
import dayjs from 'dayjs'

const REST_URL = process.env.REACT_APP_REST_URL
Papa.parsePromise = function (url) {
  return new Promise(function (complete, error) {
    Papa.parse(url, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete,
      error
    })
  })
}
const formatNumber = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
const agama = ['islam', 'katholik', 'protestan', 'hindu', 'budha', 'khong hu chu']
const defBio = {
  email: 'jack.hun@gmail.com',
  // phone: '1028319283',
  // ktp: '8129381923',
  // nisn: '9123819283',
  // nama: 'jack hun',
  // gender: 'pria',
  // warga: 'wni',
  // agama: 'katholik',
  // tempatLahir: 'surabaya',
  // tanggalLahir: '1988-02-23',
  // alamat: 'jl kenagan no.21',
  // ayah: 'joe',
  // ibu: 'melisa',
}

export default () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const jadwalTerpilih = useSelector(state => state.jadwalTerpilih)
  const pelatihanTerpilih = useSelector(state => state.pelatihanTerpilih)
  const [biodata, setBiodata] = useState(defBio)
  const [wilayah, setWilayah] = useState([])
  useEffect(() => {
    if (!jadwalTerpilih) {
      return history.push('/')
    }
    fetchWilayah()
  }, [])

  const fetchWilayah = async () => {
    console.log('fetchWilayah')
    const prov = await Papa.parsePromise('/wilayah/provinsi.csv')
    const kab = await Papa.parsePromise('/wilayah/kabupaten.csv')
    const kec = await Papa.parsePromise('/wilayah/kecamatan.csv')
    const kel = await Papa.parsePromise('/wilayah/kelurahan.csv')
    setWilayah({ provinsi: prov.data, kabupaten: kab.data, kecamatan: kec.data, kelurahan: kel.data })
  }
  const cekEmail = async () => {
    let { data } = await axios.get(`${REST_URL}/peserta?email=${biodata.email}`)
    if (data.length) {
      data[0].provinsi = null
      data[0].kabupaten = null
      data[0].kecamatan = null
      data[0].kelurahan = null
      setBiodata(Object.assign({}, data[0]))
    }
  }
  const onChange = async (e) => {
    const { name, value } = e.target
    biodata[name] = value
    setBiodata(Object.assign({}, biodata))
  }
  const onChangeDatepicker = (key, value) => {
    biodata[key] = dayjs(value).format('YYYY-MM-DD')
    setBiodata(Object.assign({}, biodata))
  }
  const onChangeWilayah = (key, value) => {
    biodata[key] = value
    setBiodata(Object.assign({}, biodata))
  }
  const getOptions = (key, value) => {
    if (key === 'kabupaten') {
      return wilayah.kabupaten.filter(r => r.provinsi === value.id)
    }
    if (key === 'kecamatan') {
      return wilayah.kecamatan.filter(r => r.kabupaten === value.id)
    }
    if (key === 'kelurahan') {
      return wilayah.kelurahan.filter(r => r.kecamatan === value.id)
    }
    return []
  }

  const submitBiodata = async (e) => {
    e.preventDefault()
    const bio = Object.assign({}, biodata)

    // if (!biodata.provinsi) { return toast.error('Provinsi harus diisi') }
    // if (!biodata.kabupaten) { return toast.error('Kabupaten harus diisi') }
    // if (!biodata.kecamatan) { return toast.error('Kecamatan harus diisi') }
    // if (!biodata.kelurahan) { return toast.error('Kelurahan harus diisi') }

    // bio.provinsi = biodata.provinsi.name
    // bio.kabupaten = biodata.kabupaten.name
    // bio.kecamatan = biodata.kecamatan.name
    // bio.kelurahan = biodata.kelurahan.name

    let { data } = await axios.post(`${REST_URL}/peserta`, bio)
    setBiodata(data)
  }
  const onChangeFileUpload = async (e) => {
    const { files, name } = e.target
    if (biodata.id && files[0]) {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('id', biodata.id)
      formData.append('name', name)
      const config = { headers: { 'content-type': 'multipart/form-data' } }
      const { status, data } = await axios.post(`${REST_URL}/peserta/upload`, formData, config)
      if (status === 200) {
        biodata[name] = data.filename
        setBiodata(Object.assign({}, biodata))
      }
    }
  }
  const nextStep = () => {
    console.log(biodata)
    // dispatch({ type: 'SET_BIODATA', data })
    // history.push('/pembayaran')
  }

  const req = {
    bstFile: pelatihanTerpilih.prasyarat.includes('BST'),
    ktpFile: pelatihanTerpilih.prasyarat.includes('KTP'),
    skesFile: pelatihanTerpilih.prasyarat.includes('SKES'),
    ijazahFile: pelatihanTerpilih.prasyarat.includes('IJAZAH'),
    akteFile: pelatihanTerpilih.prasyarat.includes('AKTE'),
    fotoFile: pelatihanTerpilih.prasyarat.includes('FOTO')
  }
  return (
    <div className='py-4'>
      <Container>
        <Row className='my-2'>
          <Col xs={12} sm={8}>
            <Form onSubmit={submitBiodata}>
              <Card className='p-0'>
                <Card.Header className='bg-primary text-white'><i className='fa fa-address-book' /> &nbsp; Data Peserta</Card.Header>
                <Card.Body>
                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> Email <span className='text-danger'>*</span></Form.Label>
                    <Col sm={4}><Form.Control size='sm' type='email' name='email' placeholder='alamat email' onChange={onChange} defaultValue={biodata.email || ''} required /></Col>
                    <Col sm={6}><Button size="sm" onClick={cekEmail}>Cek by Email</Button></Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> HP <span className='text-danger'>*</span></Form.Label>
                    <Col sm={4}><Form.Control size='sm' type='text' name='phone' placeholder='nomor handphone' onChange={onChange} defaultValue={biodata.phone || ''} required /></Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> ID KTP/NIK<span className='text-danger'>*</span></Form.Label>
                    <Col sm='9'><Form.Control size='sm' type='text' name='ktp' placeholder='nomor ktp (nik)' onChange={onChange} defaultValue={biodata.ktp || ''} required /></Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> NISN<span className='text-danger'>*</span></Form.Label>
                    <Col sm='9'><Form.Control size='sm' type='text' name='nisn' placeholder='nomor nisn' onChange={onChange} defaultValue={biodata.nisn || ''} required /></Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> Nama<span className='text-danger'>*</span></Form.Label>
                    <Col sm='9'><Form.Control size='sm' type='text' name='nama' placeholder='nama lengkap' onChange={onChange} defaultValue={biodata.nama || ''} required /></Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='3'> Jenis Kelamin<span className='text-danger'>*</span></Form.Label>
                    <Col sm='9'>
                      <div className='mb-3'>
                        <Form.Check inline type='radio' name='gender' value='pria' label='Pria' id='radio-pria' defaultChecked={biodata.gender === 'pria'} onChange={onChange} />
                        <Form.Check inline type='radio' name='gender' value='wanita' label='Wanita' id='radio-wanita' defaultChecked={biodata.gender === 'wanita'} onChange={onChange} />
                      </div>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> TTL<span className='text-danger'>*</span></Form.Label>
                    <Col sm={5}><Form.Control size='sm' name='tempatLahir' placeholder='tempat lahir' onChange={onChange} defaultValue={biodata.tempatLahir || ''} required /></Col>
                    <Col sm={4}><DatePicker
                      dateFormat="dd-MM-yyyy"
                      className='form-control form-control-sm'
                      selected={biodata.tanggalLahir ? dayjs(biodata.tanggalLahir)['$d'] : ''}
                      onChange={(date) => onChangeDatepicker('tanggalLahir', date)}
                    />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> Agama<span className='text-danger'>*</span></Form.Label>
                    <Col sm='5'>
                      <Form.Control size='sm' as='select' name='agama' onChange={onChange} value={biodata.agama || ''} required className='capitalize'>
                        <option value='' disabled>--Pilih Agama</option>
                        {agama.map((agm, i) => <option key={agm} value={agm}>{agm}</option>)}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='3'> Kewarganegaraan<span className='text-danger'>*</span></Form.Label>
                    <Col sm='9'>
                      <div className='mb-3'>
                        <Form.Check inline type='radio' name='warga' value='wni' label='WNI' id='radio-wni' checked={biodata.warga === 'wni'} onChange={onChange} />
                        <Form.Check inline type='radio' name='warga' value='wna' label='WNA' id='radio-wna' checked={biodata.warga === 'wna'} onChange={onChange} />
                      </div>
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> Alamat<span className='text-danger'>*</span></Form.Label>
                    <Col sm='9'><Form.Control size='sm' type='text' name='alamat' placeholder='nama jalan / no. rumah' onChange={onChange} defaultValue={biodata.alamat || ''} required /></Col>
                  </Form.Group>
                  {
                    wilayah.provinsi && <Form.Group as={Row}>
                      <Form.Label column='sm' sm='2'> Provinsi<span className='text-danger'>*</span></Form.Label>
                      <Col sm='9'>
                        <Select
                          className='p-0 form-control-sm custom-select'
                          placeholder='Pilih provinsi'
                          options={wilayah.provinsi}
                          value={[{ name: biodata.provinsi && biodata.provinsi.name }]}
                          onChange={e => onChangeWilayah('provinsi', e)}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                        />
                      </Col>
                    </Form.Group>
                  }
                  {
                    wilayah.kabupaten && biodata.provinsi && <Form.Group as={Row}>
                      <Form.Label column='sm' sm='2'> Kabupaten<span className='text-danger'>*</span></Form.Label>
                      <Col sm='9'>
                        <Select
                          className='p-0 form-control-sm custom-select'
                          placeholder='Pilih kabupaten'
                          options={getOptions('kabupaten', biodata.provinsi)}
                          value={[{ name: biodata.kabupaten && biodata.kabupaten.name }]}
                          onChange={(e) => onChangeWilayah('kabupaten', e)}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                        />
                      </Col>
                    </Form.Group>
                  }
                  {
                    wilayah.kecamatan && biodata.kabupaten && <Form.Group as={Row}>
                      <Form.Label column='sm' sm='2'> Kecamatan<span className='text-danger'>*</span></Form.Label>
                      <Col sm='9'>
                        <Select
                          className='p-0 form-control-sm custom-select'
                          placeholder='Pilih kecamatan'
                          options={getOptions('kecamatan', biodata.kabupaten)}
                          value={[{ name: biodata.kecamatan && biodata.kecamatan.name }]}
                          onChange={(e) => onChangeWilayah('kecamatan', e)}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                        />
                      </Col>
                    </Form.Group>
                  }
                  {
                    wilayah.kelurahan && biodata.kecamatan && <Form.Group as={Row}>
                      <Form.Label column='sm' sm='2'> Kelurahan<span className='text-danger'>*</span></Form.Label>
                      <Col sm='9'>
                        <Select
                          className='p-0 form-control-sm custom-select'
                          placeholder='Pilih kelurahan'
                          options={getOptions('kelurahan', biodata.kecamatan)}
                          value={[{ name: biodata.kelurahan && biodata.kelurahan.name }]}
                          onChange={(e) => onChangeWilayah('kelurahan', e)}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                        />
                      </Col>
                    </Form.Group>
                  }
                  {
                    biodata.kelurahan && <Form.Group as={Row}>
                      <Form.Label column='sm' sm='2'> RT/RW <span className='text-danger'>*</span></Form.Label>
                      <Col sm={4}><Form.Control type='number' size='sm' name='rt' placeholder='rt' onChange={onChange} defaultValue={biodata.rt || ''} required /></Col>
                      <Col sm={4}><Form.Control type='number' size='sm' name='rw' placeholder='rw' onChange={onChange} defaultValue={biodata.rw || ''} required /></Col>
                    </Form.Group>
                  }
                  {
                    biodata.rt && biodata.rw && <Form.Group as={Row}>
                      <Form.Label column='sm' sm='2'> Kodepos <span className='text-danger'>*</span></Form.Label>
                      <Col sm={5}><Form.Control size='sm' name='kodepos' placeholder='kodepos' onChange={onChange} defaultValue={biodata.kodepos || ''} required /></Col>
                    </Form.Group>
                  }

                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> Ayah<span className='text-danger'>*</span></Form.Label>
                    <Col sm={4}><Form.Control type='text' size='sm' name='ayah' placeholder='nama ayah' onChange={onChange} defaultValue={biodata.ayah || ''} required /></Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column='sm' sm='2'> Ibu<span className='text-danger'>*</span></Form.Label>
                    <Col sm={4}><Form.Control type='text' size='sm' name='ibu' placeholder='nama ibu' onChange={onChange} defaultValue={biodata.ibu || ''} required /></Col>
                  </Form.Group>
                  <Button variant='primary' className='float-right' type="submit">{biodata.id ? 'Update' : 'Simpan'}</Button>
                </Card.Body>
              </Card>
            </Form>
            {biodata.id &&
              <Card className='mt-4'>
                <Card.Body>
                  {req.bstFile &&
                    <Form.Group as={Row}>
                      <Col md={11}>
                        <Form.File type="file" name="bstFile" onChange={onChangeFileUpload} custom
                          label={biodata.bstFile ? biodata.bstFile : 'Upload sertifikat BST'} />
                      </Col>
                      <Col md={1}>
                        <big className="mt-2" >{biodata.bstFile ?
                          <IoIosCheckmarkCircleOutline className="text-success" />
                          : <IoIosCloseCircleOutline className="text-danger" />}</big>
                      </Col>
                    </Form.Group>}
                  {req.ktpFile &&
                    <Form.Group as={Row}>
                      <Col md={11}>
                        <Form.File type="file" name="ktpFile" onChange={onChangeFileUpload} custom
                          label={biodata.ktpFile ? biodata.ktpFile : 'Upload KTP'} />
                      </Col>
                      <Col md={1}>
                        <big className="mt-2" >{biodata.ktpFile ?
                          <IoIosCheckmarkCircleOutline className="text-success" />
                          : <IoIosCloseCircleOutline className="text-danger" />}</big>
                      </Col>
                    </Form.Group>}
                  {req.skesFile &&
                    <Form.Group as={Row}>
                      <Col md={11}>
                        <Form.File type="file" name="skesFile" onChange={onChangeFileUpload} custom
                          label={biodata.skesFile ? biodata.skesFile : 'Upload FC Surat Keterangan Sehat dari Rumah Sakit yang ditunjuk oleh Dirjen Hubla'} />
                      </Col>
                      <Col md={1}>
                        <big className="mt-2" >{biodata.skesFile ?
                          <IoIosCheckmarkCircleOutline className="text-success" />
                          : <IoIosCloseCircleOutline className="text-danger" />}</big>
                      </Col>
                    </Form.Group>}
                  {req.ijazahFile &&
                    <Form.Group as={Row}>
                      <Col md={11}>
                        <Form.File type="file" name="ijazahFile" onChange={onChangeFileUpload} custom
                          label={biodata.ijazahFile ? biodata.ijazahFile : 'Upload FC Ijazah Umum legalisir'} />
                      </Col>
                      <Col md={1}>
                        <big className="mt-2" >{biodata.ijazahFile ?
                          <IoIosCheckmarkCircleOutline className="text-success" />
                          : <IoIosCloseCircleOutline className="text-danger" />}</big>
                      </Col>
                    </Form.Group>}
                  {req.akteFile &&
                    <Form.Group as={Row}>
                      <Col md={11}>
                        <Form.File type="file" name="akteFile" onChange={onChangeFileUpload} custom
                          label={biodata.akteFile ? biodata.akteFile : 'Upload FC Akta kelahiran'} />
                      </Col>
                      <Col md={1}>
                        <big className="mt-2" >{biodata.akteFile ?
                          <IoIosCheckmarkCircleOutline className="text-success" />
                          : <IoIosCloseCircleOutline className="text-danger" />}</big>
                      </Col>
                    </Form.Group>}
                  {req.fotoFile &&
                    <Form.Group as={Row}>
                      <Col md={11}>
                        <Form.File type="file" name="fotoFile" onChange={onChangeFileUpload} custom
                          label={biodata.fotoFile ? biodata.fotoFile : 'Upload foto warna terbaru ukuran 3×4'} />
                      </Col>
                      <Col md={1}>
                        <big className="mt-2" >{biodata.fotoFile ?
                          <IoIosCheckmarkCircleOutline className="text-success" />
                          : <IoIosCloseCircleOutline className="text-danger" />}</big>
                      </Col>
                    </Form.Group>}

                  <Button variant='primary' className='float-right' onClick={nextStep}>Lanjutkan</Button>
                </Card.Body>
              </Card>
            }
          </Col>
          <Col xs={12} sm={4}>
            {pelatihanTerpilih && jadwalTerpilih ?
              <Card className='p-0'>
                <Card.Body>
                  <span>Program yang telah anda pilih:</span>
                  <hr />
                  <label>Kelas: </label><span className='float-right text-primary'>{pelatihanTerpilih.nama}</span> <br />
                  <label>Biaya: </label><span className='float-right text-primary'>{formatNumber(pelatihanTerpilih.biaya)}</span> <br />
                  <label>Waktu: </label><span className='float-right text-primary'>{jadwalTerpilih.tanggal}</span> <br />
                </Card.Body>
              </Card>
              : null}
          </Col>
        </Row>
      </Container>
    </div>
  )
}
