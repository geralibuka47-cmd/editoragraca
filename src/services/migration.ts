
import { saveBook } from "./dataService";
import { BOOKS } from "../constants";

export const migrateDataToAppwrite = async () => {
    console.log("Starting migration to Appwrite...");
    try {
        for (const book of BOOKS) {
            await saveBook(book);
            console.log(`Migrated: ${book.title}`);
        }
        console.log("Appwrite migration completed successfully!");
    } catch (error) {
        console.error("Appwrite migration failed:", error);
    }
};
