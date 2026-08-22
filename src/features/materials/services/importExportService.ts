import { MaterialImportRow, MaterialProduct } from '../types/materialTypes';

export class ImportExportService {
  /**
   * Parse CSV text string to array of MaterialImportRow
   */
  public static parseCsv(csvText: string): MaterialImportRow[] {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());
    const items: MaterialImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Regex handling quoted commas
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
      const cleanVals = values.map((v) => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

      const rowObj: any = {};
      headers.forEach((h, idx) => {
        rowObj[h] = cleanVals[idx] || '';
      });

      if (rowObj.name || rowObj.title) {
        items.push({
          name: rowObj.name || rowObj.title || 'Untitled Item',
          category: rowObj.category || 'GLS',
          price: parseFloat(rowObj.price || rowObj['price (inr)']) || 100,
          original_price: parseFloat(rowObj.original_price || rowObj['original price']) || 150,
          stock: parseInt(rowObj.stock || rowObj.quantity) || 20,
          sku: rowObj.sku || `CSE-${Date.now().toString().slice(-4)}`,
          description: rowObj.description || 'Quality lab apparatus item.',
          image_url: rowObj.image_url || rowObj.image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop',
          gallery: rowObj.gallery || '',
          specification: rowObj.specification || '',
          includes: rowObj.includes || '',
          safety: rowObj.safety || '',
        });
      }
    }

    return items;
  }

  /**
   * Generate downloadable sample CSV template
   */
  public static downloadSampleTemplate() {
    const headers = [
      'Name',
      'Category',
      'Price',
      'Original_Price',
      'Stock',
      'SKU',
      'Description',
      'Image_URL',
      'Specification',
      'Safety',
    ];

    const sampleRows = [
      [
        '"Borosilicate Beaker 250ml"',
        '"GLS"',
        '120',
        '160',
        '50',
        '"CSE-GLS-101"',
        '"High quality graduated glass beaker with spout for easy pouring."',
        '"https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop"',
        '"Borosilicate 3.3 Glass ISO 3819"',
        '"Wear heat safety gloves."',
      ],
      [
        '"Arduino Nano Microcontroller V3"',
        '"KIT"',
        '350',
        '450',
        '40',
        '"CSE-KIT-202"',
        '"ATmega328P based compact microcontroller board for robotics experiments."',
        '"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop"',
        '"16MHz clock, 8 Analog inputs, Mini USB"',
        '"Do not short 5V to GND."',
      ],
    ];

    const csvContent = [headers.join(','), ...sampleRows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cseel_lab_materials_sample_template.csv');
    link.setAttribute('data-skip-progress', 'true');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
