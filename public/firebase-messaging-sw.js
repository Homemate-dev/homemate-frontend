// web/firebase-messaging-sw.js
/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyBIf_Wo8bx-mUbUoWn7wpJSEvOMRDPxGcg',
  authDomain: 'homemate-3e3fe.firebaseapp.com',
  projectId: 'homemate-3e3fe',
  storageBucket: 'homemate-3e3fe.firebasestorage.app',
  messagingSenderId: '437684088265',
  appId: '1:437684088265:web:b06b33889e14377bdd4c18',
  measurementId: 'G-VPLLHBT3LR',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[SW onBackgroundMessage]', payload)
  const { title, body, icon } = payload.notification ?? {}
  self.registration.showNotification(title || 'Homemate', {
    body: body || '새 알림이 도착했어요.',
    icon: icon || '/icon-192.png',
    data: payload.data || {},
  })
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data?.json() || {}
  } catch (_) {}

  const n = data.notification || {}
  const d = data.data || {}

  event.waitUntil(
    self.registration.showNotification(n.title || 'Homemate', {
      body: n.body || '새 알림이 도착했어요.',
      icon: n.icon || '/icon-192.png',
      data: d,
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification?.data?.url || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      const client = clientsArr.find(Boolean)
      if (client) {
        client.focus()
        client.navigate(targetUrl)
        return
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl)
    })
  )
})
