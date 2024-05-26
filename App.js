import React from 'react';
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
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Workout" component={WorkoutScreen} />
      <Stack.Screen name="Start Workout" component={StartWorkoutScreen} />
    </Stack.Navigator>
  );
}

function RecordStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Record" component={RecordScreen} />
    </Stack.Navigator>
  );
}

function LeaderboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Stack.Navigator>
  );  
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Edit Profile" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator>
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

        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'Leaderboard') {
          iconName = 'podium-outline';
        } else if (route.name === 'Record') {
          iconName = 'add-circle-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-circle-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      headerShown: false
    })}
    tabBarOptions={{
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="HomeNav" component={HomeStack} />
    <Tab.Screen name="RecordNav" component={RecordStack} />
    <Tab.Screen name="LeaderboardNav" component={LeaderboardStack} />
    <Tab.Screen name="ProfileNav" component={ProfileStack} />
  </Tab.Navigator>
);

function RootNavigator() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
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
