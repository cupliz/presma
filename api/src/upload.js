const fs = require('fs-extra')
const path = require('path')
const multer = require('multer')

exports.uploadPembayaran = multer({ dest: path.join(__dirname, '../upload/pembayaran') })
exports.uploadDokumen = multer({ dest: path.join(__dirname, '../upload/dokumen') })
exports.uploadPelatihan = multer({ dest: path.join(__dirname, '../upload/pelatihan') })
exports.processUploadedFile = async (req, name) => {
  const { destination, filename, originalname } = req.file
  const newName = `${name}.${originalname.split('.').pop()}`
  const srcpath = path.join(destination, filename)
  const dstpath = path.join(destination, newName)
  await fs.move(srcpath, dstpath, { overwrite: true })
  return newName
}