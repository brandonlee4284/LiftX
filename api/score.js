import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import exerciseData from '../exercise_data.json';
import { fetchPrivateUserData } from './profile';

// Calculate the percentile (score) of a user
const calculatePercentile = async (repMax, gender, age, bodyweight, exerciseName) => {
    const bwData =  exerciseData[exerciseName][gender].bw
    const ageData =  exerciseData[exerciseName][gender].age

    // Polynomial degree (assuming degree is 4 as used in the Python code)
    const degree = 4;

    // Calculate the bodyweight polynomial terms
    const bwTerms = [];
    for (let i = 0; i <= degree; i++) {
        for (let j = 0; j <= i; j++) {
            bwTerms.push(Math.pow(bodyweight, i-j) * Math.pow(repMax, j));
        }
    }

    // Calculate the age polynomial terms
    const ageTerms = [];
    for (let i = 0; i <= degree; i++) {
        for (let j = 0; j <= i; j++) {
            ageTerms.push(Math.pow(age, i-j) * Math.pow(repMax, j));
        }
    }

    // Calculate the score using the bodyweight model
    let bwScore = bwData.intercept;
    for (let i = 0; i < bwData.coefficients.length; i++) {
        bwScore += bwData.coefficients[i] * bwTerms[i];
    }

    // Calculate the score using the age model
    let ageScore = ageData.intercept;
    for (let i = 0; i < ageData.coefficients.length; i++) {
        ageScore += ageData.coefficients[i] * ageTerms[i];
    }

    // Return the average of the two scores
    return (0.5 * bwScore + 0.5 * ageScore);
}

const calculate1rm = (weight, reps) => {
    // Bryzcki Formula
    return weight * (36 / (37 - reps));
}

export const calculateScore = async (weight, reps, exerciseName) => {
    let userData = await fetchPrivateUserData()
    let bodyweight = userData.weight
    let age = userData.age
    let gender = userData.gender

    let repMax = calculate1rm(weight, reps)
    let score = await calculatePercentile(repMax, gender, age, bodyweight, exerciseName)
    
    return score
}