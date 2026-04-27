import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION = "moviemetrics";

export const updateSearchTermCount = async (searchTerm, movie) => {
  try {
    const q = query(collection(db, COLLECTION), where("searchTerm", "==", searchTerm));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = doc(db, COLLECTION, snapshot.docs[0].id);
      await updateDoc(docRef, { count: snapshot.docs[0].data().count + 1 });
    } else {
      await addDoc(collection(db, COLLECTION), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search term count:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy("count", "desc"), limit(5));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};
