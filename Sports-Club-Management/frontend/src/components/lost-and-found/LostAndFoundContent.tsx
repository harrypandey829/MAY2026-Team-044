import { useState } from 'react';
import { Search, Sparkles, ShieldCheck } from 'lucide-react';
import PageCard from '../member/PageCard';

export interface LostFoundItem {
  name: string;
  description: string;
  date: string;
  location: string;
  status: 'Lost' | 'Found' | 'Claimed';
  reportedBy: string;
  sport: string;
  contact: string;
}

const initialItems: LostFoundItem[] = [
  {
    name: 'Blue Water Bottle',
    description: 'Found near the pool lounge after the morning session.',
    date: '10 Jul 2026',
    location: 'Pool Lounge',
    status: 'Found',
    reportedBy: 'Mina R.',
    sport: 'Swimming',
    contact: '+1 202 555 0148',
  },
  {
    name: 'Training Towel',
    description: 'Lost during the evening badminton class.',
    date: '08 Jul 2026',
    location: 'Court 2',
    status: 'Lost',
    reportedBy: 'Alex C.',
    sport: 'Badminton',
    contact: '+1 202 555 0149',
  },
  {
    name: 'Football Gloves',
    description: 'Left in the changing room after the evening match.',
    date: '12 Jul 2026',
    location: 'Changing Room A',
    status: 'Claimed',
    reportedBy: 'Noah B.',
    sport: 'Football',
    contact: '+1 202 555 0150',
  },
];

interface LostAndFoundContentProps {
  variant: 'member' | 'coach' | 'admin';
}

export default function LostAndFoundContent({ variant }: LostAndFoundContentProps) {
  const isCoach = variant === 'coach' || variant === 'admin';
  const isAdmin = variant === 'admin';

  // State hooks
  const [itemsList, setItemsList] = useState<LostFoundItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<'Lost' | 'Found'>('Lost');

  // Form states
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemLoc, setItemLoc] = useState('');
  const [itemSport, setItemSport] = useState('');
  const [itemContact, setItemContact] = useState('');
  const [itemReporter, setItemReporter] = useState('');

  const openReportModal = (status: 'Lost' | 'Found') => {
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemLoc || !itemContact || !itemReporter) {
      return;
    }

    const newItem: LostFoundItem = {
      name: itemName,
      description: itemDesc,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: itemLoc,
      status: defaultStatus,
      reportedBy: itemReporter,
      sport: itemSport || 'General',
      contact: itemContact,
    };

    setItemsList((prev) => [newItem, ...prev]);

    // Clear form and close modal
    setItemName('');
    setItemDesc('');
    setItemLoc('');
    setItemSport('');
    setItemContact('');
    setItemReporter('');
    setIsModalOpen(false);
  };

  return (
    <>
      <section className="rounded-[2rem] border border-sky-200/70 bg-gradient-to-r from-sky-100 via-white to-emerald-50 p-6 text-slate-900 shadow-xl shadow-sky-100/80 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Portal</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Lost & Found</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {isCoach
              ? isAdmin
                ? 'Review all reports, update item status, and manage lost and found operations across the club.'
                : 'Review all reports, update item status, and help coordinate returned items across the club.'
              : 'Report a missing item, check what has been found, and contact the owner when a match is identified.'}
          </p>
        </div>
      </section>

      <PageCard title="Report items" subtitle="Quick actions">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => openReportModal('Lost')}
            className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Report Lost Item
          </button>
          <button
            type="button"
            onClick={() => openReportModal('Found')}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Report Found Item
          </button>
          {isCoach && (
            <button
              type="button"
              onClick={() => openReportModal('Found')}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Update Item Status
            </button>
          )}
        </div>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-500">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none" placeholder="Search items" />
          </label>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">Filter by status</div>
            {isCoach && (
              <>
                <div className="rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">Filter by Sport</div>
                <div className="rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-600">Filter by Date</div>
              </>
            )}
          </div>
        </div>
      </PageCard>

      <PageCard title="Item listings" subtitle="Lost and found records">
        <div className="grid gap-3">
          {itemsList.map((item, index) => (
            <div key={`${item.name}-${index}`} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/80 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  <p className="mt-3 text-sm text-slate-500">{item.date} • {item.location}</p>
                  <p className="mt-2 text-sm text-slate-500">Sport: {item.sport}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Found' ? 'bg-emerald-50 text-emerald-700' : item.status === 'Claimed' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>
                    {item.status}
                  </span>
                  <p className="mt-3 text-sm text-slate-500">Reported by {item.reportedBy}</p>
                  <p className="mt-1 text-sm text-slate-500">Contact: {item.contact}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {isCoach ? (
                  <>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                      Edit Details
                    </button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                      Update Status
                    </button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                      Mark Claimed
                    </button>
                    <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                      Contact Member
                    </button>
                  </>
                ) : (
                  <button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                    Contact Owner
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-sky-200 bg-sky-50/80 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-600" />
            {isCoach
              ? isAdmin
                ? 'Club owners can review, manage, and follow up on every report to keep the club organised.'
                : 'Coaches can review, manage, and follow up on every report to keep the club organised.'
              : 'The front desk team reviews new reports each day.'}
          </div>
          {isCoach && (
            <div className="mt-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-600" />
              Membership reports remain visible and can be updated by staff through the coach portal.
            </div>
          )}
        </div>
      </PageCard>

      {/* Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-bold text-slate-900">
              Report {defaultStatus} Item
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Enter item details below to instantly publish it to the club listings.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Wilson Tennis Racket"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Describe colors, marks, or specific location..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 h-20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemLoc}
                    onChange={(e) => setItemLoc(e.target.value)}
                    placeholder="e.g. Court 3"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Sport
                  </label>
                  <input
                    type="text"
                    value={itemSport}
                    onChange={(e) => setItemSport(e.target.value)}
                    placeholder="e.g. Tennis"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Reporter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemReporter}
                    onChange={(e) => setItemReporter(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemContact}
                    onChange={(e) => setItemContact(e.target.value)}
                    placeholder="e.g. +1 202 555 0199"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-brand-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-300/30 hover:opacity-95"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
