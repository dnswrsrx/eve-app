import React from 'react';
import { Link } from 'react-router-dom';
import { MatchProps, CollectionNames, StudyGuideSection } from '../../models/models';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { studyGuideSections } from '../../../config/studyGuideConfig';
import Loading from '../../general/loading/Loading';
import './WeeklyStudyGuide.scss';

interface WeeklyStudyGuideProps {
  match: MatchProps,
}

const WeeklyStudyGuide = ({ match }: WeeklyStudyGuideProps): JSX.Element => {
  const guideId = match.params.guideId;

  useFirestoreConnect([
    { collection: CollectionNames.StudyGuides, doc: guideId, storeAs: guideId },
  ]);

  const guide = useSelector(({ firestore: { data } }: any) => data[guideId], isEqual);

  if(!isLoaded(guide)) return <Loading />;

  if(!guide) {
    return (
      <section className="study-guide">
        <div className="study-guide__wrapper page-wrapper">
          <div className="study-guide__header">
            <h1 className="study-guide__heading">
              Weekly Study Guide Not Found
            </h1>
            <Link to="/weekly-study-guides">Back to Weekly Study Guides</Link>
          </div>
        </div>
      </section>
    )
  }

  const formattedStartDate = guide.startDate.toDate().toDateString();
  const formattedEndDate = guide.endDate.toDate().toDateString();

  const renderStudyGuideSections = (): JSX.Element[] => {
    return studyGuideSections.reduce((result: JSX.Element[], section: StudyGuideSection, index: number): JSX.Element[] => {
      if(guide[section.id]) {
        result.push(
          <div key={index} className="study-guide__section">
            <h3 className="study-guide__section-heading">{ section.name }</h3>
            <div className="study-guide__section-main">
              <div className="study-guide__section-image" style={{ backgroundImage: `url(/images/${section.picture}.svg)` }} />
              <p className="study-guide__section-content" dangerouslySetInnerHTML={{ __html: guide[section.id] }} />
            </div>
          </div>
        );
      }
      return result;
    }, []);
  }

  return (
    <section className="study-guide">
      <div className="study-guide__wrapper page-wrapper">
        <div className="study-guide__header">
          <h1 className="study-guide__heading">Weekly Study Guide</h1>
          <h2 className="study-guide__subheading">{ `${formattedStartDate} - ${formattedEndDate}` }</h2>
          <Link to="/weekly-study-guides">Back to Weekly Study Guides</Link>
        </div>
        <div className="study-guide__content">
          { renderStudyGuideSections() }
        </div>
      </div>
    </section>
  )
}

export default WeeklyStudyGuide;
