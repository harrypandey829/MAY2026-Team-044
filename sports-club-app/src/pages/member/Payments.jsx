import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Payments() {
  const { currentUser, payments, payInvoice } = useContext(AppContext);
  const myInvoices = payments.filter(p => p.memberId === currentUser?.id);
  const [success, setSuccess] = useState('');

  const handlePay = (invoiceId) => {
    payInvoice(invoiceId);
    setSuccess('Payment processed successfully! Your receipt is ready.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Fees & Account Invoices</h2>
      <p className="text-muted small mb-4">Review membership subscription schedules, make payments, and access download links for receipts.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          {success}
        </div>
      )}

      <div className="glass-panel p-4 shadow" style={{ minHeight: '350px' }}>
        <h5 className="text-white mb-4">Invoice Ledger</h5>
        {myInvoices.length === 0 ? (
          <div className="text-center py-5 text-muted">No transactions found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th>Invoice Code</th>
                  <th>Date Issued</th>
                  <th>Tier Type</th>
                  <th>Total Price</th>
                  <th>Payment Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="fw-semibold text-white">{inv.invoiceNo}</td>
                    <td className="text-muted small">{inv.date}</td>
                    <td className="text-muted small">{inv.tier} Membership</td>
                    <td className="fw-bold text-white">${inv.amount}</td>
                    <td>
                      <span className={`badge badge-custom ${inv.status === 'Paid' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-35' : 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-35'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="text-end">
                      {inv.status === 'Unpaid' ? (
                        <button className="btn btn-sm btn-primary-custom" onClick={() => handlePay(inv.id)}>
                          Pay Now
                        </button>
                      ) : (
                        <button 
                          className="btn btn-sm btn-outline-secondary" 
                          onClick={() => alert(`Receipt downloaded for ${inv.invoiceNo}.\nFee: $${inv.amount}.`)}
                        >
                          <i className="bi bi-download me-1"></i> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
