
export type UserRole = 'adm' | 'leitor' | 'autor';

export interface BankInfo {
  id: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  isPrimary: boolean;
  label?: string; // Ex: "Conta Pessoal", "Empresa"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  paymentMethods?: BankInfo[];
  whatsappNumber?: string; // WhatsApp for notifications
  preferredContact?: {
    whatsapp?: string;
    email?: string;
  };
  bio?: string;
  avatarUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverUrl: string;
  category: string;
  isbn?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
  authorId?: string;
  stock?: number;
  digitalFileUrl?: string;
  format?: 'físico' | 'digital';
  paymentInfo?: string; // ID of the bank account to use
  paymentInfoNotes?: string; // Custom notes for payment
  launchDate?: string; // ISO date string for upcoming book launch
}

export interface CartItem extends Book {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  audioUrl: string;
  imageUrl: string;
}

export interface EditorialService {
  id: string;
  title: string;
  price: string;
  details: string[];
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerId?: string;
  items: { title: string; quantity: number; price: number; authorId?: string }[];
  total: number;
  status: 'Pendente' | 'Validado' | 'Cancelado';
  date: string;
  paymentNotificationId?: string;
}

export interface PaymentNotificationItem {
  bookId: string;
  bookTitle: string;
  authorId: string;
  authorName: string;
  bankingDetails: BankInfo;
  quantity: number;
  price: number;
}

export interface PaymentNotification {
  id: string;
  orderId: string;
  readerId: string;
  readerName: string;
  readerEmail: string;
  items: PaymentNotificationItem[];
  totalAmount: number;
  status: 'pending' | 'proof_uploaded' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentProof {
  id: string;
  paymentNotificationId: string;
  readerId: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  confirmedBy?: string;
  confirmedAt?: string;
  notes?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
}

export interface Manuscript {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  genre: string;
  pages?: number;
  synopsis: string;
  fileUrl: string;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedDate?: string | null;
  feedback?: string;
  email?: string;
}

export type ViewState = 'HOME' | 'CATALOG' | 'DETAILS' | 'ABOUT' | 'TEAM' | 'SERVICES' | 'CHECKOUT' | 'PODCAST' | 'CONTACT' | 'ADMIN' | 'AUTH' | 'AUTHOR_DASHBOARD' | 'READER_DASHBOARD' | 'BLOG';
