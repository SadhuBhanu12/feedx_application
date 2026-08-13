import { supabase } from '@/lib/supabase';
import { BaseRepository } from './BaseRepository';

export class ResourceRepository extends BaseRepository {
  public static async getResourcesForStudent(
    user: any, 
    page: number = 1, 
    limit: number = 30, 
    search: string = '', 
    filters: any = {}
  ) {
    return this.execute(async (signal) => {
      let query = supabase.from('resources').select('*'); // We keep * here as resources might have varied fields until a full audit is done
      
      if (user?.role === 'student' && user?.college_id) {
        query = query.or(`college_id.eq.${user.college_id},college_id.is.null`);
      }
      
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      return query.order('created_at', { ascending: false }).range(from, to).abortSignal(signal as any);
    }, 'Fetch Resources');
  }

  public static async adminListNotes() {
    return this.execute(async (signal) => {
      return supabase
        .from('resources')
        .select('id, title, type, file_url, created_at, uploaded_by, status')
        .order('created_at', { ascending: false })
        .abortSignal(signal as any);
    }, 'Admin List Notes');
  }

  public static async adminDeleteNote(id: string) {
    return this.execute(async (signal) => {
      return supabase.from('resources').delete().eq('id', id).abortSignal(signal as any);
    }, 'Admin Delete Note');
  }
}
