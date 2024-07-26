import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { firebaseAuth, firebaseDb } from '../../firebaseConfig';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import Card from '@/components/Card.js';
import HomeScreenInfo from '@/components/Modals/HomeScreenInfo';
import { Ionicons } from '@expo/vector-icons';

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  RefreshControl: () => 'RefreshControl',
}));

jest.mock('../Card.js', () => {
  return ({children}) => <div data-testid="mockCard">{children}</div>;
});
jest.mock('@/components/Modals/HomeScreenInfo', () => 'HomeScreenInfo');
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../../firebaseConfig', () => ({
  firebaseAuth: {
    currentUser: {
      uid: 'testUser',
    },
  },
  firebaseDb: {},
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn((db, collectionName) => {
    // Mock behavior based on collectionName if needed
    return {};
  }),
  onSnapshot: jest.fn((query, callback) => {
    const mockData = {}; // Replace with your mock data structure
    const mockDocSnapshot = {
      docs: mockData.map(doc => ({
        data: () => doc,
        id: doc.id,
      })),
    };
    callback(mockDocSnapshot);
    return {
      // Return a mock unsubscribe function
      unsubscribe: jest.fn(),
    };
  }),
  doc: jest.fn((db, documentPath) => {
    // Mock behavior based on documentPath if needed
    return {
      // You can add methods like get(), set(), update() here if they are used in your component
    };
  }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { onSnapshot } = require('firebase/firestore'); // Import onSnapshot from the mocked module

    // Mock Firestore data fetching
    onSnapshot.mockImplementation((ref, callback) => {
      if (ref === doc(firebaseDb, "posts", "testPost")) {
        callback({
          data: () => ({
            userId: 'testUser',
            timestamp: new Date(),
            pictureURL: 'testImage.jpg',
            caption: 'Test Caption',
            comments: [],
            likes: 0,
            usersLiked: [],
            location: 'Test Location',
            tags: [],
          }),
        });
      } else if (ref === doc(firebaseDb, "users", "testUser")) {
        callback({
          data: () => ({
            // Your mock data here
          }),
        });
      }
    });
  });

  test('renders correctly', () => {
    const mockNavigation = {
      setOptions: jest.fn(),
    };
    const { getByText } = render(<HomeScreen navigation={{ setOptions: jest.fn() }} />);
    expect(getByText('No posts to show. Post a picture or add some friends to see their posts on your feed!')).toBeTruthy();
  });

  test('displays posts when available', async () => {
    const mockNavigation = {
      setOptions: jest.fn(),
    };
    const { findByText, findByAltText } = render(<HomeScreen navigation={{ setOptions: jest.fn() }} />);

    // Wait for the post's caption to appear in the document
    const mockCardElement = screen.getByTestId('mockCard');
    expect(mockCardElement).toBeInTheDocument();
    const captionElement = await findByText('Test Caption');
    expect(captionElement).toBeInTheDocument();

    // Optionally, check for other elements like the image
    const imageElement = await findByAltText('Post Image'); // Use the actual alt text used in your component
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toContain('testImage.jpg');
  });

  test('refresh control triggers post filtering', () => {
    const mockNavigation = {
      setOptions: jest.fn(),
    };
    const { getByText } = render(<HomeScreen navigation={{ setOptions: jest.fn() }} />);
    const refreshControl = getByText('RefreshControl');
    fireEvent(refreshControl, 'onRefresh');
    // Expect the filterPosts function to be called, indirectly checked by ensuring posts are displayed
    expect(queryByText('Card')).toBeTruthy();
  });

  test('modal visibility toggles correctly', () => {
    const mockNavigation = {
      setOptions: jest.fn(),
    };
    const { getByTestId, queryByText } = render(<HomeScreen navigation={{ setOptions: jest.fn() }} />);
    fireEvent.press(getByTestId('helpIcon'));
    expect(queryByText('HomeScreenInfo')).toBeTruthy();
  });
});