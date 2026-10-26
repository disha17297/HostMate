export type Language = 'en' | 'hi';

export type EventType = 'wedding' | 'birthday' | 'community' | 'other';

export type Currency = '₹' | '$' | '€' | '£';

export interface BudgetCategory {
  id: string;
  name: string;
  nameHi: string;
  recommendedPct: number; // e.g. 40
  estimatedCost: number;
  actualCost: number;
  advancePaid: number;
  dueDate?: string;
  notes?: string;
}

export type TaskPhase = 'early' | 'mid' | 'final';

export interface ChecklistTask {
  id: string;
  title: string;
  titleHi: string;
  phase: TaskPhase;
  dueDate?: string;
  completed: boolean;
  assignedTo?: string;
  notes?: string;
}

export interface RunSheetItem {
  id: string;
  time: string; // e.g. "09:00 AM"
  activity: string;
  activityHi?: string;
  leadPerson: string;
  notes?: string;
  isCritical?: boolean;
}

export type FoodPreference = 'veg' | 'non-veg' | 'jain' | 'vegan' | 'other';

export interface GuestRsvp {
  id: string;
  name: string;
  phone?: string;
  attendance: 'yes' | 'no' | 'pending';
  plusOnes: number; // additional guests
  foodPreference: FoodPreference;
  dietaryNotes?: string;
  wishes?: string;
  submittedAt: string;
}

export type VendorCategory = 
  | 'venue' 
  | 'catering' 
  | 'decor' 
  | 'photography' 
  | 'music' 
  | 'makeup' 
  | 'transport' 
  | 'cake' 
  | 'anchor' 
  | 'other';

export interface VendorDocument {
  id: string;
  name: string;
  fileType: 'pdf' | 'image' | 'doc';
  dataUrl: string;
  uploadDate: string;
  sizeKb?: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  phone: string;
  email?: string;
  agreedPrice: number;
  advancePaid: number;
  balanceDueDate: string;
  status: 'contacted' | 'negotiating' | 'booked' | 'completed';
  deliverables?: string;
  documents: VendorDocument[];
  notes?: string;
}

export interface EventData {
  id: string;
  title: string;
  type: EventType;
  date: string;
  currency: Currency;
  totalBudget: number;
  guestCount: number;
  budgetItems: BudgetCategory[];
  tasks: ChecklistTask[];
  runSheet: RunSheetItem[];
  rsvps: GuestRsvp[];
  vendors: Vendor[];
  createdAt: string;
  updatedAt: string;
}
