import React, { useState, useEffect, createContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FirebaseReducer, isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { isEqual } from 'lodash';

import { RootState } from '../../store/reducers/rootReducer';

import Header from './header/Header';
import Footer from './footer/Footer';
import SimpleSinglePage from './simple-single-page/SimpleSinglePage';
import UserLogin from './login/Login';
import ForgotPassword from './forgot-password/ForgotPassword';
import MyAccount from './my-account/MyAccount';
import Subscription from './subscription/Subscription';
import Home from './home/Home';
import PageNotFound from '../general/404/PageNotFound';
import WordCategories from './word-categories/WordCategories';
import Subcategories from './subcategories/Subcategories';
import Groups from './groups/Groups';
import Group from './group/Group';
import Exercise from './exercise/Exercise';
// import WeeklyStudyGuides from './weekly-study-guides/WeeklyStudyGuides';
// import WeeklyStudyGuide from './weekly-study-guide/WeeklyStudyGuide';
import Page from './page/Page';
import Loading from '../general/loading/Loading';

import { CollectionNames, HomeLanguage } from '../models/models';


export const ProductsContext = createContext([]);

let auth = {} as FirebaseReducer.AuthState;
export const AuthContext = createContext(auth);

const Main = (): JSX.Element => {

  useFirestoreConnect([
    { collection: CollectionNames.HomeLanguages, orderBy: ['createdAt', 'asc']  },
    { collection: CollectionNames.Products, where: ['active', '==', true] }
  ])

  const homeLanguages = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.HomeLanguages], isEqual);

  const [activeLanguage, setActiveLanguage] = useState<HomeLanguage|null>(null);

  useEffect(() => {
    if (homeLanguages && homeLanguages.length) setActiveLanguage(homeLanguages[0])
  }, [homeLanguages])

  auth = useSelector((state: RootState) => state.firebase.auth, isEqual);
  const products = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.Products]);

  if (!isLoaded(products) || !auth.isLoaded) return (
    <main>
      <Header homeLanguages={homeLanguages} setActiveLanguage={setActiveLanguage}/>
      <Loading />
      <Footer />
    </main>
  )

  return (
    <AuthContext.Provider value={auth}>
      <ProductsContext.Provider value={products}>
        <main>
          <Header homeLanguages={homeLanguages} setActiveLanguage={setActiveLanguage}/>
          <Switch>
            <Route exact path="/">
              <Home activeLanguage={activeLanguage} />
            </Route>
            <Route exact path="/terms-of-use" component={SimpleSinglePage} />
            <Route exact path="/teacher-notes" component={SimpleSinglePage} />
            <Route exact path="/login" component={UserLogin} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/my-account" component={MyAccount} />
            <Route exact path="/subscription" component={Subscription} />
            <Route exact path="/word-categories" component={WordCategories} />
            <Route exact path="/subcategories/:categoryId" component={Subcategories} />
            <Route exact path="/groups/:subcategoryId/" component={Groups} />
            <Route exact path="/group/:subcategoryId/:groupId" component={Group} />
            <Route exact path="/exercise/:subcategoryId/:groupId/:exerciseId" component={Exercise} />
            <Route exact path="/test/:subcategoryId/:exerciseId" component={Exercise} />
            {/* <Route exact path="/weekly-study-guides" component={WeeklyStudyGuides} /> */}
            {/* <Route exact path="/weekly-study-guide/:guideId" component={WeeklyStudyGuide} /> */}
            <Route exact path="/page/:slug" component={Page} />
            <Route path="/" component={PageNotFound} />
          </Switch>
          <Footer />
        </main>
      </ProductsContext.Provider>
    </AuthContext.Provider>
  )
}

export default Main;
