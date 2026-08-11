export interface LostFoundItem {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  status: 'Lost' | 'Found' | 'Claimed';
  reportedBy: string;
  sport: string;
  contact: string;
}

const STORAGE_KEY = 'sports_club_lost_found_items';

const initialItems: LostFoundItem[] = [
  {
    id: 'lf-1',
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
    id: 'lf-2',
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
    id: 'lf-3',
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

export const lostAndFoundService = {
  getAll(): LostFoundItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));
      return initialItems;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialItems;
    }
  },

  add(item: Omit<LostFoundItem, 'id'>): LostFoundItem {
    const current = this.getAll();
    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`,
    };
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('lost_found_updated'));
    return newItem;
  },

  updateStatus(id: string, status: LostFoundItem['status']): void {
    const current = this.getAll();
    const updated = current.map((i) => (i.id === id ? { ...i, status } : i));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('lost_found_updated'));
  },

  delete(id: string): void {
    const current = this.getAll();
    const updated = current.filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('lost_found_updated'));
  },
};

export default lostAndFoundService;
