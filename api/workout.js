import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { dayExist } from './splits';
import exerciseData from '../exercise_data.json';
import { fetchAsyncCloud, setAsyncCloud } from './helperFuncs';
import { calculateScore } from './score';

export const createPrivateWorkout = async (data) => {
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'workout'), '@PrivateUserWorkout', data);
};

export const fetchPrivateWorkout = async () => {
    return await fetchAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUserer.uid, 'private', 'workout'), '@PrivateUserWorkout');
}

export const updateExerciseStats = async (workouDetails) => {
    let workoutData = await fetchPrivateWorkout();
    let stats = workoutData.stats;

    // Calculate the 1RM and score for each exercise
    for (const exercise of workouDetails) {
        const {name, sets, reps, weight} = exercise;

        const group = exerciseData[name].group;
        const repMax = calculate1rm(weight, reps);
        const score = await calculateScore(weight, reps, name);

        // Add the current days sets to the totalSets array
        const now = dayjs().toString()
        const setArr = []
        for (let i = 0; i < sets; i++) {
            setArr.push(now);
        }

        // Update the sets for the exercise
        if (stats[group][name]) {
            stats[group][name].totalSets.push(...setArr)
        } else {
            stats[group][name] = {
                totalSets: setArr,
            }
        }
        // Update the repMax, change, and score for the exercise
        stats[group][name].repMax = repMax;
        stats[group][name].change = score - stats[group][name].score;
        stats[group][name].score = score;
    }

    workoutData.stats = stats;
    createPrivateWorkout(workoutData);
}

export const updateOverallStats = async () => {
    let workoutData = await fetchPrivateWorkout();
    let stats = workoutData.stats;
    let overallScore = workoutData.overallScore;

    const muscleGroups = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core'];
    let totalOverallScore = 0;

    const now = dayjs();
    const oneMonthAgo = now.subtract(1, 'month');

    // Calculate the overall score for each muscle group
    muscleGroups.forEach(muscleGroup => {
        const exercises = stats[muscleGroup];
        if (exercises) {
            let totalScore = 0;
            let totalSets = 0;

            // Calculate the score for each exercise in the muscle group
            for (const [exerciseName, exercise] of Object.entries(exercises)) {
                // Perform a weighted average of the scores for each exercise proportional to the number of sets in last month
                const setsInLastMonth = exercise.totalSets.filter(setDate => dayjs(setDate).isAfter(oneMonthAgo)).length;
                totalScore += exercise.score * setsInLastMonth;
                totalSets += setsInLastMonth;
            }

            // Error handling
            if (totalSets > 0) {
                score = totalScore / totalSets;
            } else {
                score = 0;
            }
        } else {
            score = 0;
        }

        totalOverallScore += score;
        overallScore[muscleGroup].change = score - overallScore[muscleGroup].score;
        overallScore[muscleGroup].score = score;
    });

    // Update the overall score
    overallScore.overall.change = totalOverallScore - overallScore.overall.score;
    overallScore.overall.score = totalOverallScore;

    workoutData.overallScore = overallScore;
    createPrivateWorkout(workoutData);
}


// given a dayName and a split, returns the day in that split
export const getWorkoutDay = async (dayName, split) => {
    try {
        // Find the day in the split by dayName
        const day = split.days.find(day => day.dayName === dayName);

        // If the day is found, return it
        if (day) {
            return day;
        } else {
            throw new Error(`Day with name ${dayName} not found in split ${split.splitName}`);
        }
    } catch (error) {
        console.error('Error getting workout day:', error);
        throw error;
    }
};

export const newWorkoutDay = async (splitName) => {
    try {
        let dayName = "Day 1";
        let counter = 1;

        // Check if the dayName exists and increment the counter until a unique name is found
        while (await dayExist(splitName, dayName)) {
            counter++;
            dayName = `Day ${counter}`;
        }

        const emptyDay = {
            dayName,
            exercises: []
        };
        return emptyDay;
    } catch (error) {
        console.error('Error creating new workout day:', error);
        throw error;
    }
};

