import '@testing-library/jest-native/extend-expect'; // Extend expect for @testing-library/react-native
import { cleanup } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('react-native/Libraries/Settings/Settings', () => ({
    get: jest.fn(),
    set: jest.fn(),
    watchKeys: jest.fn(),
    clearWatch: jest.fn(),
}));

afterEach(cleanup);

global.mockNavigate = jest.fn();