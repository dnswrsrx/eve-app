import React from 'react';
import { FirebaseReducer } from 'react-redux-firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import './Instructions.scss';

interface InstructionsProps {
  auth: FirebaseReducer.AuthState,
  subscription: string|null
}

const Instructions = ({ auth, subscription }: InstructionsProps): JSX.Element => {

  return (
    <article className='instructions'>
      <h2>
        Instructions <span><FontAwesomeIcon icon={faStar} /></span>
      </h2>

      <details open={!auth.uid}>
        <summary>
          Sign Up
        </summary>
        <ol>
          <li>
            To subscribe, you first need to sign up.
            Complete the Sign Up form.
          </li>
          <li>
            After clicking Sign Up, you will receive an email to verify your email address.
          </li>
        </ol>
      </details>

      <details open={Boolean(auth.uid && !auth.emailVerified)}>
        <summary>
          Verify Email Address
        </summary>
        <ol>
          <li>
            Go to your email and click the message with the subject: <strong>Verify your email for English Vocabulary Exercises</strong>.
          </li>
          <li>
            You will see the message: <strong>Hello. Follow this link to verify your email address.</strong> Click on the link.
          </li>
          <li>
            A new tab or window will open saying that your email has been verified. You may close that tab or window.
          </li>
          <li>
            Refresh this page and you can start subscribing!
          </li>
        </ol>
      </details>

      <details open={Boolean(auth.emailVerified && !subscription)}>
        <summary>
          Subscribe
        </summary>
        <ol>
          <li>You can now choose the tier you would like to subscribe above.</li>
          <li>When you've clicked on a <strong>Subscribe</strong> button, you will be brought to a new page to enter your credit card information.</li>
          <li>Once you're subscribed, you can access all the groups and exercises in the tier you chose.</li>
        </ol>
      </details>
    </article>
  )
}

export default Instructions;
