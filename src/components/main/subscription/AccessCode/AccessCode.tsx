import React, { useRef, useState, useContext } from 'react';
import { FirebaseReducer } from 'react-redux-firebase';
import firebase from '../../../../config/firebaseConfig';

import { CollectionNames } from '../../../models/models';
import { UserInfoContext, AccessCodeContext, CurrentSubscriptionContext } from '../../Main';

import './AccessCode.scss';

interface AccessCodeProp {
  auth?: FirebaseReducer.AuthState|null,
  subscription: string|null
}

const AccessCode = ({ auth, subscription }: AccessCodeProp): JSX.Element => {

  const accessCodeInput = useRef(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const userInfo = useContext(UserInfoContext);
  const accessCode = useContext(AccessCodeContext);
  const currentSubscription = useContext(CurrentSubscriptionContext);

  const [, isSubscriber] = (subscription || '').split('-');

  if (!auth?.uid) return (
    <div className="access-code">
      <h2>Access Code</h2>
      <p>Please register and log in before you may enter or manage your access code.</p>
    </div>
  )

  const firestore = firebase.firestore();
  
  if (!subscription) {

    const useCode = (): void => {
      const input: HTMLInputElement | null = accessCodeInput.current;
      const value = input!.value.trim();

      if (input && value) {
        setError('');
        setLoading(true);

        const accessCodeDoc = firestore.collection(CollectionNames.AccessCodes).doc(value);
        accessCodeDoc.get().then(d => {

          const info = d.data();
          const today = new Date();

          if (
            !d.exists || !info || info.status !== 'active' ||
            (info.ended_at && today >= new Date(info.ended_at?.seconds * 1000)) ||
            today >= new Date(info.current_period_end?.seconds * 1000)
          ) {
            setError('Invalid access code provided');
            setLoading(false);
            return;
          }

          if (info?.remaining < 1) {
            setError('Please contact the person providing the access code as they have reached their limit.');
            setLoading(false);
            return;
          }

          // Since we've configured Stripe extension not to create user on sign up,
          // there wouldn't be a user document.
          // So we can only check against existing access code if there's a user doc.
          if (userInfo) {
            // Remove user from previous access code if there's one
            // Free up spot if this access code becomes active in the future
            if (userInfo.accessCode) {
              const oldAccessCode = firestore.collection(CollectionNames.AccessCodes).doc(userInfo.accessCode)
              oldAccessCode.get().then(d => {
                const subscribers = oldAccessCode.collection('subscribers')
                subscribers.doc(auth.uid).delete().then(() => {
                  subscribers.get().then(snapShot => {
                    const numberOfSubscribers = snapShot.docs.map(d => d.data()).length;
                    oldAccessCode.update({remaining: d.data()!.quantity - numberOfSubscribers}).then();
                  })
                });
              })
            }
          }

          const subscribers = accessCodeDoc.collection('subscribers');

          // Add user as a doc to the access code's subscribers collection
          // Then update remaining (spots) left on the access code
          subscribers.doc(auth.uid).set({ email: auth.email, created: new Date() })
            .then(() => {
              subscribers.get().then(snapShot => {
                const numberOfSubscribers = snapShot.docs.map(d => d.data()).length;
                accessCodeDoc.update({ remaining: info.quantity - numberOfSubscribers }).then(() => {
                  const userDoc = firestore.collection(CollectionNames.Users).doc(auth.uid);
                  // Create a new user document if one doesn't already exist.
                  // Configured the Stripe extension not to create new customer on sign up!
                  if (!userInfo) {
                    userDoc.set({ email: auth.email, accessCode: value }).then(() => setLoading(false));
                  } else {
                    userDoc.update({ accessCode: value }).then(() => setLoading(false));
                  }
                })
              })
            })
        });
      }
    }

    return (
      <div className="access-code">
        <h2>Access Code</h2>
        <p>Enter the code if you were given one!</p>
        <input className={error && 'error'} ref={accessCodeInput} onChange={() => setError('')} type="text" />
        <button onClick={useCode}>{loading ? <span className="access-code__spinner"></span> : 'Submit'}</button>
        {error && <p className="access-code__error">{ error }</p>}
      </div>
    )
  }

  const removeCode = (): void => {
    if (!isSubscriber) return;

    setLoading(true);

    // Remove the user's doc from the access code's subscribers collection
    // Increment the remaining (spots)
    firestore.collection(CollectionNames.Users).doc(auth.uid).update({accessCode: firebase.firestore.FieldValue.delete()})
      .then(() => {
        const accessCodeDoc = firestore.collection(CollectionNames.AccessCodes).doc(isSubscriber);
        accessCodeDoc.get().then(d => {
          if (d.exists) {
            const subscribers = accessCodeDoc.collection('subscribers');
            subscribers.doc(auth.uid).delete().then(() => {
              subscribers.get().then(snapShot => {
                const numberOfSubscribers = snapShot.docs.map(d => d.data()).length;
                accessCodeDoc.update({remaining: d.data()!.quantity - numberOfSubscribers}).then();
              })
            })
          }
          setLoading(false);
        })
      })
  }

  const cancelAt = currentSubscription?.cancel_at && new Date(currentSubscription.cancel_at.seconds * 1000).toLocaleDateString();
  const periodEnd = currentSubscription?.cancel_at_period_end && new Date(currentSubscription.current_period_end.seconds * 1000).toLocaleDateString();

  const copyCode = (): void => {
    if (document?.getElementById('access-code__code')) {
      navigator.clipboard.writeText(document?.getElementById('access-code__code')?.innerText || '')
      .then((): void => {
        const copyButton = document?.getElementById('access-code__copy-code');
        if (copyButton) {
          copyButton.setAttribute('disabled', '');
          const currentText = copyButton.innerText;
          copyButton.innerText = 'Copied';

          setTimeout(() => {
            copyButton.innerText = currentText;
            copyButton.removeAttribute('disabled');
          }, 2000);
        }
      })
    }
  }

  return (
    <div className="access-code">
      <h2>Access Code</h2>
      { isSubscriber
          ? <>
            <p>Current access code: <strong>{isSubscriber}</strong></p>
            <button onClick={removeCode}>{loading ? <span className="access-code__spinner"></span> : 'Deactivate'}</button>
          </>
          : <>
            <p>
              Share the following access code:<br />
              <code id="access-code__code">{ auth.uid }</code>
            </p>

            <button id="access-code__copy-code" onClick={copyCode}>Copy Code</button>

            <article className="access-code__units">
              <p>Units purchased: <strong>{ accessCode.quantity }</strong></p>
              <p>Spots remaining: <strong>{ accessCode.remaining }</strong></p>
            </article>

            {
              cancelAt
                ? <p>Current subscription will end at <strong>{ cancelAt }</strong></p>
                : periodEnd && <p>Current subscription will not be renewed and will end at <strong>{ periodEnd }</strong></p>
            }
          </>
      }
    </div>
  )
}

export default AccessCode;
