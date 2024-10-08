import { useEffect, useState } from 'react';
import { AppRegistry, Platform, View } from 'react-native';

import { NavigationContainer, useRoute } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from "@expo/vector-icons";

import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import LeaderboardScreen from './screens/Leaderboard/LeaderboardScreen';
import ProfileScreen from './screens/Profile/ProfileScreen';
import RecordScreen from './screens/Record/RecordScreen';
import WorkoutScreen from './screens/Workout/WorkoutScreen';
import PreviewWorkoutScreen from './screens/Workout/PreviewWorkoutScreen';
import SettingScreen from './screens/Settings/SettingScreen';
import ProfileEditScreen from './screens/Settings/ProfileEditScreen';
import PreviewProfileWorkoutScreen from './screens/Profile/PreviewProfileWorkoutScreen';
import { ThemeProvider } from './screens/ThemeProvider';

import { onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH } from './FirebaseConfig';
import OnboardingScreen from './screens/Onboarding/Onboarding';
import OnboardingQuestionsScreen from './screens/Onboarding/OnboardingQuestions';
import NavBar from './screens/Components/Navbar';
import EditWorkoutScreen from './screens/Workout/EditWorkoutScreen';
import AddFriendScreen from './screens/AddFriendScreen';
import FriendProfileScreen from './screens/Leaderboard/FriendProfileScreen';
import OnboardingInitializeScores from './screens/Onboarding/OnboardingInitializeScores';
import UpdateScoreScreen from './screens/Settings/UpdateScoreScreen';
import ForgotPasswordScreen from './screens/Auth/ForgotPasswordScreen';
import { fetchPublicUserData } from './api/profile';

AppRegistry.registerComponent('main', () => MainApp);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('main', { rootTag });
}

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PreviewWorkout" component={PreviewWorkoutScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} options={{ headerShown: false, animationEnabled: false }}/>
      <Stack.Screen name="Workout" component={WorkoutScreen} options={{ headerShown: false, animationEnabled: false }}/>
    </Stack.Navigator>
  );
}

function RecordStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Record" component={RecordScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function LeaderboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FriendProfile" component={FriendProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PreviewProfileWorkout" component={PreviewProfileWorkoutScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PreviewProfileWorkout" component={PreviewProfileWorkoutScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{ headerShown: false }} />
      <Stack.Screen name="UpdateScores" component={UpdateScoreScreen} />
    </Stack.Navigator>
  );
}

function AddFriendStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FriendProfile" component={AddFriendScreen} />
    </Stack.Navigator>
  );
}


function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="OnboardingQuestionsScreen" component={OnboardingQuestionsScreen} />
      <Stack.Screen name="OnboardingInitializeScores" component={OnboardingInitializeScores} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}



function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  /*
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);
  */

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          const db = getFirestore();
          const userDoc = doc(db, 'users', currentUser.uid); // Adjust this to your actual collection name
          const unsubscribeUserDoc = onSnapshot(userDoc, (doc) => {
            if (doc.exists()) {
              const publicUserData = doc.data();
              console.log(publicUserData.onboardingCompleted);
              setOnboardingCompleted(publicUserData.onboardingCompleted);
              setUser(currentUser);
            } else {
              // Handle the case where the document does not exist
              setUser(null);
            }
            setIsLoading(false);
          });

          return () => unsubscribeUserDoc(); // Clean up the listener when the component unmounts
        } else {
          FIREBASE_AUTH.signOut(); // Sign out if email is not verified
          setUser(null);
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribeAuth(); // Clean up the auth listener when the component unmounts
  }, []);


  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
          onboardingCompleted ? (
            <>
              <RootStack.Screen name="HomeNav" component={HomeStack} options={{ animationEnabled: false }}/>
              <RootStack.Screen name="LeaderboardNav" component={LeaderboardStack} options={{ animationEnabled: false }}/>
              <RootStack.Screen name="ProfileNav" component={ProfileStack} options={{ animationEnabled: false }}/>

              <RootStack.Screen name="Setting" component={SettingStack} />
              <RootStack.Screen name="AddFriend" component={AddFriendStack} />
            </>
          ) : (
            <RootStack.Screen name="Onboarding" component={OnboardingStack} />
          )
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
    </RootStack.Navigator>
  );
}



function MainApp() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default MainApp;
