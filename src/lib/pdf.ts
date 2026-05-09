import jsPDF from 'jspdf';
import type { Carrier, Photo } from './api';

function split(doc: jsPDF, text: string, width: number) { return doc.splitTextToSize(text || '-', width); }

export function exportCarriersPdf(carriers: Carrier[], photosByCarrier: Record<number, Photo[]>) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const generated = new Date().toLocaleString('pl-PL');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Repetytorium POS', 20, 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Eksport nośników: ${carriers.length}`, 20, 55);
  doc.text(`Data wygenerowania: ${generated}`, 20, 65);

  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Spis treści', 20, 25);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  carriers.forEach((c, idx) => doc.text(`${idx + 1}. ${c.own_name} (${c.public_id})`, 24, 38 + idx * 7));

  carriers.forEach((c, index) => {
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(c.own_name, 15, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID: ${c.public_id}`, 15, 26);
    doc.text(`Model: ${c.store_model_name}`, 15, 32);
    doc.text(`Kategoria: ${c.category_name}`, 15, 38);

    doc.setDrawColor(210);
    doc.line(15, 43, 195, 43);

    doc.setFont('helvetica', 'bold');
    doc.text('Dane opisowe i techniczne', 15, 53);
    doc.setFont('helvetica', 'normal');
    const left = [
      `Nazwa magazynowa: ${c.warehouse_name || '-'}`,
      `Wymiary: ${c.width} × ${c.height} × ${c.depth} ${c.unit}`,
      `Tagi: ${c.tags.map(t => t.name).join(', ') || '-'}`,
      'Opis:',
      ...(split(doc, c.description, 82) as string[])
    ];
    left.forEach((line, i) => doc.text(line, 15, 63 + i * 6));

    const photos = (photosByCarrier[c.id] || []).slice(0, 3);
    doc.setFont('helvetica', 'bold');
    doc.text('Zdjęcia przypisane po tagach', 110, 53);
    doc.setFont('helvetica', 'normal');
    photos.forEach((p, i) => {
      const y = 60 + i * 67;
      if (p.data_url) {
        try { doc.addImage(p.data_url, 'JPEG', 110, y, 75, 50, undefined, 'FAST'); } catch { try { doc.addImage(p.data_url, 'PNG', 110, y, 75, 50, undefined, 'FAST'); } catch {} }
      }
      doc.rect(110, y, 75, 50);
      doc.setFontSize(8);
      doc.text(split(doc, p.description || p.file_name, 75), 110, y + 55);
      doc.setFontSize(10);
    });
    if (photos.length === 0) doc.text('Brak zdjęć z pasującymi tagami.', 110, 62);

    doc.setFontSize(8);
    doc.text(`Strona ${index + 3} · ${generated}`, 15, 287);
  });

  doc.save(`repetytorium-pos-${new Date().toISOString().slice(0,10)}.pdf`);
}
