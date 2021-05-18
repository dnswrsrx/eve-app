import React, { useState, useRef } from 'react';
import { CollectionNames, DefaultStudyGuide, StudyGuideDocument, StudyGuide } from '../../../models/models';
import DayPicker, { DateUtils } from 'react-day-picker';
import firebase from '../../../../config/firebaseConfig';
import 'react-day-picker/lib/style.css';
import './GuideForm.scss';
import CustomEditor from '../custom-editor/CustomEditor';

interface GuideFormProps {
  guideId?: string,
  guide?: StudyGuide,
}

const GuideForm = ({ guideId, guide }: GuideFormProps): JSX.Element => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  const generalVocabContent = useRef<string>(guide?.generalVocabContent || DefaultStudyGuide.GeneralVocab);
  const academicVocabContent = useRef<string>(guide?.academicVocabContent || DefaultStudyGuide.AcademicVocab);
  const readingContent = useRef<string>(guide?.readingContent || DefaultStudyGuide.Reading);
  const listeningContent = useRef<string>(guide?.listeningContent || DefaultStudyGuide.Listening);
  const pronunciationContent = useRef<string>(guide?.pronunciationContent || DefaultStudyGuide.Pronunciation);
  const grammarContent = useRef<string>(guide?.grammarContent || DefaultStudyGuide.Grammar);
  const speakingContent = useRef<string>(guide?.speakingContent || DefaultStudyGuide.Speaking);
  const testPrepContent = useRef<string>(guide?.testPrepContent || DefaultStudyGuide.TestPrep);

  const [datesSelected, setDatesSelected] = useState<any>({
    from: guide?.startDate.toDate(),
    to: guide?.endDate.toDate(),
    enteredTo: guide?.endDate.toDate(),
  });
  const modifiers = { start: datesSelected.from, end: datesSelected.enteredTo };
  const disabledDays = { before: datesSelected.from };
  const selectedDays = [datesSelected.from, { from: datesSelected.from, to: datesSelected.enteredTo }];
  const previousMonth = new Date();
  previousMonth.setDate(0);
  const studyGuideCollection = firebase.firestore().collection(CollectionNames.StudyGuides);

  const isSelectingFirstDay = (day: Date) => {
    const isBeforeFirstDay = datesSelected.from && DateUtils.isDayBefore(day, datesSelected.from);
    const isRangeSelected = datesSelected.from && datesSelected.to;
    return !datesSelected.from || isBeforeFirstDay || isRangeSelected;
  }

  const onDayClicked = (day: Date): void => {
    if(datesSelected.from && datesSelected.to && day >= datesSelected.from && day <= datesSelected.to) {
      resetDayPicker();
      return;
    }
    if(isSelectingFirstDay(day)) {
      setDatesSelected({
        from: day,
        to: null,
        enteredTo: null,
      });
    }
    else {
      setDatesSelected({
        from: datesSelected.from,
        to: day,
        enteredTo: day,
      });
    }
  }

  const onMouseEnter = (day: Date): void => {
    if(!isSelectingFirstDay(day)) {
      setDatesSelected({
        from: datesSelected.from,
        to: datesSelected.to,
        enteredTo: day,
      });
    }
  }

  const resetDayPicker = (): void => {
    setDatesSelected({
      from: null,
      to: null,
      enteredTo: null,
    })
  }

  const renderDatePickerNotice = (): JSX.Element => (
    <p className="add-guide-form__date-instructions">
      { !datesSelected.from && !datesSelected.to && 'Please select the starting day for this study guide.' }
      { datesSelected.from && !datesSelected.to && 'Please select the last day for this study guide.' }
      {
        datesSelected.from && datesSelected.to
          && `Selected range:  ${datesSelected.from.toLocaleDateString()} to ${datesSelected.to.toLocaleDateString()}`
      }
    </p>
  )

  const saveStudyGuide = (): void => {
    if(!datesSelected.from || !datesSelected.to) {
      setSuccessMessage('');
      setSubmitError('Please select a date range.');
    }
    else {
      setSubmitting(true);

      const studyGuideFields: StudyGuideDocument = {
        startDate: datesSelected.from,
        endDate: datesSelected.to,
        generalVocabContent : generalVocabContent.current,
        academicVocabContent : academicVocabContent.current,
        readingContent : readingContent.current,
        listeningContent : listeningContent.current,
        pronunciationContent : pronunciationContent.current,
        grammarContent : grammarContent.current,
        speakingContent : speakingContent.current,
        testPrepContent : testPrepContent.current
      }
      let docRef;

      if(!guide && !guideId) {
        studyGuideFields.createdAt = new Date();
        docRef = studyGuideCollection.doc();
      }
      else {
        docRef = studyGuideCollection.doc(guideId);
      }

      docRef.set(studyGuideFields).then((): void => {
        setSuccessMessage('Weekly study guide has been saved.');
        setSubmitError('');
        setSubmitting(false);
        if(!guide) {
          resetDayPicker();
          resetContents();
        }
      }).catch((error: { message: string }): void => {
        setSuccessMessage('');
        setSubmitError(error.message);
        setSubmitting(false);
      });
    }
  }

  const resetContents = (): void => {
    generalVocabContent.current = DefaultStudyGuide.GeneralVocab;
    academicVocabContent.current = DefaultStudyGuide.AcademicVocab;
    readingContent.current = DefaultStudyGuide.Reading;
    listeningContent.current = DefaultStudyGuide.Listening;
    pronunciationContent.current = DefaultStudyGuide.Pronunciation;
    grammarContent.current = DefaultStudyGuide.Grammar;
    speakingContent.current = DefaultStudyGuide.Speaking;
    testPrepContent.current = DefaultStudyGuide.TestPrep;
  }

  return (
    <div className="add-guide-form">
      <h2 className="add-guide-form__heading">Study Guide Fields</h2>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">Date Range: </h3>
        { renderDatePickerNotice() }
        <DayPicker
          className="add-guide-form__range-picker"
          numberOfMonths={2}
          fromMonth={previousMonth}
          selectedDays={selectedDays}
          disabledDays={disabledDays}
          modifiers={modifiers}
          onDayClick={onDayClicked}
          onDayMouseEnter={onMouseEnter}
        />
      </div>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">General Vocabulary Content: </h3>
        <CustomEditor contentReference={generalVocabContent} height={300} />
      </div>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">Academic Vocabulary Content: </h3>
        <CustomEditor contentReference={academicVocabContent} height={300} />
      </div>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">Reading Content: </h3>
        <CustomEditor contentReference={readingContent} height={300} />
      </div>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">Listening Content: </h3>
        <CustomEditor contentReference={listeningContent} height={300} />
      </div>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">Pronunciation Content: </h3>
        <CustomEditor contentReference={pronunciationContent} height={300} />
      </div>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">Grammar Content: </h3>
        <CustomEditor contentReference={grammarContent} height={300} />
      </div>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">Speaking Content: </h3>
        <CustomEditor contentReference={speakingContent} height={300} />
      </div>
      <div className="add-guide-form__field-row">
        <h3 className="add-guide-form__subheading">Test Preparation Content: </h3>
        <CustomEditor contentReference={testPrepContent} height={300} />
      </div>
      { submitError && <p className="add-guide-form__error error">{ submitError }</p> }
      { successMessage && <p className="add-guide-form__success-message success">{ successMessage }</p> }
      <div className="add-guide-form__submit-row">
        <button className="add-guide-form__submit-button" disabled={submitting} onClick={saveStudyGuide}>
          Save Study Guide
        </button>
      </div>
    </div>
  )
}

export default GuideForm;
