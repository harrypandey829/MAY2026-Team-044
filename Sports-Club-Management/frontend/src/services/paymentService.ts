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
  amount: number;
  payment_model: PaymentModel;
  invoice_status: InvoiceStatus;
  due_date: string;
  paid_date?: string;
}

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    return api.get<Payment[]>('/payments');
  },

  async getById(id: string): Promise<Payment> {
    return api.get<Payment>(`/payments/${id}`);
  },

  async create(data: CreatePaymentRequest): Promise<Payment> {
    return api.post<Payment>('/payments', data);
  },

  async update(id: string, data: Partial<CreatePaymentRequest>): Promise<Payment> {
    return api.put<Payment>(`/payments/${id}`, data);
  },

  // Filter payments by member ID (client-side since no server filter endpoint)
  filterByMember(payments: Payment[], memberId: string): Payment[] {
    return payments.filter((p) => p.member_id === memberId);
  },

  formatAmount(amount: string | number): string {
    return `₹${parseFloat(String(amount)).toLocaleString('en-IN')}`;
  },
};

export default paymentService;
