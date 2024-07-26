// __mocks__/firebaseConfig.js
import { getAuth } from 'firebase/auth';

const mockAuth = {
  currentUser: {
    uid: 'user123',
    _stopProactiveRefresh: jest.fn(),
    _startProactiveRefresh: jest.fn(),
  },
  onAuthStateChanged: jest.fn((callback) => {
    callback(mockAuth.currentUser);
  }),
};

const mockFirestore = {
  collection: jest.fn(() => mockFirestore),
  doc: jest.fn(() => mockFirestore),
  onSnapshot: jest.fn((_, cb) => {
    cb({
      docs: mockDocs,
    });
    return jest.fn();
  }),
};

const mockDocs = [
  {
    id: '1',
    data: () => ({
      userId: 'user1',
      timestamp: '2021-01-01',
      pictureURL: 'http://example.com/image1.jpg',
      caption: 'Test Post 1',
      comments: [],
      likes: 0,
      usersLiked: [],
      location: 'Location 1',
      tags: ['tag1', 'tag2'],
    }),
  },

];

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => mockAuth),
    initializeAuth: jest.fn(() => mockAuth),
    getReactNativePersistence: jest.fn(() => ({
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    })),
  };
});

export const firebaseAuth = mockAuth;
export const firebaseApp = {};
export const firebaseDb = {};
export const firebaseFS = mockFirestore;
