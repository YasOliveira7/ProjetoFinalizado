import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from './LoginScreen';

// Mock para firebase.auth
jest.mock('firebase', () => {
  return {
    auth: jest.fn(() => ({
      onAuthStateChanged: jest.fn((callback) => {
        // Simulando um usuário autenticado
        callback({ emailVerified: true });
        return jest.fn();
      }),
      signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { emailVerified: true } })),
      sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
    })),
    apps: {
      length: 0,
      initializeApp: jest.fn(),
    },
  };
});

describe('LoginScreen', () => {
  test('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Verificar se os elementos de input e botões estão sendo renderizados corretamente
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Esqueci minha senha')).toBeTruthy();
  });

  test('handles login with verified email', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Simular entrada de dados nos campos de input
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password');

    // Simular clique no botão de login
    fireEvent.press(getByText('Login'));

    // Aguardar a promessa do login ser resolvida
    await Promise.resolve();

    // Verificar se o usuário foi autenticado com sucesso
    expect(getByText('Email verificado')).toBeTruthy();
  });

  test('handles login with unverified email', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Simular entrada de dados nos campos de input
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'password');

    // Simular clique no botão de login
    fireEvent.press(getByText('Login'));

    // Aguardar a promessa do login ser resolvida
    await Promise.resolve();

    // Verificar se o usuário foi notificado sobre o email não verificado
    expect(getByText('Email não verificado')).toBeTruthy();
    expect(getByText('Verifique seu email')).toBeTruthy();
  });

  test('handles forgot password', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    // Simular entrada de dados no campo de email
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');

    // Simular clique no botão de "Esqueci minha senha"
    fireEvent.press(getByText('Esqueci minha senha'));

    // Aguardar a promessa do envio do email de recuperação de senha ser resolvida
    await Promise.resolve();

    // Verificar se o usuário foi notificado sobre o envio do email
    expect(getByText('Email de recuperação de senha enviado')).toBeTruthy();
  });
});