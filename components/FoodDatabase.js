import { firebaseAuth, firebaseApp, firebaseDb } from '@/firebaseConfig';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

const flavoursFoodData = async () => {

    const flavoursArray = [];

    try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const personalisedFoodCollectionRef = collection(docRef, 'Personalised Food');

        const flavoursFoodData = await getDocs(collection(db, 'Flavours'));
        const personalisedFoodData = await getDocs(personalisedFoodCollectionRef);

        flavoursFoodData.forEach((doc) => flavoursArray.push({id: doc.id, ...doc.data()}));
        personalisedFoodData.forEach((doc) => flavoursArray.push({id: doc.id, ...doc.data()}));
    }
    catch (error) {
        console.error("Error occured when fetching data " + error)
    }
    
    return flavoursArray;
}

export default flavoursFoodData;