import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Please enter email and password');
    }

    try {
      const response = await fetch('http://192.168.1.53:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert(data.message || 'Login failed');
      }

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      const userStr = await AsyncStorage.getItem('user');
      console.log('Logged-in user:', userStr);


      navigation.replace('EventList');
    } catch (error) {
      console.error(error);
      Alert.alert('Error connecting to server');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Title style={styles.header}>Login</Title>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Signup')}
        style={styles.linkButton}
      >
        Don't have an account? Sign Up
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#F5F7FA' },
  header: { fontSize: 28, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 12, backgroundColor: '#fff' },
  button: { marginTop: 12, paddingVertical: 6 },
  linkButton: { marginTop: 16, alignSelf: 'center' },
});
