import React, { useEffect } from 'react';
import { Adsense } from '@ctrl/react-adsense';
import './Ads.scss';

const pathsToHideAds = ['/my-account', '/subscription', '/login', '/forgot-password'];

interface AdsProp {
  slot: string
}

const adsURL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8556217605588205'

const Ads = ({ slot }: AdsProp): JSX.Element => {

  useEffect(() => {
    const elements = [
      document.querySelector('div#root') as HTMLElement,
      document.querySelector('div#root > main') as HTMLElement,
      document.querySelector('div#root > main > section') as HTMLElement,
      document.querySelector('div#root > main > section > div') as HTMLElement,
    ]

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

    return () => {
      observer.disconnect()
      if (document.querySelector(`script[src="${adsURL}"]`)) {
        document.querySelector(`script[src="${adsURL}"]`)!.remove()
      }
    };
  }, [])

  if (!pathsToHideAds.includes(window.location.pathname)) {
    if (window.location.hostname.startsWith('localhost') || window.location.hostname.startsWith('127.0.0.1')) {
      return <div className="local-ads"></div>
    } else {
      if (!document.querySelector(`script[src="${adsURL}"]`)) {
        const script = document.createElement('script');
        script.src = adsURL
        script.crossOrigin = 'anonymous'
        document.querySelector('body')?.appendChild(script)
      }
      return <Adsense client="ca-pub-8556217605588205" slot={slot} format="auto" responsive="true" />
    }
  }

    return <></>
}

export default Ads;
