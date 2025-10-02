import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserContext } from '../providers/UserProvider';
import LoginPage from '../pages/LoginPage';

jest.mock('../utils/axios');

describe('LoginPage Component', () => {
  const renderWithContext = (user) => {
    render(
      <GoogleOAuthProvider clientId="test-client-id">
        <BrowserRouter>
          <UserContext.Provider value={{ user }}>
            <LoginPage />
          </UserContext.Provider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    );
  };

  it('should render the login form', () => {
    renderWithContext(null);

    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should allow the user to type in the email and password fields', () => {
    renderWithContext(null);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
});