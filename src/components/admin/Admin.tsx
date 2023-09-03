import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { RootState } from '../../store/reducers/rootReducer';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { Navigate } from 'react-router-dom';
import Header from './header/Header';
import Home from './home/Home';
import EditHome from './edit-home/EditHome';
import SinglePage from './single-page/SinglePage';
import SimpleSinglePage from './simple-single-page/SimpleSinglePage';
import WordCategories from './word-categories/WordCategories';
import Subcategories from './subcategories/Subcategories';
import Groups from './groups/Groups';
import Group from './group/Group';
import Exercise from './exercise/Exercise';
import EditPages from './edit-pages/EditPages';
import Footer from './footer/Footer';
import PageNotFound from '../general/404/PageNotFound';
import Loading from '../general/loading/Loading';
import { CollectionNames, UserInfo } from '../models/models';

const Admin = (): JSX.Element => {
  const auth = useSelector((state: RootState) => state.firebase.auth, isEqual);

  useFirestoreConnect([{ collection: CollectionNames.Users, doc: `${auth?.uid}`, storeAs: 'userInfo' }]);
  const userInfo: UserInfo = useSelector(({ firestore: { data } }: any) => data['userInfo']);

  if(!auth.isLoaded || !isLoaded(userInfo)) {
    return (
      <section className="admin-dashboard">
        <Header />
        <Loading />
      </section>
    );
  }

  else if(!auth.uid || !userInfo?.isAdmin) return <Navigate to='/' />

  return (
    <main className="admin-dashboard">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home-languages" element={<EditHome />} />
        <Route path="/word-categories" element={<WordCategories />} />
        <Route path="/terms-of-use" element={<SimpleSinglePage />} />
        <Route path="/teacher-notes" element={<SimpleSinglePage />} />
        <Route path="/top-level-categories/:categoryId" element={<Subcategories />} />
        <Route path="/subcategories/:subcategoryId" element={<Groups />} />
        <Route path="/group/:subcategoryId/:groupId" element={<Group />} />
        <Route path="/exercise/:subcategoryId/:groupId/:exerciseId" element={<Exercise />} />
        <Route path="/test/:subcategoryId/:exerciseId" element={<Exercise />} />
        <Route path="/pages" element={<EditPages />} />
        <Route path="/edit-single/:type/:pageId" element={<SinglePage />} />
        <Route path="/" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </main>
  )
}

export default Admin;
