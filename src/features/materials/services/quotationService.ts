import { supabase } from '@/integrations/supabase/client';
import { QuotationFormData, RequisitionItemData } from '../types';

export interface SubmitQuotationParams {
  form: QuotationFormData;
  items?: RequisitionItemData[];
  singleItem?: {
    name: string;
    sku: string;
    chapter?: string;
    quantity?: string | number;
  };
}

export async function submitQuotationRequest({
  form,
  items,
  singleItem,
}: SubmitQuotationParams): Promise<{ success: boolean; error?: string }> {
  try {
    let messageBody = '';

    if (singleItem) {
      messageBody = `SINGLE APPARATUS QUOTATION REQUEST
Apparatus: ${singleItem.name} (SKU: ${singleItem.sku})
Chapter: ${singleItem.chapter || 'N/A'}
Quantity: ${singleItem.quantity || '1 Set'}
School: ${form.schoolName}
City: ${form.city}
Notes: ${form.notes || 'None'}`;
    } else if (items && items.length > 0) {
      const itemsList = items
        .map(
          (c, idx) =>
            `${idx + 1}. ${c.name} (SKU: ${c.sku || c.id}) - Qty: ${c.quantity} - Chapter: ${c.category}`
        )
        .join('\n');

      const totalQty = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

      messageBody = `INSTITUTIONAL LAB QUOTATION REQUEST
School: ${form.schoolName}
City: ${form.city}
Notes: ${form.notes || 'None'}

Selected Apparatuses (${items.length} types, ${totalQty} units):
${itemsList}`;
    } else {
      messageBody = `GENERAL LAB QUOTATION REQUEST
School: ${form.schoolName}
City: ${form.city}
Notes: ${form.notes || 'None'}`;
    }

    const { error } = await (supabase as any).from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      institution: form.schoolName,
      message: messageBody,
      type: 'quotation_request',
    });

    if (error) {
      console.error('Failed to submit quotation request:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error in submitQuotationRequest:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
