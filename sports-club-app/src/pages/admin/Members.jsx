import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';

export default function Members() {
  const { members, addMemberDirect, removeMember, sports } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sport, setSport] = useState('Football');
  const [tier, setTier] = useState('Individual');
  const [success, setSuccess] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    addMemberDirect({ name, email, phone, sport, tier });
    setName('');
    setEmail('');
    setPhone('');
    setSuccess('New member added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Member Directory Management</h2>
      <p className="text-muted small mb-4">Search, add, or remove members from the athletic registry database.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small">
          {success}
        </div>
      )}

      <div className="row g-4 align-items-stretch">
        {/* Left: Add Member Form */}
        <div className="col-12 col-lg-4 d-flex">
          <div className="glass-panel p-4 shadow w-100 d-flex flex-column justify-content-between">
            <h5 className="text-white mb-3">Add New Member</h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-muted small">Name</label>
                <input type="text" className="form-control form-control-custom" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Email</label>
                <input type="email" className="form-control form-control-custom" placeholder="name@domain.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Phone</label>
                <input type="text" className="form-control form-control-custom" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Sport Division</label>
                <select className="form-select form-select-custom" value={sport} onChange={e => setSport(e.target.value)}>
                  {sports.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label text-muted small">Subscription Tier</label>
                <select className="form-select form-select-custom" value={tier} onChange={e => setTier(e.target.value)}>
                  <option value="Individual">Individual ($50/mo)</option>
                  <option value="Junior">Junior ($35/mo)</option>
                  <option value="Family/Group">Family/Group ($120/mo)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary-custom w-100">
                Register Member
              </button>
            </form>
          </div>
        </div>

        {/* Right: Members List */}
        <div className="col-12 col-lg-8 d-flex">
          <div className="glass-panel p-4 shadow w-100 d-flex flex-column" style={{ minHeight: '450px' }}>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
              <h5 className="text-white m-0">Registered Roster ({filteredMembers.length})</h5>
              <input 
                type="text" 
                className="form-control form-control-custom w-100 w-sm-50" 
                placeholder="Search by name, email, sport..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-custom align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email / Phone</th>
                    <th>Sport</th>
                    <th>Tier / Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr key={m.id}>
                      <td className="fw-semibold text-white">{m.name}</td>
                      <td>
                        <div className="small text-white">{m.email}</div>
                        <div className="small text-muted">{m.phone}</div>
                      </td>
                      <td>
                        <span className="badge bg-dark text-info border border-info border-opacity-25">{m.sport}</span>
                      </td>
                      <td>
                        <div className="small text-warning">{m.tier}</div>
                        <span className={`badge rounded-pill ${m.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`} style={{ fontSize: '0.65rem' }}>
                          {m.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeMember(m.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
