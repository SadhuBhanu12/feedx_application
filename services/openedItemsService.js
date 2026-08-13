import AsyncStorage from '@react-native-async-storage/async-storage';

const OPPS_KEY = '@feedx_opened_opportunities';
const RES_KEY = '@feedx_opened_resources';

export async function getOpenedOpportunities() {
  try {
    const data = await AsyncStorage.getItem(OPPS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('getOpenedOpportunities error:', err);
    return [];
  }
}

export async function markOpportunityAsOpened(id) {
  if (!id) return [];
  try {
    const current = await getOpenedOpportunities();
    if (!current.includes(id)) {
      const next = [...current, id];
      await AsyncStorage.setItem(OPPS_KEY, JSON.stringify(next));
      return next;
    }
    return current;
  } catch (err) {
    console.error('markOpportunityAsOpened error:', err);
    return [];
  }
}

export async function getOpenedResources() {
  try {
    const data = await AsyncStorage.getItem(RES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('getOpenedResources error:', err);
    return [];
  }
}

export async function markResourceAsOpened(id) {
  if (!id) return [];
  try {
    const current = await getOpenedResources();
    if (!current.includes(id)) {
      const next = [...current, id];
      await AsyncStorage.setItem(RES_KEY, JSON.stringify(next));
      return next;
    }
    return current;
  } catch (err) {
    console.error('markResourceAsOpened error:', err);
    return [];
  }
}

export function isItemNew(createdAt, openedIds = [], hoursThreshold = 72) {
  if (!createdAt) return false;
  const createdTime = new Date(createdAt).getTime();
  if (isNaN(createdTime)) return false;
  const now = Date.now();
  const diffHours = (now - createdTime) / (1000 * 60 * 60);
  return diffHours <= hoursThreshold;
}
