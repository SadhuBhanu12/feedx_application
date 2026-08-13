import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { storageReady } from '@/store/storage';
import {
  getSession,
  loginWithRollNo,
  logout,
  getDashboard,
  subscribeToRealtime,
  verifyStudentIdentity,
  completeAccountActivation,
  requestPasswordReset,
  checkLoginEligibility,
  sendOtpToEmail,
  verifyOtpCode,
  enrichUser
} from '@/services/supabaseService';

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  booting: boolean;
  dashboard: any;
  tasks: any[];
  notifications: any[];
  signIn: (rollNo: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  changePassword: (newPass: string) => Promise<any>;
  mustChangePassword: boolean;
  refreshDashboard: () => Promise<void>;
  verifyIdentity: (pin: string, dob: string) => Promise<any>;
  completeActivation: (token: string, password: string, confirm: string) => Promise<any>;
  sendPasswordReset: (identifier: string) => Promise<any>;
  checkActivationStatus: (identifier: string) => Promise<any>;
  sendOtp: (studentId: string, email: string, options?: { skipEmailCheck?: boolean }) => Promise<any>;
  verifyOtp: (studentId: string, otp: string) => Promise<any>;
  isSuperAdmin: boolean;
  isCollegeAdmin: boolean;
  isFaculty: boolean;
  globalSettings: Record<string, any>;
  refreshSettings: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const [booting, setBooting] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [globalSettings, setGlobalSettings] = useState<Record<string, any>>({});

  // Track app state for session refresh on resume
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const loadGlobalSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*');
      if (error) throw error;
      if (data) {
        const mapped = data.reduce((acc: any, row: any) => {
          acc[row.key] = row.value;
          return acc;
        }, {});
        setGlobalSettings(mapped);
      }
    } catch (e) {
      console.warn('[loadGlobalSettings] Error fetching settings:', e);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      console.log('[UserProvider] Starting init...');
      
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 3500));

      try {
        await Promise.race([storageReady, timeoutPromise]);
        
        // Non-blocking global settings load
        loadGlobalSettings().catch(err => console.warn('[UserProvider] Non-critical settings error:', err));
        
        // Fast-path: If we already have a cached user, set it immediately
        const cachedUser = useAuthStore.getState().user;
        if (cachedUser && cachedUser.id) {
          console.log('[UserProvider] Instant boot using cached user profile.');
          setUser(cachedUser);
        }

        const sessionPromise = supabase.auth.getSession();
        const result: any = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (result !== 'TIMEOUT' && result?.error) {
          const errMsg = String(result.error?.message || '');
          if (errMsg.includes('Refresh Token Not Found') || errMsg.includes('Invalid Refresh Token')) {
            console.log('[UserProvider] Stale/invalid refresh token detected. Clearing local session.');
            await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
          }
        }

        if (result !== 'TIMEOUT' && result?.data?.session?.user) {
          const session = result.data.session;
          console.log('[UserProvider] Initial session retrieved successfully');
          const hasRealName = cachedUser && cachedUser.full_name && cachedUser.full_name !== 'User' && cachedUser.full_name !== 'Student';
          const hasCompletedOnboarding = cachedUser && cachedUser.first_login_completed === true;
          
          if (cachedUser && cachedUser.id === session.user.id && hasRealName && hasCompletedOnboarding) {
            setUser(cachedUser);
            NetInfo.fetch().then(netState => {
              if (netState.isConnected) {
                enrichUser(session.user).then(enriched => {
                  if (mounted && enriched) setUser(enriched);
                }).catch(err => console.warn('[UserProvider] Background enrichment error:', err));
              }
            });
          } else {
            try {
              const enriched = await Promise.race([enrichUser(session.user), timeoutPromise]);
              if (enriched && enriched !== 'TIMEOUT') {
                setUser(enriched);
              }
            } catch (err) {
              console.warn('[UserProvider] Failed to enrich user on startup, using fallback profile:', err);
              if (!cachedUser) {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  role: 'student',
                  full_name: 'Student',
                  roll_no: '',
                  branch: '',
                  year: '',
                  first_login_completed: true,
                  is_password_set: true
                } as any);
              }
            }
          }
        }
      } catch (e: any) {
        console.warn('[UserProvider] Init session notice:', e?.message || e);
      } finally {
        console.log('[UserProvider] Init complete, forcing booting=false');
        if (mounted) setBooting(false);
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[UserProvider] Auth state changed:', event);
      // NEVER aggressively clear the session here on token refresh failures.
      // We only clear on explicit SIGNED_OUT event (which means the user clicked Logout)
      if (event === 'SIGNED_OUT') {
        console.log('[UserProvider] Explicit SIGNED_OUT event received. Clearing session.');
        setUser(null);
        setDashboard(null);
        setTasks([]);
        setNotifications([]);
      } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        const cachedUser = useAuthStore.getState().user;
        const hasRealName = cachedUser && cachedUser.full_name && cachedUser.full_name !== 'User' && cachedUser.full_name !== 'Student';
        if (cachedUser && cachedUser.id === session.user.id && hasRealName) {
          console.log('[UserProvider] Auth state change using cached profile.');
          setUser(cachedUser);
          const netState = await NetInfo.fetch();
          if (netState.isConnected) {
            enrichUser(session.user).then(enriched => {
              if (mounted && enriched) setUser(enriched);
            }).catch(err => console.warn('[onAuthStateChange] Background enrich error:', err));
          }
        } else {
          try {
            const enriched = await enrichUser(session.user);
            if (enriched) setUser(enriched);
          } catch (err) {
            console.warn('[onAuthStateChange] Failed to enrich user:', err);
          }
        }
      }
    });

    // Subscribe to settings changes dynamically
    const settingsChannel = supabase.channel(`global-settings-realtime-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        loadGlobalSettings();
      })
      .subscribe();

    // Refresh session when app comes back to foreground using official Supabase guidelines
    const appStateListener = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        console.log('[UserProvider] App resumed to ACTIVE state, starting auto refresh...');
        supabase.auth.startAutoRefresh();
        
        // Only refresh settings on resume if it was backgrounded
        if (appStateRef.current.match(/inactive|background/)) {
          loadGlobalSettings();
        }
      } else {
        console.log('[UserProvider] App backgrounded, stopping auto refresh to prevent clock drift...');
        supabase.auth.stopAutoRefresh();
      }
      appStateRef.current = nextState;
    });

    // Fail-safe: transition booting to false after 1.4s for smooth AppLoader visibility
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (mounted) setBooting(false);
    }, 1400);

    return () => { 
      mounted = false; 
      clearTimeout(timer);
      subscription.unsubscribe();
      supabase.removeChannel(settingsChannel);
      appStateListener.remove();
    };
  }, [loadGlobalSettings]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const fetchInitialData = async () => {
      try {
        const data = await getDashboard(user.id);
        setDashboard(data);
        setTasks(data?.tasks || []);
      } catch (err) {
        console.warn('[UserProvider] Failed to fetch initial dashboard data:', err);
      }
    };
    fetchInitialData();

    const unsubscribe = subscribeToRealtime(user.id, {
      onAttendance: async () => {
        const data = await getDashboard(user.id);
        setDashboard(data);
        queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] });
        queryClient.invalidateQueries({ queryKey: ['attendance_logs', user.id] });
      },
      onNotification: (newNotif: any) => {
        setNotifications(prev => [newNotif, ...prev]);
        queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] });
      },
      onTasks: async () => {
        const data = await getDashboard(user.id);
        setTasks(data?.tasks || []);
        queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] });
        queryClient.invalidateQueries({ queryKey: ['tasks', user.id] });
      },
      onBookmarks: () => {
        queryClient.invalidateQueries({ queryKey: ['bookmarks', user.id] });
      },
      onEvents: () => {
        queryClient.invalidateQueries({ queryKey: ['events'] });
      },
      onOpportunities: () => {
        queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      },
      onResources: () => {
        queryClient.invalidateQueries({ queryKey: ['resources'] });
      },
      onProfile: (updatedProfile: any) => {
        setUser((prev: any) => ({ ...prev, ...updatedProfile }));
      },
      onEventRegistrations: () => {
        queryClient.invalidateQueries({ queryKey: ['event_registrations', user.id] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id, queryClient]);

  const signIn = useCallback(async (rollNo: string, password: string) => {
    try {
      const logged = await loginWithRollNo(rollNo, password);
      if (!logged) return null;
      setUser(logged);
      
      try {
        const data = await getDashboard(logged.id);
        setDashboard(data);
      } catch (e) {
        console.warn('[UserProvider] Dashboard failed during login, proceeding anyway.', e);
        setDashboard(null);
      }
      return logged;
    } catch (err: any) {
      console.warn('[UserProvider] signIn failed gracefully:', err?.message || err);
      return null;
    }
  }, []);

  const changePassword = useCallback(async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
      data: {
        must_change_password: false,
        is_password_set: true,
        first_login_completed: true,
      },
    });
    if (error) throw error;

    const now = new Date().toISOString();

    if (user?.id) {
      try {
        await supabase
          .from('users')
          .update({
            is_password_set: true,
            first_login_completed: true,
            password_changed_at: now,
            last_login: now,
          })
          .eq('id', user.id);

        const role = String(user?.role || '').trim().toLowerCase();
        if (role === 'student' || role === 'user') {
          await supabase
            .from('students')
            .update({
              is_password_set: true,
            })
            .eq('id', user.id);
        }
      } catch (dbErr) {
        console.error('[changePassword] Database sync error:', dbErr);
      }
    }

    setUser((prev: any) => ({
      ...prev,
      is_password_set: true,
      first_login_completed: true,
      user_metadata: {
        ...(prev?.user_metadata || {}),
        must_change_password: false,
        is_password_set: true,
        first_login_completed: true,
      },
    }));
    return data.user;
  }, [user?.id, user?.email, user?.role]);

  const signOut = useCallback(async () => {
    console.log('[UserProvider] Signing out...');
    try {
      // Use a timeout to prevent hanging on release builds
      await Promise.race([
        logout(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Logout timed out')), 2500))
      ]);
    } catch (e) {
      console.warn('[UserProvider] Logout error (proceeding anyway):', e);
    }
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      // In case supabase didn't clear it due to network error, try to clear any supabase auth keys
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter((k: string) => k.includes('supabase'));
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
      }
    } catch (err) {}

    setUser(null);
    setDashboard(null);
    setTasks([]);
    setNotifications([]);
    console.log('[UserProvider] ✅ Signed out, state cleared');
  }, []);

  const value = useMemo(() => ({
    user,
    setUser,
    booting,
    dashboard,
    tasks,
    notifications,
    signIn,
    signOut,
    changePassword,
    mustChangePassword:
      user?.role === 'student' && user?.is_password_set === false,
    verifyIdentity: verifyStudentIdentity,
    completeActivation: completeAccountActivation,
    sendPasswordReset: requestPasswordReset,
    checkActivationStatus: checkLoginEligibility,
    sendOtp: sendOtpToEmail,
    verifyOtp: verifyOtpCode,
    isSuperAdmin: String(user?.role || '').trim().toLowerCase() === 'super_admin',
    isCollegeAdmin: ['admin', 'super_admin', 'inst_admin'].includes(String(user?.role || '').trim().toLowerCase()),
    isFaculty: String(user?.role || '').trim().toLowerCase() === 'faculty',
    globalSettings,
    refreshSettings: loadGlobalSettings,
    refreshDashboard: async () => {
      if (user?.id) {
        const data = await getDashboard(user.id);
        setDashboard(data);
        setTasks(data?.tasks || []);
        setNotifications(data?.notifications || []);
      }
    }
  }), [user, booting, dashboard, tasks, notifications, signIn, signOut, changePassword, globalSettings, loadGlobalSettings]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
