import { useContext } from 'react';
import { UserInfoContext, CurrentSubscriptionContext } from '../Main';

const useSubscription = (wordCategory?: string|null): string|null => {
  // Returns undefined if
  //  - not logged in
  //  - no subscription
  //  Returns a boolean if
  //  - wordCategory is passed in and whether the user's subscription includes that category
  // Return a string if
  //  - user is subscribed to something (returns product's name)

  const userInfo = useContext(UserInfoContext);
  const currentSubscription = useContext(CurrentSubscriptionContext);

  if (userInfo) {

    if (currentSubscription) {
      const subscription = currentSubscription.items[0].price.product.name;
      if (!wordCategory || subscription.includes(wordCategory)) return subscription;
    }
  }

  return null;
}

export default useSubscription;
