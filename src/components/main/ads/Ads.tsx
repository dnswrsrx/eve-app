import React, { useEffect, useContext } from 'react';
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

  useEffect(() => {
    const elements = [document.querySelector('div#root') as HTMLElement, document.querySelector('div#root > main') as HTMLElement]

    const observer = new MutationObserver((mutations, observer) => {
      mutations.forEach(m => {
        const elem = m.target as HTMLElement
        elem.style.height = "";
        elem.style.minHeight = "";
      })
    })

    elements.forEach(e => observer.observe(e, {
      attributes: true,
      attributeFilter: ['style']
    }))

    setTimeout(() => {
      elements.forEach((e: HTMLElement) => e.style.height = "100%")
    }, 1000)

    return () => observer.disconnect();
  }, [])

  if (!pathsToHideAds.includes(window.location.pathname)) {
    if (!auth.uid || !isSubscribed) {
      return <Adsense style={{marginTop: 'auto'}} client="ca-pub-8556217605588205" slot={slot} format="auto" responsive="true" />
    }
  }

    return <></>
}

export default Ads;
