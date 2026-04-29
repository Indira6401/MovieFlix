//Previously implemented using appwrite and swithed to firebase, keeping the code for reference and future use if needed
import {Client, Databases, Query, ID} from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const TABLE_NAME = import.meta.env.VITE_APPWRITE_TABLE_NAME;

//connect to appwrite server
const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
  .setProject(PROJECT_ID); // Your project ID

const database = new Databases(client);

export const updateSearchTermCount = async (searchTerm, movie) => {
 //1. use Appwrite SDK to check if the search term exists in the DB
    try { 
        const result = await database.listDocuments(DATABASE_ID, TABLE_NAME, [Query.equal("searchTerm", searchTerm)]);

        //2. if it exists, update the count
        if(result.documents.length > 0) {
        const updatedCount = result.documents[0].count + 1;
            await database.updateDocument(DATABASE_ID, TABLE_NAME, result.documents[0].$id, {count: updatedCount});
        }
        //3. if it doesn't exist, create a new record/document with searchTerm and set the count -> 1
        else {
        await database.createDocument(DATABASE_ID, TABLE_NAME, ID.unique(), { 
            searchTerm,
            count: 1,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        });
        }
     }
    catch (error) {
        console.error("Error updating search term count:", error);
    }
    
 
}

export const getTrendingMovies = async () => {
    try { 
        const result = await database.listDocuments(DATABASE_ID, TABLE_NAME, 
            [
                Query.orderDesc("count"),
                Query.limit(5)
            ]);
        return result.documents;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
}