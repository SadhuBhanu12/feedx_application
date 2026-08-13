import { supabase } from '@/lib/supabase';
import { BaseRepository } from './BaseRepository';

export interface EventData {
  title: string;
  description: string;
  venue: string;
  event_date: string;
  start_time: string;
  banner_url?: string;
  status?: string;
  college_id?: string;
}

export class EventRepository extends BaseRepository {
  public static async getEvents() {
    return this.execute(async (signal) => {
      return supabase
        .from('events')
        .select('id, title, description, venue, event_date, banner_url, status, start_time, created_at')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .abortSignal(signal as any);
    }, 'Fetch Events');
  }

  public static async getEventById(id: string) {
    return this.execute(async (signal) => {
      return supabase
        .from('events')
        .select('id, title, description, venue, event_date, start_time, banner_url, status, created_at, college_id')
        .eq('id', id)
        .abortSignal(signal as any)
        .maybeSingle();
    }, 'Fetch Event By Id');
  }

  public static async adminListEvents(collegeId?: string) {
    return this.execute(async (signal) => {
      let query = supabase
        .from('events')
        .select('id, title, description, venue, event_date, banner_url, status, start_time, created_at, college_id')
        .order('created_at', { ascending: false })
        .abortSignal(signal as any);
        
      if (collegeId) {
        query = query.eq('college_id', collegeId);
      }
      return query;
    }, 'Admin List Events');
  }

  public static async adminCreateEvent(eventData: EventData) {
    return this.execute(async (signal) => {
      return supabase.from('events').insert([eventData]).select('id').abortSignal(signal as any).single();
    }, 'Create Event', { retries: 0 }); 
  }

  public static async adminUpdateEvent(eventId: string, eventData: Partial<EventData>) {
    return this.execute(async (signal) => {
      return supabase.from('events').update(eventData).eq('id', eventId).select('id').abortSignal(signal as any).single();
    }, 'Update Event');
  }

  public static async adminDeleteEvent(eventId: string) {
    return this.execute(async (signal) => {
      return supabase.from('events').delete().eq('id', eventId).abortSignal(signal as any);
    }, 'Delete Event');
  }

  public static async registerForEvent(eventId: string, studentId: string, studentInfo: any = {}) {
    const regNumber = `REG-${eventId.substring(0,4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const feedxId = studentInfo?.feedx_id || studentInfo?.roll_number || `FEEDX-TG-26-${studentId.substring(0,6).toUpperCase()}`;
    const qrToken = feedxId;
    
    return this.execute(async (signal) => {
      const basePayload = {
        student_id: studentId,
        user_id: studentId, 
        event_id: eventId,
        registration_number: regNumber,
        feedx_id: feedxId,
        qr_token: qrToken,
        event_qr: qrToken,
        attendance_status: 'registered',
        student_name: studentInfo?.full_name || studentInfo?.name || null,
        college_id: studentInfo?.college_id || null,
        branch: studentInfo?.branch || null,
      };

      const statusCandidates = ['Active', 'Registered', 'Pending', 'Confirmed', null];
      let lastResult: any = null;

      for (const statusVal of statusCandidates) {
        const payload: any = { ...basePayload };
        if (statusVal !== null) payload.status = statusVal;

        const res = await supabase.from('event_registrations').insert(payload).select('id, registration_number, qr_token, event_qr, feedx_id').abortSignal(signal as any).single();
        if (!res.error) return res;
        lastResult = res;
        if (!res.error.message?.includes('check constraint') && !(res.error as any).code?.includes('23514')) {
          return res;
        }
      }
      return lastResult;
    }, 'Register for Event', { retries: 0 }); 
  }

  public static async getUserEventRegistration(eventId: string, studentId: string) {
    return this.execute(async (signal) => {
      return supabase.from('event_registrations')
        .select('id, status, registration_number, attendance, attendance_status, branch, event_qr, feedx_id, created_at')
        .eq('event_id', eventId)
        .eq('student_id', studentId)
        .abortSignal(signal as any)
        .maybeSingle();
    }, 'Fetch User Event Registration');
  }

  public static async cancelEventRegistration(eventId: string, studentId: string) {
    return this.execute(async (signal) => {
      return supabase.from('event_registrations')
        .update({ status: 'Cancelled', attendance_status: 'cancelled' })
        .eq('event_id', eventId)
        .eq('student_id', studentId)
        .abortSignal(signal as any);
    }, 'Cancel Event Registration');
  }

  public static async getStudentRegistrations(studentId: string) {
    return this.execute(async (signal) => {
      return supabase.from('event_registrations')
        .select('id, status, registration_number, attendance, attendance_status, branch, event_qr, feedx_id, created_at, events(id, title, venue, event_date, start_time, banner_url)')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .abortSignal(signal as any);
    }, 'Fetch Student Registrations');
  }

  public static async getUserRegisteredEventIds(studentId: string) {
    return this.execute(async (signal) => {
      const data = await supabase.from('event_registrations')
        .select('event_id')
        .eq('student_id', studentId)
        .neq('status', 'Cancelled')
        .abortSignal(signal as any);
      
      if (data.error) throw data.error;
      return { data: (data.data || []).map(r => r.event_id) } as any;
    }, 'Fetch User Registered Event Ids');
  }

  public static async getEventRegistrations(eventId: string) {
    return this.execute(async (signal) => {
      return supabase.from('event_registrations')
        .select('id, status, registration_number, attendance, attendance_status, branch, feedx_id, event_qr, created_at, students(full_name, roll_number, branch, year)')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .abortSignal(signal as any);
    }, 'Fetch Event Registrations');
  }

  public static async verifyQRToken(qrToken: string, verifiedBy: string, device?: string, location?: string) {
    // RPC calls do not natively support abortSignal in supabase-js v2 the same way query builders do.
    // The BaseRepository.ts withTimeout will throw a NetworkError regardless if it times out locally.
    return this.execute(async () => {
      return supabase.rpc('verify_event_qr_token', {
        p_qr_token: qrToken,
        p_verified_by: verifiedBy,
        p_device: device || 'Mobile App',
        p_location: location || 'Campus'
      });
    }, 'Verify QR Token', { retries: 0 }); 
  }
}
