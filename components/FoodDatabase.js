import { firebaseAuth, firebaseApp, firebaseDb } from '@/firebaseConfig';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

const foodDatabase = async () => {

    const totalFoodDatabaseArray = [];

    try {

        const deckFoodData = await getDocs(collection(db, 'Deck'));
        const fineFoodsFoodData = await getDocs(collection(db, 'Fine Foods'));
        const flavoursFoodData = await getDocs(collection(db, 'Flavours'));
        const frontierFoodData = await getDocs(collection(db, 'Frontier'));
        const pgpFoodData = await getDocs(collection(db, 'PGP'));
        const technoFoodData = await getDocs(collection(db, 'Techno'));
        const terraceFoodData = await getDocs(collection(db, 'Terrace'));
        
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const personalisedFoodCollectionRef = collection(docRef, 'Personalised Food');
        const personalisedFoodData = await getDocs(personalisedFoodCollectionRef);

        flavoursFoodData.forEach((doc) => totalFoodDatabaseArray.push(doc.data()));
        fineFoodsFoodData.forEach((doc) => totalFoodDatabaseArray.push(doc.data()));
        technoFoodData.forEach((doc) => totalFoodDatabaseArray.push(doc.data()));
        pgpFoodData.forEach((doc) => totalFoodDatabaseArray.push(doc.data()));
        deckFoodData.forEach((doc) => totalFoodDatabaseArray.push(doc.data()));
        frontierFoodData.forEach((doc) => totalFoodDatabaseArray.push(doc.data()));
        terraceFoodData.forEach((doc) => totalFoodDatabaseArray.push(doc.data()));
        personalisedFoodData.forEach((doc) => totalFoodDatabaseArray.push(doc.data()));

    }
    catch (error) {
        console.error("Error occured when fetching data " + error)
    }
    
    return totalFoodDatabaseArray;
}

export default foodDatabase;