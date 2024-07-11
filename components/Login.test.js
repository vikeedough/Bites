import React from 'react';
import Login from './StartupPages/Login.js';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('firebase/auth');

describe('Login', () => {
    beforeEach(() => {
        signInWithEmailAndPassword.mockClear();
    });

    test('Screen renders correctly', () => {
        const { getByText, getByTestId } = render(<Login />);

        // Checks if welcome text is rendered
        expect(getByText('Welcome!')).toBeTruthy();
        expect(getByText('Sign in to continue')).toBeTruthy();

        // Checks if text input fields are rendered
        expect(getByTestId('emailInput')).toBeTruthy();
        expect(getByTestId('passwordInput')).toBeTruthy();
    });

    test('Can input text into Email and Password fields', async () => {
        const { getByTestId } = render(<Login />);

        const emailInput = getByTestId('emailInput');
        const passwordInput = getByTestId('passwordInput');
        
        // Simulate typing into inputs
        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');

        expect(emailInput.props.value).toBe('test@example.com');
        expect(passwordInput.props.value).toBe('password123');
    });

});
