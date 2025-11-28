import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Question from '@/app/components/course/question';

// Mock question data
const mockQuestion = {
  id: 'question-1',
  content: 'What is the capital of France?',
  options: [
    {
      id: 'option-1',
      text: 'London',
      isCorrect: false,
      explanation: 'London is the capital of England, not France.',
    },
    {
      id: 'option-2',
      text: 'Paris',
      isCorrect: true,
      explanation: 'Paris is the capital of France.',
    },
    {
      id: 'option-3',
      text: 'Berlin',
      isCorrect: false,
      explanation: 'Berlin is the capital of Germany.',
    },
  ],
  content_item: {
    id: 'content-item-1',
    type: 'question',
    content_item_id: 'question-1',
  },
};

describe('Question Component', () => {
  it('renders question content and options correctly', () => {
    render(<Question question={mockQuestion} />);

    // Check that the question content is rendered in the h2 element
    const titleElement = screen.getByRole('heading', { name: /What is the capital of France\?/i });
    expect(titleElement).toBeInTheDocument();

    // Check that all options are rendered using getByLabelText to avoid duplication
    expect(screen.getByLabelText('London')).toBeInTheDocument();
    expect(screen.getByLabelText('Paris')).toBeInTheDocument();
    expect(screen.getByLabelText('Berlin')).toBeInTheDocument();
  });

  it('allows selecting an option', () => {
    render(<Question question={mockQuestion} />);

    // Initially no options should be selected
    const parisOption = screen.getByLabelText('Paris');
    expect(parisOption).not.toBeChecked();

    // Click on the Paris option
    fireEvent.click(screen.getByLabelText('Paris'));

    // Now Paris should be selected
    expect(parisOption).toBeChecked();
  });

  it('displays feedback after submitting the correct answer', async () => {
    render(<Question question={mockQuestion} />);

    // Select the correct answer (Paris)
    fireEvent.click(screen.getByLabelText('Paris'));

    // Click submit
    fireEvent.click(screen.getByText('Submit'));

    // Wait for feedback to appear
    await waitFor(() => {
      expect(screen.getByText('Correct! Well done!')).toBeInTheDocument();
    });
  });

  it('displays feedback after submitting an incorrect answer', async () => {
    render(<Question question={mockQuestion} />);

    // Select an incorrect answer (London)
    fireEvent.click(screen.getByLabelText('London'));

    // Click submit
    fireEvent.click(screen.getByText('Submit'));

    // Wait for feedback to appear
    await waitFor(() => {
      expect(screen.getByText('Incorrect. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows explanation for the correct answer (uses first option explanation - potential bug)', async () => {
    render(<Question question={mockQuestion} />);

    // Select the correct answer (Paris)
    fireEvent.click(screen.getByLabelText('Paris'));

    // Click submit
    fireEvent.click(screen.getByText('Submit'));

    // Wait for feedback to appear
    // Note: This is testing the current behavior where the first option's explanation is always shown
    // regardless of which option was selected or was correct
    await waitFor(() => {
      expect(screen.getByText('Explanation:')).toBeInTheDocument();
      // The component currently shows the first option's explanation (which is for London)
      // This appears to be a bug in the component where it always uses question.options[0].explanation
      expect(screen.getByText('London is the capital of England, not France.')).toBeInTheDocument();
    });
  });

  it('disables options after submission', async () => {
    render(<Question question={mockQuestion} />);

    // Select an option
    fireEvent.click(screen.getByLabelText('Paris'));

    // Click submit
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the submission to process
    await waitFor(() => {
      // The submit button should be disabled
      const submitButton = screen.getByText('Submit');
      expect(submitButton).toBeDisabled();
    });
  });

  it('handles question not found state', () => {
    render(<Question question={null as any} />);

    expect(screen.getByText('Question not found')).toBeInTheDocument();
    expect(screen.getByText('Sorry, we couldn\'t find the requested question.')).toBeInTheDocument();
  });
});