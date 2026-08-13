import { storage, storageReady } from '@/store/storage';
import NetInfo from '@react-native-community/netinfo';
import { toggleBookmark, registerForEvent } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';

export interface QueueTask {
  id: string;
  type: string;
  payload: any;
  createdAt: string;
}

type TaskProcessor = (task: QueueTask) => Promise<boolean>;

class RequestQueue {
  private queue: QueueTask[] = [];
  private processing = false;
  private processors: Record<string, TaskProcessor> = {};
  private PERSIST_KEY = 'FEEDX_OFFLINE_MUTATION_QUEUE';

  constructor() {
    this.loadQueue();
    // Subscribe to online status to auto-flush the queue when connection is restored
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.flush();
      }
    });
  }

  public registerProcessor(type: string, processor: TaskProcessor) {
    this.processors[type] = processor;
  }

  public async enqueue(type: string, payload: any) {
    const task: QueueTask = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      payload,
      createdAt: new Date().toISOString()
    };
    this.queue.push(task);
    await this.saveQueue();
    this.flush();
  }

  public async flush() {
    if (this.processing) return; // Mutex lock
    this.processing = true;

    while (this.queue.length > 0) {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        break; // Halt execution if offline
      }

      const task = this.queue[0];
      const processor = this.processors[task.type];

      if (processor) {
        let attempts = 0;
        let success = false;
        const maxAttempts = 3;

        while (attempts < maxAttempts && !success) {
          try {
            success = await processor(task);
            if (success) {
              this.queue.shift(); // FIFO Consume
              await this.saveQueue();
            } else {
              this.queue.shift();
              await this.saveQueue();
              break;
            }
          } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
              console.warn(`[RequestQueue] Task ${task.id} failed after ${maxAttempts} attempts:`, error);
              break;
            }
            // Exponential backoff delay: 1000ms, 2000ms, 4000ms
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempts) * 500));
          }
        }

        if (!success && attempts >= maxAttempts) {
          break; // Pause queue execution until next connection change event
        }
      } else {
        this.queue.shift();
        await this.saveQueue();
      }
    }

    this.processing = false;
  }

  private async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return !!state.isConnected;
  }

  private async saveQueue() {
    try {
      await storageReady;
      storage.set(this.PERSIST_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.warn('[RequestQueue] Failed to persist queue:', e);
    }
  }

  private async loadQueue() {
    try {
      await storageReady;
      const persisted = storage.getString(this.PERSIST_KEY);
      if (persisted) {
        this.queue = JSON.parse(persisted);
        this.flush();
      }
    } catch (e) {
      console.warn('[RequestQueue] Failed to restore queue:', e);
    }
  }
}

export const requestQueue = new RequestQueue();

// Register Core Processors
requestQueue.registerProcessor('TOGGLE_BOOKMARK', async (task) => {
  const { userId, entityType, entityId } = task.payload;
  await toggleBookmark(userId, entityType, entityId);
  return true;
});

requestQueue.registerProcessor('REGISTER_EVENT', async (task) => {
  const { eventId, studentId } = task.payload;
  await registerForEvent(eventId, studentId);
  return true;
});

requestQueue.registerProcessor('UPDATE_TASK_STATUS', async (task) => {
  const { id, status } = task.payload;
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
  if (error) throw error;
  return true;
});

requestQueue.registerProcessor('ADD_TASK', async (task) => {
  const { title, description, priority, deadline, user_id } = task.payload;
  const { error } = await supabase.from('tasks').insert({
    title,
    description,
    priority,
    deadline: deadline || null,
    user_id,
    status: 'Pending'
  });
  if (error) throw error;
  return true;
});
