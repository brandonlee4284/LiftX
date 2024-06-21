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
import StartWorkoutScreen from './screens/Workout/StartWorkoutScreen';
import SettingScreen from './screens/Settings/SettingScreen';
import ProfileEditScreen from './screens/Settings/ProfileEditScreen';

import { ThemeProvider } from './screens/ThemeProvider';

import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import OnboardingScreen from './screens/Onboarding/Onboarding';
import OnboardingQuestionsScreen from './screens/Onboarding/OnboardingQuestions';
import NavBar from './screens/Components/Navbar';

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
      <Stack.Screen name="Workout" component={WorkoutScreen} />
      <Stack.Screen name="Start Workout" component={StartWorkoutScreen} />
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
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

function OnboardingQuestionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingQuestionsScreen" component={OnboardingQuestionsScreen} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}



function RootNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {/*<RootStack.Screen name="App" component={AppTabNavigator} />*/}
          
          <RootStack.Screen name="HomeNav" component={HomeStack} options={{ animationEnabled: false }}/>
          <RootStack.Screen name="LeaderboardNav" component={LeaderboardStack} options={{ animationEnabled: false }}/>
          <RootStack.Screen name="ProfileNav" component={ProfileStack} options={{ animationEnabled: false }}/>

          <RootStack.Screen name="Setting" component={SettingStack} />
          <RootStack.Screen name="Onboarding" component={OnboardingStack} />
          <RootStack.Screen name="OnboardingQuestions" component={OnboardingQuestionsStack} />
          {/* ADD DMS????? <-?, FRIENDS TAB */}
        </>
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
