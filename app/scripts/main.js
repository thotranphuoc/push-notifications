/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';
// get keys from here: https://web-push-codelab.glitch.me/
const applicationServerPublicKey = 'BG581OQVuGKIYYS5lTBzMWdDsyaP9k0BPYvxr3eTBbkT0JFjp4wskMVpjVJeD4RIFa9SgQ10cR3DmV7UDmWP0wo';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
    .then((swReg) => {
      console.log('Service worker is registered', swReg);
      swRegistration = swReg;
      initializeUI();
    })
    .catch(err => {
      console.error('Service Worker Error', err);
    });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Support';
}

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.', event);
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };
  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
})

function initializeUI() {
  pushButton.addEventListener('click', () => {
    pushButton.disabled = true // make sure user cannot click button 2 times
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      // TODO: subscribe user
      subscribeUser();
    }
  })
  // set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then((subscription) => {
      console.log(subscription);
      isSubscribed = !(subscription === null);

      updateSubscriptionOnServer(subscription);

      if (isSubscribed) {
        console.log('User is subscribed');
      } else {
        console.log('User is not subscribed');
      }
      updateBtn();
    })
}

function updateBtn() {
  console.log(Notification);

  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }
  if (isSubscribed) {
    pushButton.textContent = 'Disabled Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then((subscription) => {
      console.log('User is subscribe with subscription:', subscription);
      updateSubscriptionOnServer(subscription);
      isSubscribed = true;
      updateBtn();
    })
    .catch((err) => {
      console.log('Faild to subscribe the user:', err);
      updateBtn();
    })
}

function updateSubscriptionOnServer(subscription) {
  // TODO: send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails = document.querySelector('.js-subscription-details');
  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}