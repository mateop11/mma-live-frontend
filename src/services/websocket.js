import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { WS_BASE_URL } from '../config/api'

class WebSocketService {
  constructor() {
    this.client = null
    this.connected = false
    this.subscriptions = new Map()
  }

  connect() {
    if (this.connected) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      // Timeout para evitar que se quede colgado
      const timeout = setTimeout(() => {
        if (!this.connected) {
          console.warn('WebSocket timeout - continuando sin WebSocket')
          reject(new Error('WebSocket connection timeout'))
        }
      }, 5000)

      try {
        // Usar SockJS sin credenciales para evitar problemas de CORS
        const socket = new SockJS(`${WS_BASE_URL}/ws`, null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling']
        })
        
        this.client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            clearTimeout(timeout)
            this.connected = true
            console.log('WebSocket conectado')
            resolve()
          },
          onStompError: (frame) => {
            clearTimeout(timeout)
            console.error('Error STOMP:', frame)
            reject(frame)
          },
          onDisconnect: () => {
            this.connected = false
            this.subscriptions.clear()
            console.log('WebSocket desconectado')
          },
          onWebSocketError: (event) => {
            clearTimeout(timeout)
            console.warn('Error WebSocket (no crítico):', event)
            reject(event)
          }
        })

        this.client.activate()
      } catch (error) {
        clearTimeout(timeout)
        console.error('Error al crear WebSocket:', error)
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.client && this.connected) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe()
      })
      this.subscriptions.clear()
      this.client.deactivate()
      this.connected = false
    }
  }

  subscribe(destination, callback) {
    if (!this.connected || !this.client) {
      console.error('WebSocket no está conectado')
      return null
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body)
        callback(data)
      } catch (e) {
        callback(message.body)
      }
    })

    this.subscriptions.set(destination, subscription)
    return subscription
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(destination)
    }
  }

  send(destination, body) {
    if (this.connected && this.client) {
      this.client.publish({
        destination,
        body: JSON.stringify(body)
      })
    }
  }
}

// Instancia singleton
const wsService = new WebSocketService()

export default wsService
