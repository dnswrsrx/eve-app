import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from '../../../../config/firebaseConfig';
import { CollectionNames } from '../../../models/models';
import CustomEditor from '../../general/custom-editor/CustomEditor';
import './SSPForm.scss';

interface Page {
  mainContent: string,
  id: string,
  name: string,
}

interface SSPFormProp {
  page: Page;
}

const SSPForm = ({ page }: SSPFormProp): JSX.Element => {

  const content = page.mainContent;
  const docID = page.id;
  const name = page.name

  const text = useRef<string>(content || '');
  const currentPage = firebase.firestore().collection(CollectionNames.Pages).doc(docID);

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { handleSubmit } = useForm();

  const onSubmit = (): void => {
    setSubmitting(true);
    currentPage.update({mainContent: text.current}).then((): void => {
      setSuccessMessage(`${name} updated.`)
      setErrorMessage('');
      setSubmitting(false);
    }).catch((error: { message: string }): void => {
      setSuccessMessage('')
      setErrorMessage(error.message);
      setSubmitting(false);
    });
  }

  return (

    <form className="ssp-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="ssp-form__row">
        <CustomEditor contentReference={text} height={700} />
      </div>
      { errorMessage && <p className="ssp-form__error error">{ errorMessage }</p> }
      { successMessage && <p className="ssp-form__success-message success">{ successMessage }</p> }
      <div className="ssp-form__submit-row">
        <button type="submit" className="ssp-form__submit-button" disabled={submitting}>Save</button>
      </div>
    </form>
  )
}

export default SSPForm;
