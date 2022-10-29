import { useContext } from 'react';
import { UserInfoContext, CurrentSubscriptionContext } from '../components/main/Main';

const useSubscription = (wordCategory?: string|null): string|boolean|undefined => {
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
      let subscription = currentSubscription.items[0].price.product.name;

      if (wordCategory) return subscription.includes(wordCategory);

      return subscription;
    }
  }
}

export default useSubscription;
