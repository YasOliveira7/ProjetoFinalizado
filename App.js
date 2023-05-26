import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import firebase from 'firebase';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAKXEnGctQqHBMQyHNDHtdbaQW06T_WNqk",
  authDomain: "login-74476.firebaseapp.com",
  projectId: "login-74476",
  storageBucket: "login-74476.appspot.com",
  messagingSenderId: "14047988404",
  appId: "1:14047988404:web:130df05ef24dc154d7a5e1"
};


if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setEmailVerified(user.emailVerified);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then((userCredential) => {
        // Autenticação bem-sucedida
        console.log('Usuário autenticado:', userCredential.user);
        // Verifique se o email foi verificado
        if (userCredential.user.emailVerified) {
          console.log('Email verificado');
          setEmailVerified(true);
        } else {
          console.log('Email não verificado');
          setEmailVerified(false);
          Alert.alert('Verifique seu email', 'Você ainda não verificou seu endereço de email. Verifique seu email antes de prosseguir.');
        }
      })
      .catch((error) => {
        // Erro durante a autenticação
        console.log('Erro de autenticação:', error);
        Alert.alert('Erro', 'Falha na autenticação. Verifique seu email e senha.');
      });
  };

  const handleForgotPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(username)
      .then(() => {
        // Email de recuperação de senha enviado com sucesso
        console.log('Email de recuperação de senha enviado');
        Alert.alert('Sucesso', 'Um email de recuperação de senha foi enviado para o seu endereço de email.');
      })
      .catch((error) => {
        // Erro ao enviar email de recuperação de senha
        console.log('Erro ao enviar email de recuperação de senha:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao enviar o email de recuperação de senha. Verifique seu endereço de email.');
      });
  };

  return (
    <View style={styles.container}>
      {emailVerified && (
        <Text style={styles.emailVerifiedText}>Email verificado</Text>
      )}
      {!emailVerified && (
        <Text style={styles.emailNotVerifiedText}>Email não verificado</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Esqueci minha senha" onPress={handleForgotPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    padding: 10,
  },
  emailVerifiedText: {
    color: 'green',
    marginBottom: 10,
  },
  emailNotVerifiedText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;