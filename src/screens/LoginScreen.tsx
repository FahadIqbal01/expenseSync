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
import { StorageService } from '../utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('All fields are required. Please enter details.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleLoginPress = async () => {
    if (!validateForm()) {
      return;
    }

    const storedUser = await StorageService.getUserCredentials();

    if (!storedUser) {
      setErrorMessage('No account found. Please sign up first.');
      return;
    }

    const isEmailMatch =
      storedUser.email.toLowerCase() === email.trim().toLowerCase();
    const isPasswordMatch = storedUser.password === password;

    if (isEmailMatch && isPasswordMatch) {
      setErrorMessage('');

      await StorageService.saveUserSession({
        isLoggedIn: true,
        user: storedUser.userName,
      });

      Alert.alert('Success', `Welcome back, ${storedUser.userName}!`, [
        {
          text: 'OK',
          onPress: () => {
            setEmail('');
            setPassword('');
            if (navigation) {
              navigation.navigate('Home');
            }
          },
        },
      ]);
    } else {
      setErrorMessage('Login unsuccessful. Invalid email or password.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
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

            <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.signupPrompt}>
              <Text style={styles.promptText}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation && navigation.navigate('SignUp')}
              >
                <Text style={styles.signupLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    paddingTop: 60,
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
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  promptText: {
    fontSize: 14,
    color: '#64748B',
  },
  signupLink: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
  },
});
