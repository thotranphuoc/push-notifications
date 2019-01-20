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

function initializeUI() {
  // set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then((subscription) => {
      console.log(subscription);
      isSubscribed = !(subscription === null);
      if (isSubscribed) {
        console.log('User is subscribed');
      } else {
        console.log('User is not subscribed');
      }
      updateBtn();
    })
}

function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disabled Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}
