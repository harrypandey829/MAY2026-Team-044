import api from './api';

export type PaymentModel = 'Annual' | 'Monthly' | 'Pay-per-use';
export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';

export interface Payment {
  id: string;
  member_id: string;
  amount: string;
  payment_model: PaymentModel;
  invoice_status: InvoiceStatus;
  due_date: string;
  paid_date: string | null;
  created_at: string;
}

export interface CreatePaymentRequest {
  member_id: string;
  amount: number | string;
  payment_model: PaymentModel;
  invoice_status: InvoiceStatus;
  due_date: string;
  paid_date?: string | null;
}

export const paymentService = {
  async getAll(memberId?: string): Promise<Payment[]> {
    const url = memberId ? `/payments?member_id=${encodeURIComponent(memberId)}` : '/payments';
    return api.get<Payment[]>(url);
  },

  async getById(id: string): Promise<Payment> {
    return api.get<Payment>(`/payments/${id}`);
  },

  async create(data: CreatePaymentRequest): Promise<Payment> {
    const payload = {
      ...data,
      amount: typeof data.amount === 'string' ? parseFloat(data.amount) || 0 : data.amount,
    };
    const res = await api.post<Payment>('/payments', payload);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('club_payment_completed', { detail: res }));
    }
    return res;
  },

  async update(id: string, data: Partial<CreatePaymentRequest>): Promise<Payment> {
    const payload = {
      ...data,
      ...(data.amount !== undefined ? { amount: typeof data.amount === 'string' ? parseFloat(data.amount) || 0 : data.amount } : {}),
    };
    const res = await api.put<Payment>(`/payments/${id}`, payload);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('club_payment_completed', { detail: res }));
    }
    return res;
  },

  async payInvoice(id: string): Promise<Payment> {
    const today = new Date().toISOString().split('T')[0];
    return this.update(id, {
      invoice_status: 'Paid',
      paid_date: today,
    });
  },

  filterByMember(payments: Payment[], memberId: string): Payment[] {
    return payments.filter((p) => p.member_id === memberId);
  },

  formatAmount(amount: string | number): string {
    return `₹${parseFloat(String(amount || 0)).toLocaleString('en-IN')}`;
  },
};

export default paymentService;

