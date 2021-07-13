import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import PrivacyPolicy from './privacy-policy/PrivacyPolicy';
import UserLogin from './login/Login';
import Register from './register/Register';
import ForgotPassword from './forgot-password/ForgotPassword';
import MyAccount from './my-account/MyAccount';
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

const Main = (): JSX.Element => {
  return (
    <main>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
        <Route exact path="/login" component={UserLogin} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/my-account" component={MyAccount} />
        <Route exact path="/word-categories" component={WordCategories} />
        <Route exact path="/subcategories/:categoryId" component={Subcategories} />
        <Route exact path="/groups/:subcategoryId/" component={Groups} />
        <Route exact path="/group/:subcategoryId/:groupId" component={Group} />
        <Route exact path="/exercise/:subcategoryId/:groupId/:exerciseId" component={Exercise} />
        {/* <Route exact path="/weekly-study-guides" component={WeeklyStudyGuides} /> */}
        {/* <Route exact path="/weekly-study-guide/:guideId" component={WeeklyStudyGuide} /> */}
        <Route exact path="/page/:slug" component={Page} />
        <Route path="/" component={PageNotFound} />
      </Switch>
      <Footer />
    </main>
  )
}

export default Main;
