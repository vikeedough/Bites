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
    return {};
  }),
  onSnapshot: jest.fn((query, callback) => {
    const mockData = {}; 
    const mockDocSnapshot = {
      docs: mockData.map(doc => ({
        data: () => doc,
        id: doc.id,
      })),
    };
    callback(mockDocSnapshot);
    return {
      unsubscribe: jest.fn(),
    };
  }),
  doc: jest.fn((db, documentPath) => {
    return {
    };
  }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { onSnapshot } = require('firebase/firestore'); 

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
          }),
        });
      }
    });
  });

  test('Screen renders correctly', () => {
    const mockNavigation = {
      setOptions: jest.fn(),
    };
    const { getByText } = render(<HomeScreen navigation={{ setOptions: jest.fn() }} />);
    expect(getByText('No posts to show. Post a picture or add some friends to see their posts on your feed!')).toBeTruthy();
  });

  // test('displays posts when available', async () => {
  //   const mockNavigation = {
  //     setOptions: jest.fn(),
  //   };
  //   const { findByText, findByAltText } = render(<HomeScreen navigation={{ setOptions: jest.fn() }} />);

  //   const mockCardElement = screen.getByTestId('mockCard');
  //   expect(mockCardElement).toBeInTheDocument();
  //   const captionElement = await findByText('Test Caption');
  //   expect(captionElement).toBeInTheDocument();

  //   const imageElement = await findByAltText('Post Image');
  //   expect(imageElement).toBeInTheDocument();
  //   expect(imageElement.src).toContain('testImage.jpg');
  // });

  // test('refresh control triggers post filtering', () => {
  //   const mockNavigation = {
  //     setOptions: jest.fn(),
  //   };
  //   const { getByText } = render(<HomeScreen navigation={{ setOptions: jest.fn() }} />);
  //   const refreshControl = getByText('RefreshControl');
  //   fireEvent(refreshControl, 'onRefresh');
  //   expect(queryByText('Card')).toBeTruthy();
  // });

  // test('modal visibility toggles correctly', () => {
  //   const mockNavigation = {
  //     setOptions: jest.fn(),
  //   };
  //   const { getByTestId, queryByText } = render(<HomeScreen navigation={{ setOptions: jest.fn() }} />);
  //   fireEvent.press(getByTestId('helpIcon'));
  //   expect(queryByText('HomeScreenInfo')).toBeTruthy();
  // });
});