import { useState } from 'react';
import Tesseract from 'tesseract.js';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ ttc: '', vat: '', ht: '' });

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    const { data: { text } } = await Tesseract.recognize(file, 'eng');

    const totalMatch = text.match(/\d+[,.]?\d*\s?(EUR|€)/gi);
    let ttc = '', vat = '', ht = '';

    if (totalMatch) {
      const amounts = totalMatch.map(t => parseFloat(t.replace(/[^\d,.]/g, '').replace(',', '.')));
      if (amounts.length >= 2) {
        ttc = amounts[amounts.length - 1];
        vat = amounts[amounts.length - 2];
        ht = (ttc - vat).toFixed(2);
      }
    }

    setResults({ ttc, vat, ht });
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>SASU Expense Tracker</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleScan} disabled={loading || !file}>
        {loading ? 'Scanning...' : 'Scan & Extract VAT'}
      </button>
      <div style={{ marginTop: 20 }}>
        <p><strong>Total TTC:</strong> €{results.ttc}</p>
        <p><strong>VAT:</strong> €{results.vat}</p>
        <p><strong>HT:</strong> €{results.ht}</p>
      </div>
    </div>
  );
}

export default App;
