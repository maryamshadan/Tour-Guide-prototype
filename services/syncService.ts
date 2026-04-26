
import { db } from './database';
import { Contribution } from '../types';
import { firestoreDB } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore"; 

class SyncService {
    private isSyncing = false;

    async syncContributions(): Promise<number> {
        if (this.isSyncing || !navigator.onLine) return 0;
        
        this.isSyncing = true;
        let syncedCount = 0;

        try {
            const pending = await db.getUnsyncedContributions();
            
            if (pending.length === 0) {
                this.isSyncing = false;
                return 0;
            }

            console.log(`[CloudSync] Found ${pending.length} items to sync...`);

            for (const item of pending) {
                let success = false;

                if (firestoreDB) {
                    // --- REAL BACKEND MODE ---
                    try {
                        // We delete the local ID before sending to cloud (let Firestore generate one)
                        const { id, synced, ...dataPayload } = item;
                        await addDoc(collection(firestoreDB, "contributions"), {
                            ...dataPayload,
                            syncedAt: new Date().toISOString()
                        });
                        success = true;
                        console.log(`[CloudSync] Item uploaded to Firestore.`);
                    } catch (err) {
                        console.error("[CloudSync] Upload Failed:", err);
                    }
                } else {
                    // --- SIMULATION MODE ---
                    // If no firebase config, we simulate a network delay and 'fake' sync
                    await new Promise(resolve => setTimeout(resolve, 800));
                    success = true; // Assume success for demo purposes
                    console.log(`[CloudSync] (Simulated) Item synced.`);
                }
                
                // Mark as synced in local DB if successful
                if (success && item.id) {
                    await db.markContributionSynced(item.id);
                    syncedCount++;
                }
            }
        } catch (error) {
            console.error("[CloudSync] General Error:", error);
        } finally {
            this.isSyncing = false;
        }

        return syncedCount;
    }
}

export const syncService = new SyncService();
