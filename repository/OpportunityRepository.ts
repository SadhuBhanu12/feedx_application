import { supabase } from '@/lib/supabase';
import { BaseRepository } from './BaseRepository';

export interface OpportunityData {
  title: string;
  company_name: string;
  location?: string;
  type?: string;
  salary?: string;
  deadline?: string;
  banner_url?: string;
  status?: string;
  college_id?: string;
}

export class OpportunityRepository extends BaseRepository {
  public static async adminListOpportunities(collegeId?: string) {
    // Purge expired automatically
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      // Intentionally not blocking with abortSignal here as it's fire-and-forget
      await supabase.from('opportunities').delete().lt('deadline', todayStr);
    } catch (e) {
      console.warn('Purging expired opportunities failed:', e);
    }

    return this.execute(async (signal) => {
      let query = supabase
        .from('opportunities')
        .select('id, title, company_name, location, type, salary, deadline, banner_url, status, created_at, college_id')
        .order('created_at', { ascending: false })
        .abortSignal(signal as any);
        
      if (collegeId) {
        query = query.eq('college_id', collegeId);
      }
      
      return query;
    }, 'Admin List Opportunities');
  }

  public static async adminUpsertOpportunity(item: Partial<OpportunityData> & { id?: string }) {
    return this.execute(async (signal) => {
      return supabase.from('opportunities').upsert(item).select('id').abortSignal(signal as any).single();
    }, 'Upsert Opportunity', { retries: 0 }); // No retries on upsert to prevent duplicates
  }

  public static async adminDeleteOpportunity(id: string) {
    return this.execute(async (signal) => {
      return supabase.from('opportunities').delete().eq('id', id).abortSignal(signal as any);
    }, 'Delete Opportunity');
  }

  public static async trackOpportunityApply(userId: string, opportunityId: string) {
    return this.execute(async (signal) => {
      return supabase
        .from('opportunity_applications')
        .upsert(
          { user_id: userId, opportunity_id: opportunityId, status: 'applied' }, 
          { onConflict: 'opportunity_id,user_id' }
        )
        .select('id')
        .abortSignal(signal as any)
        .single();
    }, 'Track Opportunity Apply', { retries: 0 });
  }

  public static async getUserAppliedOpportunityIds(userId: string) {
    return this.execute(async (signal) => {
      const data = await supabase
        .from('opportunity_applications')
        .select('opportunity_id')
        .eq('user_id', userId)
        .neq('status', 'withdrawn')
        .abortSignal(signal as any);
        
      if (data.error) throw data.error;
      return { data: (data.data || []).map((r) => r.opportunity_id) } as any;
    }, 'Get User Applied Opportunities');
  }
}
