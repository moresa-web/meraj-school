import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TestableFieldError } from './TestableFieldError';
import { ErrorType, ValidationError } from '../../utils/errorTypes';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'fa',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Audio
window.Audio = jest.fn().mockImplementation(() => ({
  play: jest.fn(),
  pause: jest.fn(),
}));

// Mock Notification
window.Notification = {
  requestPermission: jest.fn().mockResolvedValue('granted'),
  permission: 'granted',
} as any;

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  value: jest.fn(),
  writable: true,
});

describe('TestableFieldError', () => {
  const mockError: ValidationError = {
    type: ErrorType.VALIDATION,
    message: 'Test error message',
    timestamp: new Date(),
    field: 'testField',
    value: 'testValue'
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders error message correctly', () => {
    render(<TestableFieldError error={mockError} />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('handles dismiss button click', () => {
    const onDismiss = jest.fn();
    render(<TestableFieldError error={mockError} onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByRole('button');
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalled();
  });

  it('handles escape key press', () => {
    const onDismiss = jest.fn();
    render(<TestableFieldError error={mockError} onDismiss={onDismiss} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onDismiss).toHaveBeenCalled();
  });

  it('auto dismisses after duration', () => {
    const onDismiss = jest.fn();
    render(<TestableFieldError error={mockError} duration={2000} onDismiss={onDismiss} />);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(onDismiss).toHaveBeenCalled();
  });

  it('plays sound when enabled', () => {
    const audioMock = jest.fn();
    window.Audio = jest.fn().mockImplementation(() => ({
      play: audioMock,
    }));
    
    render(<TestableFieldError error={mockError} sound={true} />);
    
    expect(audioMock).toHaveBeenCalled();
  });

  it('triggers vibration when enabled', () => {
    const vibrateMock = jest.fn();
    navigator.vibrate = vibrateMock;
    
    render(<TestableFieldError error={mockError} vibration={true} />);
    
    expect(vibrateMock).toHaveBeenCalledWith(200);
  });

  it('shows notification when enabled', async () => {
    render(<TestableFieldError error={mockError} notification={true} />);
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(window.Notification.requestPermission).toHaveBeenCalled();
  });

  it('applies custom theme classes', () => {
    render(<TestableFieldError error={mockError} theme="dark" />);
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveClass('bg-red-900');
  });

  it('applies RTL direction classes', () => {
    render(<TestableFieldError error={mockError} direction="rtl" />);
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveClass('text-right');
  });

  it('handles custom test ID', () => {
    render(<TestableFieldError error={mockError} testId="custom-error" />);
    
    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
  });

  it('does not render when error is null', () => {
    const { container } = render(<TestableFieldError error={null} />);
    expect(container).toBeEmptyDOMElement();
  });
}); 