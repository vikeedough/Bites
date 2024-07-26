import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Index from './index'; // Adjust the import based on your directory structure
import { firebaseAuth } from '../__mocks__/firebaseConfig'; // This import will now use the mock

jest.mock('react-native-gesture-handler', () => {
  return {
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
    State: {},
    TapGestureHandler: jest.fn(),
    PanGestureHandler: jest.fn(),
    ...jest.requireActual('react-native-gesture-handler'),
  };
});

jest.mock('../__mocks__/firebaseConfig'); // Mock the firebaseConfig module

describe('Index Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Renders MyTabs component when user is authenticated', async () => {
    // Simulate a logged-in user
    firebaseAuth.onAuthStateChanged.mockImplementation((callback) => {
      callback({ email: 'test1@gmail.com' }); // Simulate a logged-in user
    });

    render(
      <NavigationContainer>
        <Index />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByText('Bites')).toBeTruthy(); // Adjust based on actual content in MyTabs
    });
  });

  test('Renders Login and Signup screens when user is not authenticated', async () => {
    // Simulate no user (logged out state)
    firebaseAuth.onAuthStateChanged.mockImplementation((callback) => {
      callback(null);
    });

    render(
      <NavigationContainer>
        <Index />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeTruthy(); // Adjust based on actual content in the login screen
    });
  });
});
