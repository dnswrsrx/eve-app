import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from '../../../../config/firebaseConfig';
import { CollectionNames } from '../../../models/models';
import CustomEditor from '../../general/custom-editor/CustomEditor';
import './PrivacyPolicyForm.scss';

interface PrivacyPolicyFormProps {
  content: string,
  docID: string
}

const PrivacyPolicyForm = ({ content, docID }: PrivacyPolicyFormProps): JSX.Element => {

  const text = useRef<string>(content || '');
  const policy = firebase.firestore().collection(CollectionNames.Pages).doc(docID);

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { handleSubmit } = useForm();

  const onSubmit = (): void => {
    setSubmitting(true);
    policy.update({mainContent: text.current}).then((): void => {
      setSuccessMessage('Privacy Policy updated.')
      setErrorMessage('');
      setSubmitting(false);
    }).catch((error: { message: string }): void => {
      setSuccessMessage('')
      setErrorMessage(error.message);
      setSubmitting(false);
    });
  }

  return (

    <form className="privacy-policy-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="privacy-policy-form__row">
        <CustomEditor contentReference={text} height={700} />
      </div>
      { errorMessage && <p className="privacy-policy-form__error error">{ errorMessage }</p> }
      { successMessage && <p className="privacy-policy-form__success-message success">{ successMessage }</p> }
      <div className="privacy-policy-form__submit-row">
        <button type="submit" className="privacy-policy-form__submit-button" disabled={submitting}>Save</button>
      </div>
    </form>
  )
}

export default PrivacyPolicyForm;
