import { JournalEntry, Goal, ChatSession, UserProfile, DailyState } from '../types';

const DB_NAME = 'MentorMindDB';
const DB_VERSION = 1;

export class MentorMindDB {
  private static db: IDBDatabase | null = null;

  public static async init(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Journals store
        if (!db.objectStoreNames.contains('journals')) {
          db.createObjectStore('journals', { keyPath: 'id' });
        }

        // Goals store
        if (!db.objectStoreNames.contains('goals')) {
          db.createObjectStore('goals', { keyPath: 'id' });
        }

        // Chat History store
        if (!db.objectStoreNames.contains('chatSessions')) {
          db.createObjectStore('chatSessions', { keyPath: 'id' });
        }

        // Settings / Profile store (simple key-value)
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }

        // Daily cards store
        if (!db.objectStoreNames.contains('dailyCards')) {
          db.createObjectStore('dailyCards', { keyPath: 'date' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  // --- JOURNALS ---
  public static async saveJournal(journal: JournalEntry): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('journals', 'readwrite');
      const store = transaction.objectStore('journals');
      const request = store.put(journal);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public static async getJournals(): Promise<JournalEntry[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('journals', 'readonly');
      const store = transaction.objectStore('journals');
      const request = store.getAll();

      request.onsuccess = () => {
        const journals = request.result as JournalEntry[];
        // Sort newest first
        journals.sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
        resolve(journals);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public static async deleteJournal(id: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('journals', 'readwrite');
      const store = transaction.objectStore('journals');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- GOALS ---
  public static async saveGoal(goal: Goal): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('goals', 'readwrite');
      const store = transaction.objectStore('goals');
      const request = store.put(goal);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public static async getGoals(): Promise<Goal[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('goals', 'readonly');
      const store = transaction.objectStore('goals');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as Goal[]);
      request.onerror = () => reject(request.error);
    });
  }

  public static async deleteGoal(id: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('goals', 'readwrite');
      const store = transaction.objectStore('goals');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- CHAT SESSIONS ---
  public static async saveChatSession(session: ChatSession): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chatSessions', 'readwrite');
      const store = transaction.objectStore('chatSessions');
      const request = store.put(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public static async getChatSessions(): Promise<ChatSession[]> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chatSessions', 'readonly');
      const store = transaction.objectStore('chatSessions');
      const request = store.getAll();

      request.onsuccess = () => {
        const sessions = request.result as ChatSession[];
        sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        resolve(sessions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public static async deleteChatSession(id: string): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chatSessions', 'readwrite');
      const store = transaction.objectStore('chatSessions');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- SETTINGS / USER PROFILE ---
  public static async saveUserProfile(profile: UserProfile): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('settings', 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put(profile, 'userProfile');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public static async getUserProfile(): Promise<UserProfile | null> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('settings', 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get('userProfile');

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // --- DAILY CARDS / DYNAMIC FOCUS ---
  public static async saveDailyState(daily: DailyState): Promise<void> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('dailyCards', 'readwrite');
      const store = transaction.objectStore('dailyCards');
      const request = store.put(daily);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public static async getDailyState(date: string): Promise<DailyState | null> {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('dailyCards', 'readonly');
      const store = transaction.objectStore('dailyCards');
      const request = store.get(date);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // --- CLEAR DATABASE ---
  public static async resetDatabase(): Promise<void> {
    const db = await this.init();
    db.close();
    this.db = null;

    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}
