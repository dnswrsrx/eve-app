import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers/rootReducer';
import { isEqual } from 'lodash';
import { Adsense } from '@ctrl/react-adsense';
import useSubscription from '../../../utils/userSubscription';

const pathsToHideAds = ['/my-account', '/subscription', '/login', '/forgot-password'];

interface AdsProp {
  slot: string
}

const Ads = ({ slot }: AdsProp): JSX.Element => {

  const auth = useSelector((state: RootState) => state.firebase.auth, isEqual);
  const isSubscribed = useSubscription();

  if (!pathsToHideAds.includes(window.location.pathname)) {
    if (auth.isLoaded && (!auth.uid || isSubscribed === '')) {
      return <Adsense client="ca-pub-6759848654104488" slot={slot} format="fluid" />
    } 
  }

    return <></>
}

export default Ads;
