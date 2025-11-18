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

// Firebase Cloud Messaging용 객체를 하나 생성
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[SW onBackgroundMessage]', JSON.stringify(payload, null, 2))

  const n = payload.notification || {}
  const d = payload.data || {}

  const title = n.title || d.title || 'Homemate'
  const body = n.body || d.body || d.message || '새 알림이 도착했어요.'

  self.registration.showNotification(title, {
    body,
    icon: n.icon || '/icon-192.png',
    data: d,
  })
})

self.addEventListener('push', (event) => {
  console.log('[SW push raw]', event.data && event.data.text())

  let parsed = {}
  try {
    parsed = event.data?.json() || {}
  } catch (e) {
    try {
      parsed = event.data ? JSON.parse(event.data.text()) : {}
    } catch (e2) {
      console.error('[SW push parse error]', e, e2)
    }
  }

  const n = parsed.notification || {}
  const d = parsed.data || parsed

  const title = n.title || d.title || 'Homemate'
  const body = n.body || d.body || d.message || '새 알림이 도착했어요.'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
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
