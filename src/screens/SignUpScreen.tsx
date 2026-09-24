import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const SignUpScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form Validation Logic
  const validateForm = () => {
    if (!userName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('All fields are required. Please enter details.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  // Sign-Up Handler & AsyncStorage Logic
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        userName: userName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      // Save user details locally in AsyncStorage
      await AsyncStorage.setItem('@user_credentials', JSON.stringify(userData));

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset input fields
            setUserName('');
            setEmail('');
            setPassword('');
            setErrorMessage('');

            // Navigate to Login screen
            if (navigation) {
              navigation.navigate('Login');
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Failed to save user data:', error);
      setErrorMessage(
        'An error occurred while saving your data. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          {/* Validation Error Banner */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[
                styles.input,
                errorMessage && !userName ? styles.inputError : null,
              ]}
              placeholder="Enter your username"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                errorMessage && !email ? styles.inputError : null,
              ]}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                errorMessage && !password ? styles.inputError : null,
              ]}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Toggle Navigation to Login */}
            <View style={styles.loginPrompt}>
              <Text style={styles.promptText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation && navigation.navigate('Login')}
              >
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  button: {
    height: 50,
    backgroundColor: '#0066CC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  promptText: {
    fontSize: 14,
    color: '#64748B',
  },
  loginLink: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
  },
});
