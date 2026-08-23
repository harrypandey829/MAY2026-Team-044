export interface LostFoundItem {
  id: string;
  item: string;
  category: string;
  location: string;
  date: string;
  status: 'Lost' | 'Found' | 'Claimed';
  reported_by: string;
  contact?: string;
}

const STORAGE_KEY = 'sc_lost_found_items';

const defaultItems: LostFoundItem[] = [
  {
    id: 'LF-101',
    item: 'Wilson Pro Staff Tennis Racket',
    category: 'Equipment',
    location: 'Court 3 - Bench Area',
    date: '2026-08-01',
    status: 'Lost',
    reported_by: 'Member (Alex Carter)',
    contact: 'alex@clubmember.com',
  },
  {
    id: 'LF-102',
    item: 'Nike Blue Water Bottle (750ml)',
    category: 'Accessories',
    location: 'Swimming Pool Deck',
    date: '2026-08-02',
    status: 'Found',
    reported_by: 'Staff Front Desk',
  },
  {
    id: 'LF-103',
    item: 'Yonex Arcsaber Badminton Shoes (Size 10)',
    category: 'Footwear',
    location: 'Locker Room 2',
    date: '2026-08-03',
    status: 'Lost',
    reported_by: 'Member (Maya S.)',
  },
];

export const lostAndFoundService = {
  getItems(): LostFoundItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
        return defaultItems;
      }
      return JSON.parse(stored) as LostFoundItem[];
    } catch {
      return defaultItems;
    }
  },

  addItem(newItem: Omit<LostFoundItem, 'id'>): LostFoundItem {
    const items = this.getItems();
    const created: LostFoundItem = {
      ...newItem,
      id: `LF-${Math.floor(100 + Math.random() * 900)}`,
    };
    const updated = [created, ...items];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return created;
  },

  updateStatus(id: string, status: 'Lost' | 'Found' | 'Claimed'): void {
    const items = this.getItems();
    const updated = items.map((i) => (i.id === id ? { ...i, status } : i));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
};

export default lostAndFoundService;
