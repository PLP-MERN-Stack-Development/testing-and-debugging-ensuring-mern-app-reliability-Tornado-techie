import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const SimpleComponent = () => <div>Hello Test</div>;

describe('Simple Client Test', () => {
  it('should render a component', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });

  it('should pass basic assertions', () => {
    expect(true).toBe(true);
  });
});
