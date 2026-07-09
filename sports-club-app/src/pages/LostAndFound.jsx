import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function LostAndFound() {
  const { lostAndFound, reportItem } = useContext(AppContext);
  
  const [itemName, setItemName] = useState('');
  const [type, setType] = useState('Lost'); // 'Lost' or 'Found'
  const [contact, setContact] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName || !contact) {
      alert('Please fill out all fields.');
      return;
    }
    reportItem(itemName, type, contact);
    setItemName('');
    setContact('');
    setSuccess('Report submitted successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Lost & Found Directory</h2>
      <p className="text-muted small mb-4">Report lost items or claim items found on the training grounds (Water Bottles, Shoes, Jerseys, Watches).</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          <i className="bi bi-check-circle-fill me-2"></i>{success}
        </div>
      )}

      <div className="row g-4">
        {/* Report Form */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 animate-fade-in shadow-lg">
            <h5 className="text-white mb-4"><i className="bi bi-flag-fill text-primary me-2"></i>File a Report</h5>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">Item Name & Description</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  placeholder="e.g. Nike blue water bottle, Watch, Red jersey..." 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Report Type</label>
                <select 
                  className="form-select form-select-custom" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Lost">I Lost This Item</option>
                  <option value="Found">I Found This Item</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">Your Phone / Email (Contact info)</label>
                <input 
                  type="text" 
                  className="form-control form-control-custom" 
                  placeholder="9876543210 or email" 
                  value={contact} 
                  onChange={(e) => setContact(e.target.value)} 
                />
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2.5">
                Submit Report
              </button>
            </form>
          </div>
        </div>

        {/* Directory List */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 animate-fade-in shadow-lg" style={{ minHeight: '400px' }}>
            <h5 className="text-white mb-4"><i className="bi bi-list-stars text-secondary me-2"></i>Recent Reports</h5>
            
            {lostAndFound.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-clipboard-x fs-1"></i>
                <p className="mt-2">No lost or found items reported yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom align-middle">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Item Description</th>
                      <th>Reported By</th>
                      <th>Date</th>
                      <th>Contact Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lostAndFound.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className={`badge badge-custom ${item.type === 'Lost' ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-30' : 'bg-success bg-opacity-10 text-success border border-success border-opacity-30'}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="fw-semibold text-white">{item.itemName}</td>
                        <td className="text-muted small">{item.reporterName}</td>
                        <td className="text-muted small">{item.date}</td>
                        <td>
                          <span className="small text-info">{item.contact}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
