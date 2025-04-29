import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('DOM test', () => {
  it('renders and interacts with button', async () => {
    document.body.innerHTML = `<button>Click me</button>`;
    const button = screen.getByText('Click me');
    expect(button).toBeDefined();
    await userEvent.click(button);
  });
});
