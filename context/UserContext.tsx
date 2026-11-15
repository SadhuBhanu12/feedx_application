import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { storageReady, storage } from '@/store/storage';
import { clearUserQueryCache, restoreQueryClient } from '@/lib/queryPersist';
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
import { roadmapService } from '@/services/roadmapService';
import { resolveStandardFeedXId } from '@/services/idService';

export const CURRENT_BUILD_SIGNATURE = 'feedx_v1.2.8_build_14_otp_reset_2026';

interface UserContextType {
  user: any;
  setUser: (user: any) => void;
  booting: boolean;
  dashboard: any;
  tasks: any[];
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  unreadNotificationsCount: number;
  markNotificationAsRead: (notifId: string | number) => void;
  markAllNotificationsAsRead: () => void;
  signIn: (rollNo: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  changePassword: (newPass: string) => Promise<any>;
  mustChangePassword: boolean;
  refreshDashboard: (bypassCache?: boolean) => Promise<void>;
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
  refreshProfile: (targetId?: string) => Promise<any>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
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
      console.log('[UserProvider] Starting init session restoration...');
      
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 4000));

      try {
        await Promise.race([storageReady, timeoutPromise]);
        
        // =========================================================================
        // 1. FRESH DOWNLOAD & INSTALLATION SECURITY PURGE
        // =========================================================================
        // When a user downloads/installs an APK update or fresh build, any prior
        // cached credentials from older installations or Android Auto Backup MUST
        // be purged so that the app NEVER auto-logs in without user authentication.
        const CURRENT_BUILD_SIGNATURE = 'feedx_v1.2.8_build_14_otp_reset_2026';
        const installedSignature = storage.getString('feedx_installed_build_signature');

        if (installedSignature !== CURRENT_BUILD_SIGNATURE) {
          console.log('[Security] New APK download / installation detected. Purging all legacy sessions and requiring clean authentication.');
          try {
            storage.remove('auth-store');
            storage.remove('auth-store-v2');
            storage.remove('auth-store-v3');
            storage.remove('terms_accepted_v1');
            
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const keys = await AsyncStorage.getAllKeys();
            const staleKeys = keys.filter((k: string) => 
              k.startsWith('sb-') ||
              k.includes('supabase') || 
              k.includes('auth') || 
              k.includes('session') ||
              k.includes('REACT_QUERY_OFFLINE_CACHE')
            );
            if (staleKeys.length > 0) {
              await AsyncStorage.multiRemove(staleKeys);
            }
            await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
          } catch (e) {
            console.warn('[Security] Purge error:', e);
          }
          
          useAuthStore.getState().clearAuth();
          setUser(null);
          storage.set('feedx_installed_build_signature', CURRENT_BUILD_SIGNATURE);
          if (mounted) {
            setBooting(false);
            useAuthStore.getState().setBooting(false);
          }
          return;
        }

        // Non-blocking global settings load
        loadGlobalSettings().catch(err => console.warn('[UserProvider] Non-critical settings error:', err));
        
        // =========================================================================
        // 2. LIVE SUPABASE SESSION VERIFICATION (ZERO BLIND TRUST IN CACHE)
        // =========================================================================
        // Do NOT blindly call setUser(cachedUser) before Supabase confirms the session!
        const sessionPromise = supabase.auth.getSession();
        const result: any = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (result !== 'TIMEOUT' && result?.error) {
          const errMsg = String(result.error?.message || '');
          if (errMsg.includes('Refresh Token Not Found') || errMsg.includes('Invalid Refresh Token') || errMsg.includes('jwt')) {
            console.log('[UserProvider] Stale/invalid refresh token detected. Attempting refresh or clearing session.');
            try {
              const refreshRes = await supabase.auth.refreshSession();
              if (refreshRes.error) {
                await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
                setUser(null);
                useAuthStore.getState().clearAuth();
              }
            } catch (_) {
              await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
              setUser(null);
              useAuthStore.getState().clearAuth();
            }
          }
        }

        if (result !== 'TIMEOUT') {
          if (result?.data?.session?.user) {
            const session = result.data.session;
            console.log('[UserProvider] Active session verified successfully');
            const cachedUser = useAuthStore.getState().user;

            if (cachedUser && cachedUser.is_password_set === false) {
              console.log('[UserProvider] Incomplete password setup detected on session restore. Purging.');
              await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
              setUser(null);
              useAuthStore.getState().clearAuth();
            } else {
              const isAdmin = ['admin', 'inst_admin', 'super_admin', 'campus_admin', 'college_admin'].includes(String(cachedUser?.role || '').toLowerCase().trim());
              const hasRealName = cachedUser && cachedUser.full_name && cachedUser.full_name !== 'User' && cachedUser.full_name !== 'Student';
              const hasCompletedOnboarding = isAdmin || (cachedUser && cachedUser.first_login_completed === true);
              
              if (cachedUser && cachedUser.id === session.user.id && (isAdmin || (hasRealName && hasCompletedOnboarding))) {
                if (cachedUser.is_active === false) {
                  console.warn('[UserProvider] Suspended account detected. Signing out.');
                  await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
                  setUser(null);
                  useAuthStore.getState().clearAuth();
                  return;
                }
                setUser(cachedUser);
                useAuthStore.getState().setAuthStatus('AUTHENTICATED');
                NetInfo.fetch().then(netState => {
                  if (netState.isConnected) {
                    enrichUser(session.user).then(enriched => {
                      if (mounted && enriched) {
                        if (enriched.is_active === false || enriched.is_password_set === false) {
                          supabase.auth.signOut({ scope: 'local' }).catch(() => {});
                          setUser(null);
                          useAuthStore.getState().clearAuth();
                        } else {
                          setUser(enriched);
                          useAuthStore.getState().setUser(enriched);
                        }
                      }
                    }).catch(err => console.warn('[UserProvider] Background enrichment error:', err));
                  }
                });
              } else {
                try {
                  const enriched = await Promise.race([enrichUser(session.user), timeoutPromise]);
                  if (enriched && enriched !== 'TIMEOUT') {
                    if (enriched.is_active === false || enriched.is_password_set === false) {
                      await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
                      setUser(null);
                      useAuthStore.getState().clearAuth();
                    } else {
                      setUser(enriched);
                      useAuthStore.getState().setUser(enriched);
                      useAuthStore.getState().setAuthStatus('AUTHENTICATED');
                    }
                  } else if (cachedUser && cachedUser.id === session.user.id) {
                    setUser(cachedUser);
                    useAuthStore.getState().setAuthStatus('AUTHENTICATED');
                  } else {
                    setUser(null);
                    useAuthStore.getState().clearAuth();
                  }
                } catch (err) {
                  console.warn('[UserProvider] Failed to enrich user on startup:', err);
                  if (cachedUser && cachedUser.id === session.user.id) {
                    setUser(cachedUser);
                    useAuthStore.getState().setAuthStatus('AUTHENTICATED');
                  } else {
                    setUser(null);
                    useAuthStore.getState().clearAuth();
                  }
                }
              }
            }
          } else {
            // No active session in Supabase - clear any cached user so uninstalled/reinstalled or expired sessions are never auto-logged in
            console.log('[UserProvider] No active Supabase session found. Setting UNAUTHENTICATED.');
            setUser(null);
            useAuthStore.getState().clearAuth();
            await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
          }
        } else {
          // Timeout fetching session
          const net = await NetInfo.fetch();
          if (net.isConnected) {
            console.log('[UserProvider] Session fetch timed out while connected. Setting UNAUTHENTICATED.');
            setUser(null);
            useAuthStore.getState().clearAuth();
          } else {
            // Offline fallback: only allow if user had a valid local cached session
            const cachedUser = useAuthStore.getState().user;
            if (cachedUser?.id) {
              console.log('[UserProvider] Offline startup with cached user:', cachedUser.email || cachedUser.roll_no);
              setUser(cachedUser);
              useAuthStore.getState().setAuthStatus('AUTHENTICATED');
            } else {
              setUser(null);
              useAuthStore.getState().clearAuth();
            }
          }
        }
      } catch (e: any) {
        console.warn('[UserProvider] Init session notice:', e?.message || e);
        setUser(null);
        useAuthStore.getState().clearAuth();
      } finally {
        console.log('[UserProvider] Init complete');
        if (mounted) {
          setBooting(false);
          useAuthStore.getState().setBooting(false);
        }
      }
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[UserProvider] Auth state changed:', event);
      if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
        console.log('[UserProvider] Explicit SIGNED_OUT or empty session event received. Clearing session.');
        setUser(null);
        useAuthStore.getState().clearAuth();
        setDashboard(null);
        setTasks([]);
        setNotifications([]);
      } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        const cachedUser = useAuthStore.getState().user;
        const hasRealName = cachedUser && cachedUser.full_name && cachedUser.full_name !== 'User' && cachedUser.full_name !== 'Student';
        if (cachedUser && cachedUser.id === session.user.id && hasRealName) {
          setUser(cachedUser);
          useAuthStore.getState().setAuthStatus('AUTHENTICATED');
          const netState = await NetInfo.fetch();
          if (netState.isConnected) {
            enrichUser(session.user).then(enriched => {
              if (mounted && enriched) setUser(enriched);
            }).catch(err => console.warn('[onAuthStateChange] Background enrich error:', err));
          }
        } else {
          try {
            const enriched = await enrichUser(session.user);
            if (enriched) {
              if (enriched.is_active === false || enriched.is_password_set === false) {
                await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
                setUser(null);
                useAuthStore.getState().clearAuth();
              } else {
                setUser(enriched);
                useAuthStore.getState().setAuthStatus('AUTHENTICATED');
              }
            }
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

    return () => { 
      mounted = false; 
      subscription.unsubscribe();
      supabase.removeChannel(settingsChannel);
      appStateListener.remove();
    };
  }, [loadGlobalSettings]);

  const refreshDashboard = useCallback(async (bypassCache = false) => {
    if (user?.id) {
      const data = await getDashboard(user.id, bypassCache);
      setDashboard(data);
      setTasks(data?.tasks || []);
      setNotifications(data?.notifications || []);
      if (data?.profile) {
        setUser((prev: any) => {
          const fid = data.profile.feedx_id || prev?.feedx_id || resolveStandardFeedXId(data.profile);
          const cleanProfile: Record<string, any> = {};
          Object.keys(data.profile).forEach((k) => {
            const val = data.profile[k];
            if (val !== null && val !== undefined && val !== '') {
              cleanProfile[k] = val;
            }
          });
          const merged = {
            ...prev,
            ...cleanProfile,
            feedx_id: fid,
          };
          useAuthStore.getState().setUser(merged);
          return merged;
        });
      }
    }
  }, [user?.id, setUser]);

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
        refreshDashboard(true);
        queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] });
        queryClient.invalidateQueries({ queryKey: ['attendance_logs', user.id] });
      },
      onNotification: (newNotif: any) => {
        setNotifications(prev => [newNotif, ...prev]);
        queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] });
        refreshDashboard(true);
      },
      onTasks: async () => {
        refreshDashboard(true);
        queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] });
        queryClient.invalidateQueries({ queryKey: ['tasks', user.id] });
      },
      onBookmarks: () => {
        queryClient.invalidateQueries({ queryKey: ['bookmarks', user.id] });
      },
      onEvents: () => {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        refreshDashboard(true);
      },
      onOpportunities: () => {
        queryClient.invalidateQueries({ queryKey: ['opportunities'] });
        refreshDashboard(true);
      },
      onResources: () => {
        queryClient.invalidateQueries({ queryKey: ['resources'] });
      },
      onCommunity: () => {
        queryClient.invalidateQueries({ queryKey: ['community_posts'] });
      },
      onPolls: () => {
        queryClient.invalidateQueries({ queryKey: ['community_posts'] });
        queryClient.invalidateQueries({ queryKey: ['admin_polls'] });
        queryClient.invalidateQueries({ queryKey: ['polls'] });
      },
      onPollVotes: () => {
        queryClient.invalidateQueries({ queryKey: ['community_posts'] });
        queryClient.invalidateQueries({ queryKey: ['admin_polls'] });
        queryClient.invalidateQueries({ queryKey: ['polls'] });
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
  }, [user?.id, queryClient, refreshDashboard]);

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
      console.warn('[UserProvider] signIn failed:', err?.message || err);
      throw err;
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
    const currentUid = user?.id;
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
      useAuthStore.getState().clearAuth();
      storage.remove('auth-store');
      storage.remove('auth-store-v2');
      storage.remove('auth-store-v3');
      roadmapService.clearAllRoadmapProgress();
      if (currentUid) {
        clearUserQueryCache(currentUid);
      }
      queryClient.clear();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const keys = await AsyncStorage.getAllKeys();
      const authKeys = keys.filter((k: string) => 
        k.startsWith('sb-') || 
        k.includes('supabase') || 
        k.includes('auth') || 
        k.includes('session')
      );
      if (authKeys.length > 0) {
        await AsyncStorage.multiRemove(authKeys);
      }
    } catch (err) {}

    setUser(null);
    setDashboard(null);
    setTasks([]);
    setNotifications([]);
    console.log('[UserProvider] ✅ Signed out, state cleared');
  }, [setUser, user?.id, queryClient]);

  const refreshProfile = useCallback(async (targetId?: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const idToFetch = targetId || authUser?.id || user?.id;
      if (!idToFetch) return null;
      const enriched = await enrichUser(authUser || { id: idToFetch });
      if (enriched) {
        setUser(enriched);
        useAuthStore.getState().setUser(enriched);
        queryClient.invalidateQueries({ queryKey: ['dashboard', idToFetch] });
        queryClient.invalidateQueries({ queryKey: ['profile', idToFetch] });
      }
      return enriched;
    } catch (err) {
      console.warn('[UserContext] refreshProfile error:', err);
      return null;
    }
  }, [user?.id, setUser, queryClient]);

  const unreadNotificationsCount = useMemo(() => {
    return (notifications || []).filter((n: any) => !n.is_read).length;
  }, [notifications]);

  const markNotificationAsRead = useCallback((notifId: string | number) => {
    if (!notifId) return;
    const sId = String(notifId).trim();
    const cleanId = sId.replace(/^(notif_|event_|opp_|notif-)/, '');
    setNotifications((prev) =>
      (prev || []).map((n) => {
        const curId = String(n.id).trim();
        const curClean = curId.replace(/^(notif_|event_|opp_|notif-)/, '');
        if (curId === sId || curClean === cleanId) {
          return { ...n, is_read: true };
        }
        return n;
      })
    );
    setDashboard((prev: any) => {
      if (!prev?.notifications) return prev;
      return {
        ...prev,
        notifications: prev.notifications.map((n: any) => {
          const curId = String(n.id).trim();
          const curClean = curId.replace(/^(notif_|event_|opp_|notif-)/, '');
          if (curId === sId || curClean === cleanId) {
            return { ...n, is_read: true };
          }
          return n;
        })
      };
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => (prev || []).map((n) => ({ ...n, is_read: true })));
    setDashboard((prev: any) => {
      if (!prev?.notifications) return prev;
      return {
        ...prev,
        notifications: prev.notifications.map((n: any) => ({ ...n, is_read: true }))
      };
    });
  }, []);

  const value = useMemo(() => ({
    user,
    setUser,
    booting,
    dashboard,
    tasks,
    notifications,
    setNotifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    signIn,
    signOut,
    changePassword,
    mustChangePassword:
      Boolean(user?.id && user?.role === 'student' && user?.is_password_set === false),
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
    refreshDashboard,
    refreshProfile,
  }), [user, booting, dashboard, tasks, notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead, signIn, signOut, changePassword, globalSettings, loadGlobalSettings, refreshDashboard, refreshProfile]);

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
