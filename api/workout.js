import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { dayExist } from './splits';
import exerciseData from '../exercise_data.json';
import { fetchAsyncCloud, setAsyncCloud } from './helperFuncs';
import { calculateScore, calculate1rm } from './score';
import dayjs from "dayjs";
import { fetchPublicUserData } from './profile';

export const createPrivateWorkout = async (data) => {
    //console.log('Saving workout data to Firestore:', data.stats.arms);
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'workout'), '@PrivateUserWorkout', data);
    //console.log('Workout data successfully saved to Firestore.');
};

export const fetchPrivateWorkout = async () => {
    return await fetchAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'workout'), '@PrivateUserWorkout');
}

export const updateExerciseStats = async (workouDetails) => {
    //console.log('Fetching private workout data...');
    let workoutData = await fetchPrivateWorkout();
    //console.log('Workout data fetched:', workoutData);

    let stats = workoutData.stats;
    //console.log('Stats:', stats);

    if (!stats) {
        console.error('Stats not found in workout data.');
        return;
    }

    // Calculate the 1RM and score for each exercise
    for (const exercise of workouDetails) {
        const { name, sets, reps, weight } = exercise;
        //console.log(`Processing exercise: ${name}`);

        if (exerciseData[name]) {
            //console.log(`Exercise data found for ${name}`);
            const group = exerciseData[name].group.toLowerCase();
            const repMax = calculate1rm(weight, reps);
            const score = await calculateScore(weight, reps, name);
            //console.log(`Group: ${group}, repMax: ${repMax}, score: ${score}`);

            // Add the current day's sets to the totalSets array
            const now = dayjs().toString();
            const setArr = [];
            for (let i = 0; i < sets; i++) {
                setArr.push(now);
            }
            //console.log('Set array:', setArr);

            // Ensure the group exists in stats
            
            if (!stats[group]) {
                //console.log(`Group ${group} not found in stats. Creating new group.`);
                stats[group] = {};
            }
            

            // Update the sets for the exercise
            if (stats[group][name]) {
                //console.log(`Updating existing exercise ${name} in group ${group}`);
                stats[group][name].totalSets.push(...setArr);
            } else {
                //console.log(`Creating new exercise entry for ${name} in group ${group}`);
                stats[group][name] = {
                    totalSets: setArr,
                    repMax: repMax,
                    change: score, // Initial change is the score itself
                    score: score,
                };
            }

            // Update the repMax, change, and score for the exercise
            stats[group][name].repMax = repMax;
            stats[group][name].change = score - (stats[group][name].score || 0);
            stats[group][name].score = score;
            //console.log(`Updated exercise stats for ${name}:`, stats[group][name]);
        } else {
            console.warn(`Exercise data for ${name} not found.`);
        }
    }

    workoutData.stats = stats;
    //console.log('Updated workout data stats:', workoutData.stats);
    await createPrivateWorkout(workoutData);
    console.log('Workout data saved.');
}

export const updateOverallStats = async () => {
    
    let workoutData = await fetchPrivateWorkout();
    let stats = workoutData.stats;
    let overallScore = workoutData.overallScore;

    const muscleGroups = ['chest', 'back', 'legs', 'arms', 'shoulders', 'core'];
    let totalOverallChestScore = 0;
    let totalOverallBackScore = 0;
    let totalOverallShoulderScore = 0;
    let totalOverallArmScore = 0;
    let totalOverallLegScore = 0;
    let totalOverallScoreWeighted = 0;

    const now = dayjs();
    const oneMonthAgo = now.subtract(1, 'month');

    if (!overallScore.overall) {
        overallScore.overall = { change: 0, score: 0};
    }
    
    // Calculate the overall score for each muscle group
    muscleGroups.forEach(muscleGroup => {
        const exercises = stats[muscleGroup];
        let score = 0; // Initialize score variable

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

        if(muscleGroup === 'chest'){
            totalOverallChestScore += score;
        } else if (muscleGroup === 'back'){
            totalOverallBackScore += score;
        } else if (muscleGroup === 'shoulders'){
            totalOverallShoulderScore += score;
        } else if (muscleGroup === 'arms'){
            totalOverallArmScore += score;
        } else if (muscleGroup === 'legs'){
            totalOverallLegScore += score;
        }
        overallScore[muscleGroup].change = score - overallScore[muscleGroup].score;
        overallScore[muscleGroup].score = score;
    });

    // Update the overall score
    // weighted average of all muscle groups 
    // Chest: 0.1, Back: 0.25, Shoulders: 0.1, Arms: 0.25, Legs: 0.3,
    totalOverallScoreWeighted = totalOverallChestScore*0.1 + totalOverallBackScore*0.25 + totalOverallShoulderScore*0.1 + totalOverallArmScore*0.25 + totalOverallLegScore*0.3

    overallScore.overall.change = (totalOverallScoreWeighted) - overallScore.overall.score;
    overallScore.overall.score = totalOverallScoreWeighted; 

    workoutData.overallScore = overallScore;
    await createPrivateWorkout(workoutData);
}

// syncs scores in workout with public displayScores
export const syncScores = async () => {
    try {
        // Fetch the private workout data
        console.log('Fetching private workout data...');
        let workoutData = await fetchPrivateWorkout();
        console.log('Private workout data fetched:', workoutData);

        // Fetch the public user data
        console.log('Fetching public user data...');
        const publicUserData = await fetchPublicUserData();
        console.log('Public user data fetched:', publicUserData);

        // Extract the overall scores from the private workout data
        let overallScore = workoutData.overallScore;
        console.log('Overall scores:', overallScore);

        // Ensure overallScore is present in the private workout data
        if (!overallScore) {
            console.error('Overall scores not found in workout data.');
            return;
        }

        // Update the public displayScore with the scores from the private workout data
        const muscleGroups = ['arms', 'chest', 'back', 'shoulders', 'legs', 'overall'];
        muscleGroups.forEach(group => {
            if (overallScore[group]) {
                publicUserData.displayScore[group].score = overallScore[group].score;
                publicUserData.displayScore[group].change = overallScore[group].change;
            } else {
                console.warn(`Score for muscle group ${group} not found in workout data.`);
            }
        });

        // Save the updated public user data back to Firestore
        console.log('Saving updated public user data to Firestore:', publicUserData);
        await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);
        console.log('Public user data successfully saved.');
    } catch (error) {
        console.error('Error syncing scores:', error);
    }
};


// checks if any exercise names are not in exercise_data.json
// workouDetails format: [{name, ...}, {name, ...}, ...]
export const customExerciseExist = async (workoutDetails) => {
    // Iterate over each workout detail
    for (let detail of workoutDetails) {
        // Check if the exercise name is in the exerciseData keys
        if (!exerciseData.hasOwnProperty(detail.name)) {
            // Return true if an exercise name is not found
            return true;
        }
    }
    // Return false if all exercise names are found in exerciseData
    return false;
};

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

