from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app

from google.cloud.firestore import Client
from google.cloud import secretmanager_v1beta2
import stripe

# For cost control, you can set the maximum number of containers that can be
# running at the same time. This helps mitigate the impact of unexpected
# traffic spikes by instead downgrading performance. This limit is a per-function
# limit. You can override the limit for each function using the max_instances
# parameter in the decorator, e.g. @https_fn.on_request(max_instances=5).
set_global_options(max_instances=1)

initialize_app()

client = Client()
secret_client = secretmanager_v1beta2.SecretManagerServiceClient()


@https_fn.on_call()
def create_portal_link(req: https_fn.CallableRequest) -> https_fn.Response | dict:

    if req.auth and req.auth.uid:

        if customer_id := client.collection('users').document(req.auth.uid).get().to_dict().get('stripeId'):

            sc = stripe.StripeClient(secret_client.access_secret_version(name='projects/english-vocabulary-exercises/secrets/stripe-cancel-now/versions/latest').payload.data.decode())
            session = sc.v1.billing_portal.sessions.create({
                'customer': customer_id,
                'return_url': req.data['returnUrl']
            })

            return {'url': session.url}

        raise https_fn.HttpsError(https_fn.FunctionsErrorCode.NOT_FOUND, 'No Stripe ID found for user')

    raise https_fn.HttpsError(https_fn.FunctionsErrorCode.UNAUTHENTICATED, 'No logged in user')


@https_fn.on_call()
def cancel_now(req: https_fn.CallableRequest) -> https_fn.Response | dict:

    if req.auth and req.auth.uid:

        subscription = client.collection('users').document(req.auth.uid).collection('subscriptions').document(req.data.get('subscriptionid')).get()

        if subscription.exists and subscription.get('status') == 'active':

            sc = stripe.StripeClient(secret_client.access_secret_version(name='projects/english-vocabulary-exercises/secrets/stripe-cancel-now/versions/latest').payload.data.decode())
            sc.v1.subscriptions.cancel(req.data.get('subscriptionid'), {'prorate': True})

            return {}

        raise https_fn.HttpsError(https_fn.FunctionsErrorCode.NOT_FOUND, 'No active subscription found for user')

    raise https_fn.HttpsError(https_fn.FunctionsErrorCode.UNAUTHENTICATED, 'No logged in user')
