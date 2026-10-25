import { jsPDF } from 'jspdf';
import { Share } from '@capacitor/share';

export interface CertificateData {
  readerName: string;
  completionDate: string;
  totalChapters?: number;
  totalVerses?: number;
}

export function generateCertificatePDF(data: CertificateData): jsPDF {
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const width = 210;
  const height = 297;

  // 1. Warm ivory paper background (#F7F0E3)
  doc.setFillColor(247, 240, 227);
  doc.rect(0, 0, width, height, 'F');

  // 2. Fine antique-gold ornamental double border (#B18A42)
  doc.setDrawColor(177, 138, 66);
  doc.setLineWidth(1.5);
  doc.rect(12, 12, width - 24, height - 24);

  doc.setLineWidth(0.5);
  doc.rect(15, 15, width - 30, height - 30);

  // Corner ornaments
  const corners = [
    { x: 15, y: 15 },
    { x: width - 15, y: 15 },
    { x: 15, y: height - 15 },
    { x: width - 15, y: height - 15 },
  ];

  for (const c of corners) {
    doc.setDrawColor(199, 106, 36); // saffron touch
    doc.setLineWidth(0.8);
    doc.circle(c.x, c.y, 4);
    doc.setFillColor(177, 138, 66);
    doc.circle(c.x, c.y, 1.5, 'F');
  }

  // 3. Header motif & App Branding
  doc.setTextColor(30, 58, 47); // Forest green #1E3A2F
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('GITAQUEST', width / 2, 38, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('times', 'italic');
  doc.setTextColor(177, 138, 66); // Antique gold
  doc.text('Read. Reflect. Grow.', width / 2, 44, { align: 'center' });

  // Divider line with diamond
  doc.setDrawColor(177, 138, 66);
  doc.setLineWidth(0.4);
  doc.line(width / 2 - 40, 48, width / 2 + 40, 48);
  doc.setFillColor(199, 106, 36);
  doc.circle(width / 2, 48, 1.2, 'F');

  // 4. Sanskrit Invocation
  doc.setTextColor(52, 41, 31);
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text('OM SRI KRISHNARPANAMASTU', width / 2, 60, { align: 'center' });

  // 5. Title
  doc.setTextColor(177, 138, 66); // Antique gold
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text('CERTIFICATE OF COMPLETION', width / 2, 78, { align: 'center' });

  // Subtitle
  doc.setTextColor(80, 65, 50);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.text('The Bhagavad Gita Reading Journey', width / 2, 88, { align: 'center' });

  // 6. Presentation Line
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90, 80, 70);
  doc.text('This is respectfully presented to', width / 2, 108, { align: 'center' });

  // 7. Reader's Name
  doc.setTextColor(52, 41, 31); // Deep brown
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  const displayName = data.readerName?.trim() || 'Devoted Seeker';
  doc.text(displayName, width / 2, 122, { align: 'center' });

  // Underline beneath name
  doc.setDrawColor(177, 138, 66);
  doc.setLineWidth(0.6);
  const nameWidth = doc.getTextWidth(displayName);
  const lineStart = Math.max(30, width / 2 - nameWidth / 2 - 10);
  const lineEnd = Math.min(width - 30, width / 2 + nameWidth / 2 + 10);
  doc.line(lineStart, 126, lineEnd, 126);

  // 8. Sacred Commendation Message
  doc.setFont('times', 'normal');
  doc.setFontSize(11.5);
  doc.setTextColor(52, 41, 31);

  const messageLines = [
    'for faithfully reading, reflecting upon, and completing all 18 sacred chapters',
    'and 701 divine verses of the Srimad Bhagavad Gita.',
    '',
    'Through steadfast dedication, inquiry, and personal contemplation,',
    'you have honored the eternal dialogue of Dharma, Wisdom, and Devotion.',
    'May the timeless teachings of Lord Krishna continue to illuminate your path,',
    'bringing enduring peace, equanimity, and clarity to every action.',
  ];

  let currentY = 142;
  for (const line of messageLines) {
    if (line) {
      doc.text(line, width / 2, currentY, { align: 'center' });
    }
    currentY += 6.5;
  }

  // 9. Milestone Badge Box
  doc.setDrawColor(177, 138, 66);
  doc.setLineWidth(0.4);
  doc.setFillColor(255, 252, 247);
  doc.roundedRect(width / 2 - 50, 196, 100, 24, 2, 2, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(177, 138, 66);
  doc.text('18 CHAPTERS  *  701 VERSES COMPLETED', width / 2, 207, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(119, 123, 86);
  doc.text('Sanskrit Original  *  Hindi Meaning  *  English Translation', width / 2, 214, { align: 'center' });

  // 10. Date and Seal
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 70, 60);

  const dateStr = data.completionDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Completed on: ${dateStr}`, width / 2, 235, { align: 'center' });

  // Seal / Emblem
  doc.setDrawColor(177, 138, 66);
  doc.setLineWidth(1);
  doc.circle(width / 2, 256, 12);
  doc.setLineWidth(0.3);
  doc.circle(width / 2, 256, 10.5);

  doc.setFont('times', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(177, 138, 66);
  doc.text('GITA SADHANA', width / 2, 255, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('COMPLETED', width / 2, 259, { align: 'center' });

  // 11. Integrity footnote
  doc.setFont('times', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(150, 140, 130);
  const footnote = 'This personal completion keepsake is issued offline by the Gita Sadhana mobile app to commemorate the reader\'s dedicated study of scripture.';
  doc.text(footnote, width / 2, 278, { align: 'center' });

  return doc;
}

export async function shareOrDownloadCertificate(data: CertificateData): Promise<void> {
  const doc = generateCertificatePDF(data);
  const safeName = (data.readerName || 'Seeker').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Gita_Sadhana_Certificate_${safeName}.pdf`;

  // Check if Capacitor Share is available
  try {
    const pdfDataUri = doc.output('datauristring');
    const canShare = await Share.canShare();
    if (canShare.value) {
      await Share.share({
        title: 'Gita Sadhana — Certificate of Completion',
        text: `I have completed reading the complete 18 chapters of the Bhagavad Gita on Gita Sadhana.`,
        url: pdfDataUri,
        dialogTitle: 'Share or Save Your Completion Certificate',
      });
      return;
    }
  } catch (e) {
    console.log('Native share unavailable or cancelled, falling back to local download', e);
  }

  // Fallback direct download
  doc.save(fileName);
}
