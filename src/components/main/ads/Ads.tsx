import React, { useContext } from 'react';
import { Adsense } from '@ctrl/react-adsense';
import { AuthContext } from '../Main';
import useSubscription from '../utils/UserSubscriptionHook';

const pathsToHideAds = ['/my-account', '/subscription', '/login', '/forgot-password'];

interface AdsProp {
  slot: string
}

const Ads = ({ slot }: AdsProp): JSX.Element => {

  const auth = useContext(AuthContext);
  const isSubscribed = useSubscription();

  if (!pathsToHideAds.includes(window.location.pathname)) {
    if (!auth.uid || !isSubscribed) {
      return <Adsense client="ca-pub-6759848654104488" slot={slot} format="fluid" />
    }
  }

    return <></>
}

export default Ads;
