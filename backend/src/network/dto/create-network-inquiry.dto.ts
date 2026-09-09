export class CreateNetworkInquiryDto {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  category: string;
  gadgetNeeded: string;
  targetBudget?: number;
  notes?: string;
}
