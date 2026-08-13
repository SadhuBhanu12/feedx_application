import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';
import { fetchWithRetry } from './apiClient';

// Load from app.json extra config (safe for anon key - it's a public key)
const extra = Constants.expoConfig?.extra || {};

// Standalone native builds sometimes fail to load Constants.expoConfig at startup.
// We use public fallbacks matching the app.json definition to prevent startup crashes.
const FALLBACK_URL = "https://ktontqbfcinzqvalxyqd.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl || FALLBACK_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.supabaseAnonKey || FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    fetch: (url, options) => fetchWithRetry(url as string, options),
  },
});

// Change this to your deployed Google Apps Script Web App URL
export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJuFYMrwtw8EnkMNfLq3O1kbqeRj-2MHffa2dTA26A-5hzF_KIS4CDxFp-pZzc1DAZpQ/exec';
