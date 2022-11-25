import { useContext } from 'react';
import { UserInfoContext, CurrentSubscriptionContext, AccessCodeContext, AccessCodeSubscribersContext, AuthContext } from '../Main';

const useSubscription = (wordCategory?: string|null): string|null => {
  // Returns undefined if
  //  - not logged in
  //  - no valid access code
  //  - no subscription
  //  Returns a boolean if
  //  - wordCategory is passed in and whether the user's subscription includes that category
  // Return a string if
  //  - user is subscribed to something (returns product's name) or has access code

  const auth = useContext(AuthContext);
  const userInfo = useContext(UserInfoContext);
  const currentSubscription = useContext(CurrentSubscriptionContext);
  const accessCode = useContext(AccessCodeContext);
  const accessCodeSubscribers = useContext(AccessCodeSubscribersContext);

  if (auth && userInfo) {
    if (accessCode && accessCode.status === 'active' && Object.keys(accessCodeSubscribers).includes(auth.uid)) {
      const today = new Date();

      if (!accessCode.ended_at || today < new Date(accessCode.ended_at?.seconds * 1000)) {
        if (today < new Date(accessCode.current_period_end.seconds * 1000)) {
          return `Institutional-${userInfo.accessCode}`;
        }
      }
    }

    if (currentSubscription) {
      const subscription = currentSubscription.items[0].price.product.name;
      if (!wordCategory || subscription.includes(wordCategory) || subscription.includes('Institutional')) return subscription;
    }
  }

  return null;
}

export default useSubscription;
