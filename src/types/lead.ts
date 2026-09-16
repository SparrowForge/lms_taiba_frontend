export enum LeadStage {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  APPLIED = 'applied',
  ADMITTED = 'admitted',
  ENROLLED = 'enrolled',
  LOST = 'lost',
}

/** Open stages in funnel order. ENROLLED and LOST are terminal. */
export const LEAD_OPEN_STAGES: LeadStage[] = [
  LeadStage.NEW,
  LeadStage.CONTACTED,
  LeadStage.QUALIFIED,
  LeadStage.APPLIED,
  LeadStage.ADMITTED,
];

export enum LeadActivityType {
  CALL = 'call',
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  MEETING = 'meeting',
  CAMPUS_VISIT = 'campus_visit',
  NOTE = 'note',
  STAGE_CHANGE = 'stage_change',
  ASSIGNMENT = 'assignment',
}

export enum LeadActivityOutcome {
  REACHED = 'reached',
  NO_ANSWER = 'no_answer',
  CALLBACK_REQUESTED = 'callback_requested',
  NOT_INTERESTED = 'not_interested',
  INFORMATION_SENT = 'information_sent',
  COMPLETED = 'completed',
}

export enum LeadLostReason {
  NOT_INTERESTED = 'not_interested',
  CHOSE_COMPETITOR = 'chose_competitor',
  FEES_TOO_HIGH = 'fees_too_high',
  NOT_ELIGIBLE = 'not_eligible',
  COURSE_UNAVAILABLE = 'course_unavailable',
  UNREACHABLE = 'unreachable',
  DUPLICATE = 'duplicate',
  OTHER = 'other',
}

export interface ILeadSource {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  isPublic: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ILeadRelationRef {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
}

export interface ILead {
  id: number;
  leadNo: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  alternatePhone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  city?: string | null;

  sourceId?: number | null;
  source?: ILeadSource | null;
  campaign?: string | null;
  referredBy?: string | null;

  courseId?: number | null;
  course?: ILeadRelationRef | null;
  batchId?: number | null;
  batch?: ILeadRelationRef | null;
  branchId?: number | null;
  branch?: ILeadRelationRef | null;
  expectedIntakeDate?: string | null;

  stage: LeadStage;
  lostReason?: LeadLostReason | null;
  lostNote?: string | null;
  score: number;

  assignedToUserId?: number | null;
  assignedTo?: ILeadRelationRef | null;
  lastContactedAt?: string | null;
  nextFollowUpAt?: string | null;

  convertedStudentId?: number | null;
  convertedStudent?: ILeadRelationRef | null;
  convertedAt?: string | null;

  remarks?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ILeadCreate {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  gender?: string;
  dateOfBirth?: string;
  city?: string;
  sourceId?: number;
  campaign?: string;
  referredBy?: string;
  courseId?: number;
  batchId?: number;
  branchId?: number;
  expectedIntakeDate?: string;
  stage?: LeadStage;
  assignedToUserId?: number;
  nextFollowUpAt?: string;
  remarks?: string;
  status?: string;
}

export type ILeadUpdate = Partial<ILeadCreate> & {
  lostReason?: LeadLostReason;
  lostNote?: string;
};

export interface ILeadStageUpdate {
  stage: LeadStage;
  lostReason?: LeadLostReason;
  lostNote?: string;
  note?: string;
  nextFollowUpAt?: string;
}

export interface ILeadAssign {
  assignedToUserId: number | null;
  note?: string;
  nextFollowUpAt?: string;
}

export interface ILeadConvert {
  applicationNo?: string;
  admissionDate?: string;
  courseId?: number;
  batchId?: number;
  sectionId?: number;
  branchId?: number;
  feeStructureId?: number;
  note?: string;
}

export interface ILeadActivity {
  id: number;
  leadId: number;
  type: LeadActivityType;
  subject: string;
  notes?: string | null;
  outcome?: LeadActivityOutcome | null;
  scheduledAt?: string | null;
  completedAt?: string | null;
  performedByUserId?: number | null;
  performedBy?: ILeadRelationRef | null;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ILeadActivityCreate {
  type: LeadActivityType;
  subject: string;
  notes?: string;
  outcome?: LeadActivityOutcome;
  scheduledAt?: string;
  completedAt?: string;
  nextFollowUpAt?: string;
}

export interface ILeadFunnelStats {
  byStage: { stage: LeadStage; count: number }[];
  bySource: { sourceId: number | null; sourceName: string; count: number }[];
  total: number;
  enrolled: number;
  lost: number;
  open: number;
  conversionRate: number;
}
