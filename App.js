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
import WorkoutDetailScreen from './screens/Workout/WorkoutDetailScreen';
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
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();
const Stack = createStackNavigator();

function AppTabNavigator() {
  return (
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function ProfileEditStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Edit Profile" component={ProfileEditScreen} />
    </Stack.Navigator>
  );
}

function WorkoutActivityStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Choose Workout" component={WorkoutScreen} />
    </Stack.Navigator>
  );
}

function WorkoutDetailStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
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
          <RootStack.Screen name="ProfileEdit" component={ProfileEditStack} />
          <RootStack.Screen name="Workout" component={WorkoutActivityStack} />
          <RootStack.Screen name="WorkoutDetail" component={WorkoutDetailStack} />
          <RootStack.Screen name="Setting" component={SettingStack} />
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
