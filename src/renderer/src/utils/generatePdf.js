import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generatePdf = async ({
  nomorSurat,
  peminjam,
  eventName,
  purpose,
  totalUser,
  borrowStart,
  borrowEnd,
  items
}) => {
  const doc = new jsPDF('p', 'mm', 'a4')

  // HEADER
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')

  doc.text('INSTITUT SAINS DAN TEKNOLOGI TERPADU SURABAYA', 105, 20, { align: 'center' })

  doc.setFontSize(13)

  doc.text('LABORATORIUM KOMPUTER', 105, 28, { align: 'center' })

  doc.setLineWidth(0.5)

  doc.line(15, 35, 195, 35)

  // JUDUL
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')

  doc.text('SURAT PEMINJAMAN FASILITAS LABORATORIUM', 105, 45, { align: 'center' })

  // NOMOR
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  doc.text(`Nomor : ${nomorSurat}`, 15, 55)

  // DATA SURAT
  let y = 70

  doc.text(`Nama Peminjam`, 15, y)
  doc.text(`: ${peminjam}`, 60, y)

  y += 8

  doc.text(`Nama Kegiatan`, 15, y)
  doc.text(`: ${eventName}`, 60, y)

  y += 8

  doc.text(`Jumlah Peserta`, 15, y)
  doc.text(`: ${totalUser}`, 60, y)

  y += 8

  doc.text(`Mulai`, 15, y)
  doc.text(`: ${borrowStart}`, 60, y)

  y += 8

  doc.text(`Selesai`, 15, y)
  doc.text(`: ${borrowEnd}`, 60, y)

  y += 15

  // KEPERLUAN

  doc.setFont('helvetica', 'bold')

  doc.text('Keperluan:', 15, y)

  y += 8

  doc.setFont('helvetica', 'normal')

  const purposeText = doc.splitTextToSize(purpose, 170)

  doc.text(purposeText, 15, y)

  y += purposeText.length * 6 + 10

  // TABEL ITEM

  autoTable(doc, {
    startY: y,

    head: [['No', 'Jenis', 'Nama Item', 'Qty']],

    body: items.map((item, index) => [index + 1, item.item_type, item.item_name, item.quantity])
  })

  y = doc.lastAutoTable.finalY + 15

  // PARAGRAF PENUTUP

  doc.text(
    'Demikian surat peminjaman ini dibuat. Mohon fasilitas laboratorium dapat dipergunakan sesuai jadwal yang telah ditentukan.',
    15,
    y
  )

  y += 25

  doc.text(`Surabaya, ${new Date().toLocaleDateString('id-ID')}`, 140, y)

  y += 10

  doc.setFont('helvetica', 'bold')

  doc.text('Laboratorium Komputer', 140, y)

  // TANPA TTD
  y += 30

  doc.line(140, y, 190, y)

  y += 5

  doc.text('Administrator Laboratorium', 140, y)

  doc.save(`${nomorSurat}.pdf`)
}
