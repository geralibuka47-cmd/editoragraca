
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
  genre: string;
  isbn?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  featured?: boolean;
  description?: string;
  authorId?: string;
  stock?: number;
  digitalFileUrl?: string;
  format?: 'físico' | 'digital';
  pages?: number;
  paymentInfo?: string; // ID of the bank account to use
  paymentInfoNotes?: string; // Custom notes for payment
  launchDate?: string; // ISO date string for upcoming book launch
  stats?: BookStats;
  reviews?: Review[];
}

export interface BookStats {
  views: number;
  downloads?: number; // For digital books
  copiesSold?: number; // For physical/paid books
  averageRating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
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

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
}

export interface Manuscript {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  genre: string;
  pages?: number;
  description: string;
  fileUrl: string;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedDate?: string | null;
  feedback?: string;
  email?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'blog' | 'manuscript' | 'info';
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export type ViewState = 'HOME' | 'CATALOG' | 'DETAILS' | 'ABOUT' | 'SERVICES' | 'CHECKOUT' | 'CONTACT' | 'ADMIN' | 'AUTH' | 'AUTHOR_DASHBOARD' | 'READER_DASHBOARD' | 'BLOG';
