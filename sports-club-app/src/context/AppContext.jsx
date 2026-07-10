import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('elite_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('elite_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('elite_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Base Data States - Using local storage or defaults for persistent feel
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('elite_members');
    return saved ? JSON.parse(saved) : [
      { id: 'm1', name: 'Rahul Sharma', email: 'rahul@club.com', phone: '9876543210', role: 'member', status: 'Active', sport: 'Football', tier: 'Individual' },
      { id: 'm2', name: 'Aman Patel', email: 'aman@club.com', phone: '8765432109', role: 'member', status: 'Active', sport: 'Football', tier: 'Junior' },
      { id: 'm3', name: 'Priya Verma', email: 'priya@club.com', phone: '7654321098', role: 'member', status: 'Active', sport: 'Badminton', tier: 'Individual' },
      { id: 'm4', name: 'Rohan Gupta', email: 'rohan@club.com', phone: '6543210987', role: 'member', status: 'Pending', sport: 'Cricket', tier: 'Individual' }
    ];
  });

  const [coaches, setCoaches] = useState(() => {
    const saved = localStorage.getItem('elite_coaches');
    return saved ? JSON.parse(saved) : [
      { id: 'c1', name: 'Coach Alex', email: 'alex@club.com', phone: '9000000001', role: 'coach', specialty: 'Football' },
      { id: 'c2', name: 'Coach Sarah', email: 'sarah@club.com', phone: '9000000002', role: 'coach', specialty: 'Badminton' },
      { id: 'c3', name: 'Coach Mike', email: 'mike@club.com', phone: '9000000003', role: 'coach', specialty: 'Cricket' }
    ];
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('elite_teams');
    return saved ? JSON.parse(saved) : [
      { id: 't1', name: 'Red Devils FC', sport: 'Football', coachId: 'c1', membersCount: 2 },
      { id: 't2', name: 'Smashers Club', sport: 'Badminton', coachId: 'c2', membersCount: 1 },
      { id: 't3', name: 'Elite Cricketers', sport: 'Cricket', coachId: 'c3', membersCount: 0 }
    ];
  });

  const [sports, setSports] = useState(() => {
    const saved = localStorage.getItem('elite_sports');
    return saved ? JSON.parse(saved) : [
      { id: 's1', name: 'Football', description: 'Soccer training, league matches and tournaments.' },
      { id: 's2', name: 'Badminton', description: 'Singles and doubles practice and internal league matches.' },
      { id: 's3', name: 'Cricket', description: 'Net practice, T20 matches, and tournaments.' }
    ];
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('elite_events');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'e1', 
        title: 'Tactical Football Practice', 
        type: 'training', 
        sport: 'Football',
        date: '2026-07-10', 
        time: '15:00', 
        venue: 'Main Pitch A', 
        description: 'Warm-up drills, fitness exercises, and tactical match simulation.', 
        coachId: 'c1',
        responses: { 'm1': 'Attending', 'm2': 'Maybe' }
      },
      { 
        id: 'e2', 
        title: 'League Match: Elite FC vs Metro Club', 
        type: 'match', 
        sport: 'Football',
        date: '2026-07-12', 
        time: '18:00', 
        venue: 'City Arena', 
        description: 'Friendly competitive league clash. Kit: Home Blue.', 
        opponent: 'Metro Club',
        coachId: 'c1',
        responses: { 'm1': 'Attending', 'm2': 'Attending' }
      },
      { 
        id: 'e3', 
        title: 'Singles Knockout Tournament', 
        type: 'tournament', 
        sport: 'Badminton',
        date: '2026-07-14', 
        time: '10:00', 
        venue: 'Badminton Court 1 & 2', 
        description: 'Club championship qualifiers.', 
        coachId: 'c2',
        responses: { 'm3': 'Attending' }
      }
    ];
  });

  const [attendanceHistory, setAttendanceHistory] = useState(() => {
    const saved = localStorage.getItem('elite_attendance');
    return saved ? JSON.parse(saved) : [
      { id: 'a1', eventTitle: 'Fitness Boot Camp', date: '2026-07-06', sport: 'Football', records: { 'm1': 'Present', 'm2': 'Absent', 'm3': 'Present' } },
      { id: 'a2', eventTitle: 'Midweek Training', date: '2026-07-08', sport: 'Football', records: { 'm1': 'Present', 'm2': 'Present', 'm3': 'Present' } }
    ];
  });

  const [playerStats, setPlayerStats] = useState(() => {
    const saved = localStorage.getItem('elite_player_stats');
    return saved ? JSON.parse(saved) : {
      'm1': { matchesPlayed: 12, goals: 8, assists: 5, rating: 8.5, remarks: 'Superb pace and vision. Great finishes.' },
      'm2': { matchesPlayed: 10, goals: 1, assists: 2, rating: 7.1, remarks: 'Hard worker. Consistent defense, needs pass accuracy.' },
      'm3': { matchesPlayed: 15, goals: 14, assists: 0, rating: 9.2, remarks: 'Exceptional backhand smash. Dominant at the net.' }
    };
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('elite_bookings');
    return saved ? JSON.parse(saved) : [
      { id: 'b1', resourceName: 'Badminton Court 1', memberId: 'm3', memberName: 'Priya Verma', date: '2026-07-10', timeSlot: '14:00 - 15:00' },
      { id: 'b2', resourceName: 'Football Pitch B', memberId: 'm1', memberName: 'Rahul Sharma', date: '2026-07-11', timeSlot: '10:00 - 12:00' }
    ];
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('elite_announcements');
    return saved ? JSON.parse(saved) : [
      { id: 'an1', title: 'Monsoon Kit Distribution', content: 'New club training jerseys are available for pickup at the admin office.', author: 'Admin Team', date: '2026-07-08' },
      { id: 'an2', title: 'Schedule Update: Gym Facility', content: 'The club gym will be closed for maintenance on July 11th from 8 AM to 2 PM.', author: 'Admin Team', date: '2026-07-07' }
    ];
  });

  const [lostAndFound, setLostAndFound] = useState(() => {
    const saved = localStorage.getItem('elite_lost_found');
    return saved ? JSON.parse(saved) : [
      { id: 'lf1', itemName: 'Decathlon Water Bottle (Blue)', type: 'Lost', reporterName: 'Rahul Sharma', date: '2026-07-08', contact: '9876543210' },
      { id: 'lf2', itemName: 'Puma Court Shoes Size 9', type: 'Found', reporterName: 'Coach Sarah', date: '2026-07-09', contact: 'sarah@club.com' }
    ];
  });

  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('elite_badges');
    return saved ? JSON.parse(saved) : {
      'm1': ['Perfect Attendance', 'Top Scorer', 'MVP'],
      'm2': ['Most Improved Player'],
      'm3': ['MVP', 'Perfect Attendance']
    };
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('elite_payments');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', memberId: 'm1', memberName: 'Rahul Sharma', invoiceNo: 'INV-2026-001', tier: 'Individual', amount: 50, date: '2026-07-01', status: 'Paid' },
      { id: 'p2', memberId: 'm2', memberName: 'Aman Patel', invoiceNo: 'INV-2026-002', tier: 'Junior', amount: 35, date: '2026-07-02', status: 'Paid' },
      { id: 'p3', memberId: 'm3', memberName: 'Priya Verma', invoiceNo: 'INV-2026-003', tier: 'Individual', amount: 50, date: '2026-07-03', status: 'Paid' },
      { id: 'p4', memberId: 'm4', memberName: 'Rohan Gupta', invoiceNo: 'INV-2026-004', tier: 'Individual', amount: 50, date: '2026-07-05', status: 'Unpaid' }
    ];
  });

  const [feedback, setFeedback] = useState(() => {
    const saved = localStorage.getItem('elite_feedback');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', memberName: 'Priya Verma', trainingRating: 5, coachRating: 5, facilitiesRating: 4, comments: 'Sarah is an excellent coach!' },
      { id: 'f2', memberName: 'Rahul Sharma', trainingRating: 4, coachRating: 4, facilitiesRating: 4, comments: 'Session was very intensive.' }
    ];
  });

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('elite_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('elite_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('elite_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('elite_attendance', JSON.stringify(attendanceHistory));
  }, [attendanceHistory]);

  useEffect(() => {
    localStorage.setItem('elite_player_stats', JSON.stringify(playerStats));
  }, [playerStats]);

  useEffect(() => {
    localStorage.setItem('elite_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('elite_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('elite_lost_found', JSON.stringify(lostAndFound));
  }, [lostAndFound]);

  useEffect(() => {
    localStorage.setItem('elite_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('elite_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('elite_feedback', JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    localStorage.setItem('elite_coaches', JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    localStorage.setItem('elite_sports', JSON.stringify(sports));
  }, [sports]);

  // Auth Operations
  const login = (role, email, name = '') => {
    let resolvedUser = { role, email, name };
    if (role === 'admin') {
      resolvedUser.name = 'Admin Sumit';
    } else if (role === 'coach') {
      const coach = coaches.find(c => c.email === email) || coaches[0];
      resolvedUser = { ...coach };
    } else {
      const member = members.find(m => m.email === email) || members[0];
      resolvedUser = { ...member };
    }
    setCurrentUser(resolvedUser);
    localStorage.setItem('elite_user', JSON.stringify(resolvedUser));
    return resolvedUser;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('elite_user');
  };

  const updateProfile = (updatedData) => {
    setCurrentUser(prev => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('elite_user', JSON.stringify(newUser));
      return newUser;
    });

    if (currentUser.role === 'member') {
      setMembers(prev => prev.map(m => m.id === currentUser.id ? { ...m, ...updatedData } : m));
    } else if (currentUser.role === 'coach') {
      setCoaches(prev => prev.map(c => c.id === currentUser.id ? { ...c, ...updatedData } : c));
    }
  };

  // Admin Operations
  const approveMember = (memberId) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'Active' } : m));
    // Generate an invoice automatically upon approval
    const approvedMember = members.find(m => m.id === memberId);
    if (approvedMember) {
      const feeAmount = approvedMember.tier === 'Junior' ? 35 : approvedMember.tier === 'Family/Group' ? 120 : 50;
      const newInvoice = {
        id: 'p' + (payments.length + 1),
        memberId: approvedMember.id,
        memberName: approvedMember.name,
        invoiceNo: `INV-2026-00${payments.length + 1}`,
        tier: approvedMember.tier || 'Individual',
        amount: feeAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'Unpaid'
      };
      setPayments(prev => [...prev, newInvoice]);
    }
  };

  const removeMember = (memberId) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const addMemberDirect = (memberData) => {
    const newMember = {
      id: 'm' + (members.length + 1),
      status: 'Active',
      role: 'member',
      ...memberData
    };
    setMembers(prev => [...prev, newMember]);
    // Create team members count increment
    const team = teams.find(t => t.sport === memberData.sport);
    if (team) {
      setTeams(prev => prev.map(t => t.id === team.id ? { ...t, membersCount: t.membersCount + 1 } : t));
    }
  };

  const createTeam = (teamName, sport, coachId) => {
    const newTeam = {
      id: 't' + (teams.length + 1),
      name: teamName,
      sport,
      coachId,
      membersCount: 0
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const assignCoach = (teamId, coachId) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, coachId } : t));
  };

  const addAnnouncement = (title, content, author) => {
    const newAnn = {
      id: 'an' + (announcements.length + 1),
      title,
      content,
      author,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  // Event Operations
  const createEvent = (eventData) => {
    const newEvent = {
      id: 'e' + (events.length + 1),
      responses: {},
      ...eventData
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const respondToEvent = (eventId, memberId, response) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          responses: {
            ...evt.responses,
            [memberId]: response
          }
        };
      }
      return evt;
    }));
  };

  // Attendance Operations
  const submitAttendance = (eventTitle, date, sport, records) => {
    const newRecord = {
      id: 'a' + (attendanceHistory.length + 1),
      eventTitle,
      date,
      sport,
      records
    };
    setAttendanceHistory(prev => [newRecord, ...prev]);
  };

  // Performance Operations
  const updatePlayerPerformance = (memberId, stats) => {
    setPlayerStats(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        ...stats
      }
    }));
  };

  // Resource Booking
  const bookResource = (resourceName, memberId, date, timeSlot) => {
    const member = members.find(m => m.id === memberId) || currentUser;
    const newBooking = {
      id: 'b' + (bookings.length + 1),
      resourceName,
      memberId: member.id,
      memberName: member.name,
      date,
      timeSlot
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  // Lost & Found
  const reportItem = (itemName, type, contact) => {
    const newItem = {
      id: 'lf' + (lostAndFound.length + 1),
      itemName,
      type,
      reporterName: currentUser ? currentUser.name : 'Guest',
      date: new Date().toISOString().split('T')[0],
      contact
    };
    setLostAndFound(prev => [newItem, ...prev]);
  };

  // Payment operations
  const payInvoice = (invoiceId) => {
    setPayments(prev => prev.map(p => p.id === invoiceId ? { ...p, status: 'Paid' } : p));
  };

  // Feedback operations
  const submitFeedback = (trainingRating, coachRating, facilitiesRating, comments) => {
    const newFeedback = {
      id: 'f' + (feedback.length + 1),
      memberName: currentUser ? currentUser.name : 'Anonymous',
      trainingRating,
      coachRating,
      facilitiesRating,
      comments
    };
    setFeedback(prev => [newFeedback, ...prev]);
  };

  // Sports Management Operations
  const addSport = (name, description) => {
    const newSport = {
      id: 's_' + Date.now(),
      name,
      description
    };
    setSports(prev => [...prev, newSport]);
    return newSport;
  };

  const editSport = (id, newName, newDescription) => {
    const oldSport = sports.find(s => s.id === id);
    setSports(prev => prev.map(s => s.id === id ? { ...s, name: newName, description: newDescription } : s));
    
    if (oldSport && oldSport.name !== newName) {
      setCoaches(prev => prev.map(c => c.specialty === oldSport.name ? { ...c, specialty: newName } : c));
      setTeams(prev => prev.map(t => t.sport === oldSport.name ? { ...t, sport: newName } : t));
      setEvents(prev => prev.map(e => e.sport === oldSport.name ? { ...e, sport: newName } : e));
    }
  };

  const deleteSport = (id) => {
    const oldSport = sports.find(s => s.id === id);
    setSports(prev => prev.filter(s => s.id !== id));
    
    if (oldSport) {
      setCoaches(prev => prev.map(c => c.specialty === oldSport.name ? { ...c, specialty: 'Unassigned' } : c));
      setTeams(prev => prev.map(t => t.sport === oldSport.name ? { ...t, sport: 'Unassigned' } : t));
    }
  };

  const updateCoachSpecialty = (coachId, newSpecialty) => {
    setCoaches(prev => prev.map(c => c.id === coachId ? { ...c, specialty: newSpecialty } : c));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      members,
      coaches,
      teams,
      events,
      attendanceHistory,
      playerStats,
      bookings,
      announcements,
      lostAndFound,
      badges,
      payments,
      feedback,
      login,
      logout,
      updateProfile,
      approveMember,
      removeMember,
      addMemberDirect,
      createTeam,
      assignCoach,
      addAnnouncement,
      createEvent,
      respondToEvent,
      submitAttendance,
      updatePlayerPerformance,
      bookResource,
      cancelBooking,
      reportItem,
      payInvoice,
      submitFeedback,
      theme,
      toggleTheme,
      sports,
      addSport,
      editSport,
      deleteSport,
      updateCoachSpecialty
    }}>
      {children}
    </AppContext.Provider>
  );
};
