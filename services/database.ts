
import { Monument, User, Contribution, POI, Badge } from '../types';
import { MONUMENTS, POIS, BADGES } from '../constants';

// DB Config
const DB_NAME = 'TourGuideDB';
const DB_VERSION = 3; // Version 3: Added 'synced' index
const STORES = {
  USERS: 'users',
  MONUMENTS: 'monuments',
  POIS: 'pois',
  CONTRIBUTIONS: 'contributions',
  BADGES: 'badges'
};

class DatabaseService {
  private db: IDBDatabase | null = null;

  // Initialize the Database
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error("Database error: ", event);
        reject("Database failed to open");
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.seedData(); // Ensure default data exists
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = (event.target as IDBOpenDBRequest).transaction;
        
        // User Store
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          db.createObjectStore(STORES.USERS, { keyPath: 'email' });
        }

        // Monuments Store
        if (!db.objectStoreNames.contains(STORES.MONUMENTS)) {
          db.createObjectStore(STORES.MONUMENTS, { keyPath: 'id' });
        }

        // POIs Store
        if (!db.objectStoreNames.contains(STORES.POIS)) {
          db.createObjectStore(STORES.POIS, { keyPath: 'id' });
        }
        
        // Badges Store
        if (!db.objectStoreNames.contains(STORES.BADGES)) {
          db.createObjectStore(STORES.BADGES, { keyPath: 'id' });
        }

        // Contributions Store
        let contribStore;
        if (!db.objectStoreNames.contains(STORES.CONTRIBUTIONS)) {
            contribStore = db.createObjectStore(STORES.CONTRIBUTIONS, { keyPath: 'id', autoIncrement: true });
            contribStore.createIndex('monumentId', 'monumentId', { unique: false });
            contribStore.createIndex('synced', 'synced', { unique: false });
        } else {
            contribStore = transaction?.objectStore(STORES.CONTRIBUTIONS);
            if (contribStore && !contribStore.indexNames.contains('synced')) {
                 contribStore.createIndex('synced', 'synced', { unique: false });
            }
        }
      };
    });
  }

  // Seed initial monuments if they don't exist
  private async seedData() {
    if (!this.db) return;
    
    const transaction = this.db.transaction([STORES.MONUMENTS, STORES.POIS], 'readwrite');
    
    // Always update monuments to latest constants
    const monumentStore = transaction.objectStore(STORES.MONUMENTS);
    MONUMENTS.forEach(m => monumentStore.put(m));

    // Always update POIs
    const poiStore = transaction.objectStore(STORES.POIS);
    POIS.forEach(p => poiStore.put(p));
    
    console.log("Database synced with latest Monuments and POIs.");
  }

  // --- USER METHODS ---
  async saveUser(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction([STORES.USERS], 'readwrite');
      const store = transaction?.objectStore(STORES.USERS);
      const request = store?.put(user);
      
      if (request) {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }
    });
  }

  async getUser(email: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = this.db?.transaction([STORES.USERS], 'readonly');
      const store = transaction?.objectStore(STORES.USERS);
      const request = store?.get(email);
      
      if (request) {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }
    });
  }

  // --- MONUMENT METHODS ---
  async getAllMonuments(): Promise<Monument[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
          resolve([]);
          return;
      }
      const transaction = this.db.transaction([STORES.MONUMENTS], 'readonly');
      const store = transaction.objectStore(STORES.MONUMENTS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPOIs(): Promise<POI[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
          resolve([]);
          return;
      }
      const transaction = this.db.transaction([STORES.POIS], 'readonly');
      const store = transaction.objectStore(STORES.POIS);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // --- CONTRIBUTION METHODS ---
  async getContributions(monumentId: string): Promise<Contribution[]> {
    return new Promise((resolve, reject) => {
        if (!this.db) {
            resolve([]);
            return;
        }
        const transaction = this.db.transaction([STORES.CONTRIBUTIONS], 'readonly');
        const store = transaction.objectStore(STORES.CONTRIBUTIONS);
        const index = store.index('monumentId');
        const request = index.getAll(monumentId);
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
  }

  async addContribution(contribution: Omit<Contribution, 'id'>): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = this.db?.transaction([STORES.CONTRIBUTIONS], 'readwrite');
        const store = transaction?.objectStore(STORES.CONTRIBUTIONS);
        const request = store?.add(contribution);
        
        if(request) {
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        }
    });
  }

  // --- SYNC METHODS ---
  async getUnsyncedContributions(): Promise<Contribution[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve([]); return; }
      const transaction = this.db.transaction([STORES.CONTRIBUTIONS], 'readonly');
      const store = transaction.objectStore(STORES.CONTRIBUTIONS);
      const index = store.index('synced');
      // Use 0 for false, as boolean is not a valid IDBKey
      const request = index.getAll(0); 

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async markContributionSynced(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) { resolve(); return; }
      const transaction = this.db.transaction([STORES.CONTRIBUTIONS], 'readwrite');
      const store = transaction.objectStore(STORES.CONTRIBUTIONS);
      
      const getReq = store.get(id);
      getReq.onsuccess = () => {
          const record = getReq.result;
          if (record) {
              record.synced = 1;
              store.put(record);
          }
          resolve();
      };
      getReq.onerror = () => reject(getReq.error);
    });
  }
}

export const db = new DatabaseService();
