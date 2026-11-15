import { AwardRewardResult } from './rewardService';

export interface RewardNotificationItem {
  id: string;
  result: AwardRewardResult;
  timestamp: number;
}

type NotificationListener = (item: RewardNotificationItem | null) => void;

class RewardNotificationManager {
  private queue: RewardNotificationItem[] = [];
  private currentItem: RewardNotificationItem | null = null;
  private listeners: Set<NotificationListener> = new Set();
  private isProcessing: boolean = false;
  private recentSignatures: Map<string, number> = new Map();
  private autoDismissTimeout: any = null;
  private lastDismissedTime: number = 0;

  /**
   * Enqueue a confirmed reward notification result with strict single-notification deduplication
   */
  enqueue(result: AwardRewardResult): void {
    // 1. Strictly drop invalid, zero-point, or already-earned notifications
    if (!result || !result.success || !result.pointsAwarded || result.pointsAwarded <= 0 || result.alreadyEarned) {
      return;
    }

    const now = Date.now();

    // 2. Normalized identifiers for deduplication
    const normActivity = (result.activityName || result.sourceLabel || 'activity')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const sig = `${normActivity}_${result.pointsAwarded}`;

    // 3. Deduplication: Drop if the exact same activity and points was enqueued within the last 10 seconds
    const lastSeen = this.recentSignatures.get(sig);
    if (lastSeen && now - lastSeen < 10000) {
      return;
    }

    // 4. Global Active Guard: If a celebration notification is CURRENTLY visible on screen:
    // Drop any notification with identical points, or any notification arriving within 4 seconds of the active one
    if (this.currentItem !== null) {
      const activeAge = now - this.currentItem.timestamp;
      if (activeAge < 4000 || this.currentItem.result.pointsAwarded === result.pointsAwarded) {
        return;
      }
    }

    // 5. Post-Dismissal Cooldown:
    // If a notification was dismissed less than 3 seconds ago with the exact same points, drop duplicate
    if (now - this.lastDismissedTime < 3000) {
      const lastDismissedPoints = this.recentSignatures.get('__last_dismissed_points__');
      if (lastDismissedPoints === result.pointsAwarded) {
        return;
      }
    }

    // 6. Check existing queue to prevent duplicate backlog
    const alreadyInQueue = this.queue.some(
      (item) => item.result.pointsAwarded === result.pointsAwarded &&
                item.result.activityName === result.activityName
    );
    if (alreadyInQueue) {
      return;
    }

    // Record signatures
    this.recentSignatures.set(sig, now);
    this.recentSignatures.set('__last_enqueued_points__', result.pointsAwarded);

    // Prune stale signatures older than 30s
    for (const [k, time] of this.recentSignatures.entries()) {
      if (typeof time === 'number' && now - time > 30000) {
        this.recentSignatures.delete(k);
      }
    }

    const item: RewardNotificationItem = {
      id: `notif_${now}_${Math.random().toString(36).substring(2, 8)}`,
      result,
      timestamp: now,
    };

    this.queue.push(item);
    this.processQueue();
  }

  /**
   * Subscribe to notification state changes
   */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.currentItem);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Dismiss the currently displayed notification and purge any duplicates from the queue
   */
  dismissCurrent(): void {
    if (this.autoDismissTimeout) {
      clearTimeout(this.autoDismissTimeout);
      this.autoDismissTimeout = null;
    }

    const prevItem = this.currentItem;
    this.currentItem = null;
    this.lastDismissedTime = Date.now();
    if (prevItem) {
      this.recentSignatures.set('__last_dismissed_points__', prevItem.result.pointsAwarded);
    }
    this.notifyListeners();

    // Discard any items in queue that are duplicates of the item just dismissed or older than 8s
    this.queue = this.queue.filter((item) => {
      const isStale = Date.now() - item.timestamp > 8000;
      const isDuplicate = prevItem && (
        item.result.pointsAwarded === prevItem.result.pointsAwarded ||
        item.result.activityName === prevItem.result.activityName
      );
      return !isStale && !isDuplicate && item.result.pointsAwarded > 0 && !item.result.alreadyEarned;
    });

    // 300ms cooldown before processing next queue item to ensure smooth UX
    setTimeout(() => {
      this.isProcessing = false;
      this.processQueue();
    }, 300);
  }

  /**
   * Internal processor for queue items
   */
  private processQueue(): void {
    if (this.isProcessing || this.currentItem !== null || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const nextItem = this.queue.shift() || null;

    if (nextItem) {
      this.currentItem = nextItem;
      this.notifyListeners();

      // Automatically dismiss popup after 2.8 seconds
      if (this.autoDismissTimeout) {
        clearTimeout(this.autoDismissTimeout);
      }
      this.autoDismissTimeout = setTimeout(() => {
        this.dismissCurrent();
      }, 2800);
    } else {
      this.isProcessing = false;
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentItem);
      } catch (err) {
        console.warn('[RewardNotificationManager] Listener notification error:', err);
      }
    });
  }

  /**
   * Get current active notification item
   */
  getCurrent(): RewardNotificationItem | null {
    return this.currentItem;
  }
}

export const rewardNotificationManager = new RewardNotificationManager();
