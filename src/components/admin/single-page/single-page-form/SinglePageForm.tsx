import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { HomeLanguage, PageTypes } from '../../../models/models';
import { getCollectionName } from '../../../../utils/utils';
import firebase from '../../../../config/firebaseConfig';
import CustomEditor from '../../general/custom-editor/CustomEditor';
import './SinglePageForm.scss';

interface SinglePageFormProps {
  pageId: string,
  page: HomeLanguage,
  type: string,
}

const SinglePageForm = ({ pageId, page, type }: SinglePageFormProps): JSX.Element => {
  const [successMessage, setSuccessMessage] = useState<string>('');

  const mainContent = useRef(page.mainContent || '');
  const bannerText = useRef(page.bannerText || '');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const { register, handleSubmit } = useForm();

  const collectionName = getCollectionName(type);
  const pageCollection = firebase.firestore().collection(collectionName).doc(pageId);

  const onSubmit = (data: any) : void => {
    setSubmitting(true);

    let updatedDoc;
    if(type === PageTypes.Language) {
      updatedDoc = {
        bannerHeading: data['banner-heading'],
        bannerText: bannerText.current,
        mainContent: mainContent.current,
      }
    }
    else {
      updatedDoc = {
        mainContent: mainContent.current,
      }
    }
    pageCollection.update(updatedDoc).then((): void => {
      setSuccessMessage(`${page.name} page has been saved.`);
      setSubmitError('');
      setSubmitting(false);
    }).catch((error: { message: string }): void => {
      setSuccessMessage('');
      setSubmitError(error.message);
      setSubmitting(false);
    });
  }

  return (
    <form className="single-page-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="single-page-form__heading">Edit Fields</h2>
      {
        type === PageTypes.Language
          ? <>
              <div className="single-page-form__form-row">
                <label className="single-page-form__label" htmlFor={'banner-heading'}>Banner Heading: </label>
                <input
                  id="banner-heading"
                  className="single-page-form__field"
                  type="text"
                  {...register('banner-heading')}
                  defaultValue={page.bannerHeading || ''}
                />
              </div>
              <div className="single-page-form__form-row">
                <h3 className="single-page-form__label">Banner Text: </h3>
                <CustomEditor contentReference={bannerText} height={300} />
              </div>
            </>
          : <></>
      }
      <div className="single-page-form__form-row">
        <h3 className="single-page-form__label">Main Content: </h3>
        <CustomEditor contentReference={mainContent} height={450} />
      </div>
      { submitError && <p className="single-page-form__error error">{ submitError }</p> }
      { successMessage && <p className="single-page-form__success-message success">{ successMessage }</p> }
      <div className="single-page-form__submit-row">
        <button type="submit" className="single-page-form__submit-button" disabled={submitting}>Save Page</button>
      </div>
    </form>
  )
}

export default SinglePageForm;
