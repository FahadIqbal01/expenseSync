import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screen components from their folder
import SignUpScreen from './src/screens/SignUpScreen';
// Import LoginScreen when ready:
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignUp"
        screenOptions={{
          headerShown: false, // Hides default navigation header bar
        }}
      >
        {/* Sign Up Screen Route */}
        <Stack.Screen name="SignUp" component={SignUpScreen} />

        {/* Register LoginScreen here once created */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
