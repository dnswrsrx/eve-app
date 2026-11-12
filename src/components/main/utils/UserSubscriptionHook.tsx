import { useContext } from 'react';
import { UserInfoContext, CurrentSubscriptionContext, AuthContext } from '../Main';

const useSubscription = (): string => {
  // Returns undefined if
  //  - not logged in
  //  - no subscription
  //  Returns a boolean if
  //  - wordCategory is passed in and whether the user's subscription includes that category
  // Return a string if
  //  - user is subscribed to something (returns product's name) or has access code

  const auth = useContext(AuthContext);
  const userInfo = useContext(UserInfoContext);
  const currentSubscription = useContext(CurrentSubscriptionContext);

  if (auth && userInfo) {
    if (currentSubscription) {
      return currentSubscription.id
    }
  }

  return ''
}

export default useSubscription;
