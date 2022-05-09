import React from 'react';

import Fail from '../../../assets/icons/fail';
import LightBulb from '../../../assets/icons/lightbulb';
import GreenPass from '../../../assets/icons/green-pass';

interface LowerJawProps {
  hint?: string;
  isEditorInFocus?: boolean;
  challengeIsCompleted?: boolean;
  openHelpModal: () => void;
  executeChallenge: () => void;
  submitChallenge: () => void;
  showFeedback?: boolean;
  isEditorOnFocus?: boolean;
  challengeHasErrors?: boolean;
  testsLength?: number;
  attemptsNumber?: number;
  onAttempt?: () => void;
}

const LowerJaw = ({
  openHelpModal,
  challengeIsCompleted,
  challengeHasErrors,
  hint,
  isEditorInFocus,
  executeChallenge,
  submitChallenge,
  attemptsNumber,
  testsLength,
  onAttempt
}: LowerJawProps): JSX.Element => {
  const renderTestFeedbackContainer = () => {
    if (challengeIsCompleted) {
      const submitKeyboardInstructions = isEditorInFocus
        ? '<span class="sr-only">Use Ctrl + Enter to submit.</span>'
        : '';
      return (
        <div className='test-status' aria-live='assertive'>
          <div className='status-icon' aria-hidden='true'>
            <span>
              <GreenPass />
            </span>
          </div>
          <div className='test-status-description'>
            <h2>Test</h2>
            <p className='status'>
              Congratulations, your code passes. Submit your code to complete
              this step and move on to the next one.
              {submitKeyboardInstructions}
            </p>
          </div>
        </div>
      );
    } else if (challengeHasErrors && hint) {
      const hintDiscription = `<h2 class="hint">Hint</h2> ${hint}`;
      const wordsArray = [
        'Try again.',
        'Keep trying.',
        "You're getting there.",
        'Hang in there.',
        "Don't give up."
      ];

      return (
        <>
          <div className='test-status' aria-live='assertive'>
            <div className='status-icon' aria-hidden='true'>
              <span>
                <Fail />
              </span>
            </div>
            <div className='test-status-description'>
              <h2>Test</h2>
              <p>
                {`Sorry, your code does not pass.
            ${wordsArray[Math.floor(Math.random() * wordsArray.length)]}`}
              </p>
            </div>
          </div>
          <div className='hint-status'>
            <div className='hint-icon' aria-hidden='true'>
              <span>
                <LightBulb />
              </span>
            </div>
            <div
              className='hint-description'
              dangerouslySetInnerHTML={{ __html: hintDiscription }}
            />
          </div>
        </>
      );
    } else {
      <div className='test-status' aria-live='assertive' />;
    }
  };

  const onTestButtonClick = () => {
    executeChallenge();
    if (onAttempt) onAttempt();
  };

  const renderHelpButton = () => {
    if (attemptsNumber && testsLength && attemptsNumber >= testsLength)
      return (
        <button
          className='btn-block btn'
          id='help-button'
          onClick={openHelpModal}
        >
          Ask for Help
        </button>
      );
  };

  const renderButtons = () => {
    return (
      <>
        <button
          id='test-button'
          className={`btn-block btn ${challengeIsCompleted ? 'sr-only' : ''}`}
          aria-hidden={challengeIsCompleted}
          onClick={onTestButtonClick}
        >
          Check Your Code (Ctrl + Enter)
        </button>
        <div id='action-buttons-container'>
          <button
            id='submit-button'
            aria-hidden={!challengeIsCompleted}
            className='btn-block btn'
            onClick={submitChallenge}
          >
            Submit your code (Ctrl + Enter)
          </button>
          {renderHelpButton()}
        </div>
      </>
    );
  };

  return (
    <div className='action-row-container'>
      {renderButtons()}
      <div className='test-feedback' id='test-feedback'>
        {renderTestFeedbackContainer()}
      </div>
    </div>
  );
};

LowerJaw.displayName = 'LowerJaw';

export default LowerJaw;
