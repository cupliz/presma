import React from 'react'
import { useSelector } from 'react-redux'
import { Card } from 'react-bootstrap'

import { formatRibuan } from 'helpers/index'

export default () => {
  const jadwalTerpilih = useSelector(state => state.jadwalTerpilih)
  const pelatihanTerpilih = useSelector(state => state.pelatihanTerpilih)
  const biodataPeserta = useSelector(state => state.biodataPeserta)

  return (
    <div className='p-0 '>
      {pelatihanTerpilih.id && jadwalTerpilih.id ?
        <Card>
          <Card.Body>
            <span>Program yang telah anda pilih:</span>
            <hr />
            <label>Kelas: </label><span className='float-right text-primary'>{pelatihanTerpilih.nama}</span> <br />
            <label>Biaya: </label><span className='float-right text-primary'>{formatRibuan(pelatihanTerpilih.biaya) || 0}</span> <br />
            <label>Waktu: </label><span className='float-right text-primary'>{jadwalTerpilih.tanggal}</span> <br />
          </Card.Body>
        </Card>
        : null}
      {biodataPeserta.id ?
        <Card className="mt-4 mb-4">
          <Card.Body>
            <span>Detail Peserta:</span>
            <hr />
            <label>Nama: </label><span className='float-right text-primary capitalize'>{biodataPeserta.nama || ''}</span> <br />
            <label>Email: </label><span className='float-right text-primary'>{biodataPeserta.email || ''}</span> <br />
            <label>Handphone: </label><span className='float-right text-primary'>{biodataPeserta.phone || ''}</span> <br />
          </Card.Body>
        </Card>
        : null}
    </div>
  )
}