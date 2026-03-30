import { db } from './firebase-config.js';
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

/**
 * Get all team members ordered by display order
 */
export async function getTeamMembers() {
    try {
        const q = query(collection(db, "team"), orderBy("displayOrder", "asc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching team members:", error);
        return [];
    }
}

/**
 * Get a single team member by ID
 */
export async function getTeamMemberById(id) {
    try {
        const docRef = doc(db, "team", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching team member:", error);
        return null;
    }
}
