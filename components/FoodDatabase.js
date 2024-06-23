import { firebaseAuth, firebaseApp, firebaseDb } from '@/firebaseConfig';
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from "firebase/firestore";

const app = firebaseApp;
const auth = firebaseAuth;
const db = firebaseDb;

const flavoursFoodData = async () => {

    const flavoursArray = [];

    try {
        const foodData = await getDocs(collection(db, 'Flavours'));
        foodData.forEach((doc) => flavoursArray.push(doc.data()))
    }
    catch (error) {
        console.error("Error occured when fetching data " + error)
    }
    
    return flavoursArray;
}

export default flavoursFoodData;