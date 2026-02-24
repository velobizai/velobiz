export interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  serviceInterest: string;
  honeypot?: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  serviceInterest: string;
  status: string;
  createdAt: string;
}
