import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function ResourceBooking() {
  const { bookings, bookResource, cancelBooking, currentUser } = useContext(AppContext);
  
  const [resource, setResource] = useState('Badminton Court 1');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 - 11:00');
  const [success, setSuccess] = useState('');

  const resourcesList = [
    'Badminton Court 1',
    'Badminton Court 2',
    'Football Training Pitch A',
    'Football Match Pitch B',
    'Cricket Net Practice Lane 1',
    'Cricket Net Practice Lane 2',
    'Premium Tennis Court',
    'Indoor Gym Equipment Station'
  ];

  const timeSlotsList = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) {
      alert('Please select a booking date.');
      return;
    }
    
    // Check duplicate booking simulation
    const isBooked = bookings.some(b => b.resourceName === resource && b.date === date && b.timeSlot === timeSlot);
    if (isBooked) {
      alert('This slot is already reserved. Please select another slot.');
      return;
    }

    bookResource(resource, currentUser?.id || 'm1', date, timeSlot);
    setSuccess('Booking reserved successfully!');
    setDate('');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container-fluid py-4 px-md-5 text-light">
      <h2 className="mb-2 text-white">Facility & Equipment Booking</h2>
      <p className="text-muted small mb-4">Book badminton courts, football pitches, cricket nets, or gym equipment for private or team practice.</p>

      {success && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success rounded-3 p-3 mb-4 text-center small animate-fade-in">
          <i className="bi bi-check-circle-fill me-2"></i>{success}
        </div>
      )}

      <div className="row g-4">
        {/* Booking Form */}
        <div className="col-12 col-lg-4">
          <div className="glass-panel p-4 animate-fade-in shadow-lg">
            <h5 className="text-white mb-4"><i className="bi bi-calendar-plus text-primary me-2"></i>Reserve a Slot</h5>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">Select Resource</label>
                <select 
                  className="form-select form-select-custom" 
                  value={resource} 
                  onChange={(e) => setResource(e.target.value)}
                >
                  {resourcesList.map((res, i) => (
                    <option key={i} value={res}>{res}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Booking Date</label>
                <input 
                  type="date" 
                  className="form-control form-control-custom" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">Select Time Slot</label>
                <select 
                  className="form-select form-select-custom" 
                  value={timeSlot} 
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  {timeSlotsList.map((slot, i) => (
                    <option key={i} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary-custom w-100 py-2.5">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>

        {/* Bookings Directory */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 animate-fade-in shadow-lg" style={{ minHeight: '400px' }}>
            <h5 className="text-white mb-4"><i className="bi bi-journal-check text-secondary me-2"></i>Current Reservations</h5>
            
            {bookings.length === 0 ? (
              <div className="text-center text-muted py-5">
                <i className="bi bi-calendar-x fs-1"></i>
                <p className="mt-2">No facilities are currently booked.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom align-middle">
                  <thead>
                    <tr>
                      <th>Resource / Court</th>
                      <th>Booked By</th>
                      <th>Date</th>
                      <th>Time Slot</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, idx) => (
                      <tr key={idx}>
                        <td className="fw-semibold text-white">
                          <i className="bi bi-pin-angle-fill text-info me-2"></i>{booking.resourceName}
                        </td>
                        <td className="text-muted small">{booking.memberName}</td>
                        <td className="text-muted small">{booking.date}</td>
                        <td>
                          <span className="badge bg-secondary py-2" style={{ fontSize: '0.8rem' }}>{booking.timeSlot}</span>
                        </td>
                        <td className="text-end">
                          {(currentUser?.role === 'admin' || currentUser?.id === booking.memberId) && (
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => cancelBooking(booking.id)}
                              style={{ borderRadius: '6px' }}
                            >
                              Cancel
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
      </div>
    </div>
  );
}
