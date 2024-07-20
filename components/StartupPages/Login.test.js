import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './Login.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation(() => {});
jest.mock('firebase/auth');

// Mock the navigate function
const mockNavigate = jest.fn();

describe('Login', () => {
    beforeEach(() => {
        signInWithEmailAndPassword.mockClear();
        mockNavigate.mockClear();
    });

    test('Screen renders correctly', () => {
        const { getByText, getByTestId } = render(<Login navigation={{ navigate: mockNavigate }} />);

        expect(getByText('Welcome!')).toBeTruthy();
        expect(getByText('Sign in to continue')).toBeTruthy();
        expect(getByTestId('emailInput')).toBeTruthy();
        expect(getByTestId('passwordInput')).toBeTruthy();
    });

    test('Can input text into Email and Password fields', async () => {
        const { getByTestId } = render(<Login navigation={{ navigate: mockNavigate }} />);

        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('passwordInput');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');

        expect(emailInput.props.value).toBe('test@example.com');
        expect(passwordInput.props.value).toBe('password123');
    });

    test('Throw "Log in failed" when invalid email is entered', async () => {
        signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-email' });

        const { getByTestId } = render(<Login navigation={{ navigate: mockNavigate }} />);

        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('passwordInput');
        const loginButton = getByTestId('loginButton');

        fireEvent.changeText(emailInput, 'test');
        fireEvent.changeText(passwordInput, 'password123');

        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Log in failed",
                "Please enter a valid email!",
                [{ text: 'Understood' }]
            );
        });
    });

    test('Throw "Log in failed" when password is not entered', async () => {
        signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/missing-password' });

        const { getByTestId } = render(<Login navigation={{ navigate: mockNavigate }} />);

        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('passwordInput');
        const loginButton = getByTestId('loginButton');

        fireEvent.changeText(emailInput, 'test');

        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Log in failed",
                "Please enter your password!",
                [{ text: 'Understood' }]
            );
        });
    });

    test('Throw "Log in failed" when wrong password is entered', async () => {
        signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });

        const { getByTestId } = render(<Login navigation={{ navigate: mockNavigate }} />);

        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('passwordInput');
        const loginButton = getByTestId('loginButton');

        fireEvent.changeText(emailInput, 'test1@gmail.com');
        fireEvent.changeText(passwordInput, 'passwordddddddd');

        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Log in failed",
                "Invalid password!",
                [{ text: 'Understood' }]
            );
        });
    });

    test('Throw "Log in failed" when email is not registered', async () => {
        signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/user-not-found' });

        const { getByTestId } = render(<Login navigation={{ navigate: mockNavigate }} />);

        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('passwordInput');
        const loginButton = getByTestId('loginButton');

        fireEvent.changeText(emailInput, 'doesnotexist@gmail.com');
        fireEvent.changeText(passwordInput, 'password123');

        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                "Log in failed",
                "The email you keyed in is not a registered with us. Please create a new account!",
                [{ text: 'Understood' }]
            );
        });
    });

    test('Navigates to Home screen upon successful login', async () => {
        signInWithEmailAndPassword.mockResolvedValue({});

        const { getByTestId } = render(<Login navigation={{ navigate: mockNavigate }} />);

        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('passwordInput');
        const loginButton = getByTestId('loginButton');

        fireEvent.changeText(emailInput, 'test1@gmail.com');
        fireEvent.changeText(passwordInput, 'password');

        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('Home'); // Adjust 'Home' to the actual name of your home screen route
        });
    });
});
