import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Register() {
  const { addMemberDirect, login, sports } = useContext(AppContext);
  const navigate = useNavigate();

  // Multi-step registration wizard states
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    sport: 'Football',
    tier: 'Individual'
  });
  
  const [otp, setOtp] = useState('');
  const [cardData, setCardData] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        setError('Please fill in all details.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      // Simulate sending OTP
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== '1234' && otp.length > 0) {
      // Allow any 4 digit or mock 1234
    }
    if (!otp) {
      setError('Please enter the 4-digit code.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4); // Move to payment
    }, 1000);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    if (!cardData.cardNumber || !cardData.expiry || !cardData.cvv) {
      setError('Please complete all card details.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      // Save member to database state
      addMemberDirect(formData);
      
      // Login as this member automatically
      login('member', formData.email, formData.name);
      
      setStep(5); // Activated success screen
    }, 1500);
  };

  const getTierPrice = () => {
    if (formData.tier === 'Individual') return '$50 / Month';
    if (formData.tier === 'Junior') return '$35 / Month';
    return '$120 / Month';
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-darkest" style={{ background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, var(--bg-darkest) 70%)' }}>
      <div className="container px-4 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            
            {/* Logo */}
            <div className="text-center mb-4">
              <i className="bi bi-activity text-gradient-accent display-4"></i>
              <h2 className="mt-2 text-white fw-bold tracking-tight">ElitePlay</h2>
              <p className="text-muted small">Create Your Sports Club Account</p>
            </div>

            {/* Stepper Indicators */}
            <div className="d-flex justify-content-between mb-4 px-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="d-flex align-items-center">
                  <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${step === s ? 'bg-gradient-primary text-white' : step > s ? 'bg-success text-white' : 'bg-secondary text-muted'}`} style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                    {step > s ? <i className="bi bi-check"></i> : s}
                  </div>
                  {s < 5 && <div className="bg-secondary" style={{ width: '30px', height: '2px', opacity: 0.2, margin: '0 4px' }}></div>}
                </div>
              ))}
            </div>

            {/* Wizard Card */}
            <div className="glass-panel p-4 p-md-5 animate-fade-in shadow-lg">
              {error && (
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 text-center small mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
                </div>
              )}

              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div>
                  <h4 className="text-white mb-4">Step 1: Enter Personal Details</h4>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Full Name</label>
                    <input type="text" name="name" className="form-control form-control-custom" placeholder="John Doe" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Email Address</label>
                    <input type="email" name="email" className="form-control form-control-custom" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Phone Number</label>
                    <input type="text" name="phone" className="form-control form-control-custom" placeholder="9876543210" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-muted small">Password</label>
                    <input type="password" name="password" className="form-control form-control-custom" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                  </div>
                  <button className="btn btn-primary-custom w-100 py-2.5" onClick={handleNextStep}>
                    Next Step <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              )}

              {/* STEP 2: Choose Sport and Tier */}
              {step === 2 && (
                <div>
                  <h4 className="text-white mb-4">Step 2: Club & Membership Details</h4>
                  <div className="mb-3">
                    <label className="form-label text-muted small">Choose Sport/Team</label>
                    <select name="sport" className="form-select form-select-custom" value={formData.sport} onChange={handleInputChange}>
                      {sports.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-muted small">Membership Tier</label>
                    <select name="tier" className="form-select form-select-custom" value={formData.tier} onChange={handleInputChange}>
                      <option value="Individual">Individual - Full Access ($50/mo)</option>
                      <option value="Junior">Junior - Under-18s ($35/mo)</option>
                      <option value="Family/Group">Family/Group - Multi-linked ($120/mo)</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-secondary-custom flex-grow-1 py-2.5" onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button className="btn btn-primary-custom flex-grow-1 py-2.5" onClick={handleNextStep}>
                      Next Step <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: OTP Verification */}
              {step === 3 && (
                <form onSubmit={handleVerifyOtp}>
                  <h4 className="text-white mb-2">Step 3: Verification</h4>
                  <p className="text-muted small mb-4">We've sent a mock 4-digit code to {formData.phone || 'your phone'}. Enter code below (Use code <strong>1234</strong> to skip).</p>
                  <div className="mb-4">
                    <label className="form-label text-muted small">Enter OTP Verification Code</label>
                    <input type="text" maxLength="4" className="form-control form-control-custom text-center fs-3 tracking-widest" placeholder="0 0 0 0" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary-custom flex-grow-1 py-2.5" onClick={() => setStep(2)}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary-custom flex-grow-1 py-2.5" disabled={loading}>
                      {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'Verify'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: Membership Fee Payment */}
              {step === 4 && (
                <form onSubmit={handlePayment}>
                  <h4 className="text-white mb-2">Step 4: Membership Payment</h4>
                  <p className="text-muted small mb-4">Pay membership fee to activate full account access. Tier: <strong>{formData.tier}</strong></p>
                  
                  <div className="bg-dark p-3 rounded-3 mb-4 border border-secondary border-opacity-20 d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Amount Due:</span>
                    <span className="fs-4 fw-bold text-white">{getTierPrice()}</span>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small">Dummy Card Number</label>
                    <input type="text" className="form-control form-control-custom" placeholder="4111 2222 3333 4444" value={cardData.cardNumber} onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})} />
                  </div>
                  <div className="row mb-4">
                    <div className="col-6">
                      <label className="form-label text-muted small">Expiry Date</label>
                      <input type="text" className="form-control form-control-custom" placeholder="MM/YY" value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-muted small">CVV</label>
                      <input type="password" maxLength="3" className="form-control form-control-custom" placeholder="•••" value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value})} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary-custom w-100 py-2.5" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : `Pay & Activate Membership`}
                  </button>
                </form>
              )}

              {/* STEP 5: Success & Redirection */}
              {step === 5 && (
                <div className="text-center">
                  <div className="badge-item active mx-auto mb-4" style={{ width: '90px', height: '90px' }}>
                    <i className="bi bi-patch-check-fill text-gradient-accent display-4"></i>
                  </div>
                  <h3 className="text-white mb-2">Membership Activated!</h3>
                  <p className="text-muted small mb-4">Congratulations {formData.name}, your account is active and you have been registered in the <strong>{formData.sport}</strong> division. Welcome to ElitePlay!</p>
                  
                  <button className="btn btn-primary-custom w-100 py-2.5" onClick={() => navigate('/member/dashboard')}>
                    Go to Member Dashboard <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              )}

              {step < 5 && (
                <p className="text-muted text-center mt-4 mb-0 small">
                  Already have an account? <Link to="/login" style={{ color: 'var(--color-secondary)', textDecoration: 'none' }}>Log In</Link>
                </p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
