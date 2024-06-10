import { useEffect, useState } from 'react';
import { AppRegistry, Platform } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
import ProfileEditScreen from './screens/Profile/ProfileEditScreen';
import SettingScreen from './screens/Profile/SettingScreen';

import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

AppRegistry.registerComponent('main', () => MainApp);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('main', { rootTag });
}

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#121212' }, // Set the header background color to black
      headerTintColor: 'white', // Set the header text color to white
    }}
    >
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
      <Stack.Screen name="Edit Profile" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator 
    screenOptions={{
      headerStyle: { backgroundColor: '#121212' }, // Set the header background color to black
      headerTintColor: 'white', // Set the header text color to white
    }}
    >
      <Stack.Screen name="Settings" component={SettingScreen} />
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

const AppTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'HomeNav') {
          iconName = 'home-outline';
        } else if (route.name === 'LeaderboardNav') {
          iconName = 'podium-outline';
        } else if (route.name === 'RecordNav') {
          iconName = 'add-circle-outline';
        } else if (route.name === 'ProfileNav') {
          iconName = 'person-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false,
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: [
        {
          display: "flex",
          backgroundColor: "#121212",
          borderTopWidth: 0,
        }
      ], 
      tabBarShowLabel: false,
    })}
  >
    <Tab.Screen name="HomeNav" component={HomeStack} />
    <Tab.Screen name="RecordNav" component={RecordStack} />
    <Tab.Screen name="LeaderboardNav" component={LeaderboardStack} />
    <Tab.Screen name="ProfileNav" component={ProfileStack} />
  </Tab.Navigator>
);

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
          <RootStack.Screen name="App" component={AppTabNavigator} />
          <RootStack.Screen name="Setting" component={SettingStack} />
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
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default MainApp;
