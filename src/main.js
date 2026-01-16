// Polyfill para global (necesario para sockjs-client)
if (typeof global === 'undefined') {
  window.global = window
}

// Limpiar datos corruptos en localStorage al iniciar
try {
  const userStr = localStorage.getItem('user')
  if (userStr === 'undefined' || userStr === 'null' || userStr === '') {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
} catch (e) {
  // Ignorar errores al limpiar
}

console.log('=== INICIANDO APLICACIÓN ===')

async function initApp() {
  try {
    console.log('1. Importando Vue...')
    const { createApp } = await import('vue')
    console.log('2. Vue importado correctamente')
    
    console.log('3. Importando Pinia...')
    const { createPinia } = await import('pinia')
    console.log('4. Pinia importado correctamente')
    
    console.log('5. Importando App...')
    const AppModule = await import('./App.vue')
    const App = AppModule.default
    console.log('6. App importado correctamente')
    
    console.log('7. Creando aplicación Vue...')
    const app = createApp(App)
    console.log('8. Aplicación creada')
    
    console.log('9. Configurando Pinia...')
    const pinia = createPinia()
    app.use(pinia)
    console.log('10. Pinia configurado')
    
    console.log('11. Importando router...')
    const routerModule = await import('./router')
    const router = routerModule.default
    console.log('12. Router importado')
    
    console.log('13. Configurando router...')
    app.use(router)
    console.log('14. Router configurado')
    
    console.log('15. Montando aplicación en #app...')
    const appElement = document.getElementById('app')
    if (!appElement) {
      throw new Error('No se encontró el elemento #app en el DOM')
    }
    app.mount('#app')
    console.log('16. ✅ APLICACIÓN MONTADA CORRECTAMENTE')
    
  } catch (error) {
    console.error('❌ ERROR CRÍTICO:', error)
    console.error('Stack:', error.stack)
    
    // Mostrar error en la página
    const appDiv = document.getElementById('app')
    if (appDiv) {
      appDiv.innerHTML = `
        <div style="padding: 20px; font-family: monospace; background: #fee; border: 2px solid #f00; margin: 20px;">
          <h1 style="color: #c00;">Error al cargar la aplicación</h1>
          <h2>Mensaje:</h2>
          <pre style="background: #fff; padding: 10px; border: 1px solid #ccc;">${error.message}</pre>
          <h2>Stack:</h2>
          <pre style="background: #fff; padding: 10px; border: 1px solid #ccc; max-height: 400px; overflow: auto;">${error.stack}</pre>
          <button onclick="localStorage.clear(); location.reload();" style="margin-top: 20px; padding: 10px 20px; background: #c00; color: white; border: none; cursor: pointer;">
            Limpiar localStorage y recargar
          </button>
        </div>
      `
    } else {
      document.body.innerHTML = `
        <div style="padding: 20px; font-family: monospace; background: #fee; border: 2px solid #f00; margin: 20px;">
          <h1 style="color: #c00;">Error: No se encontró el elemento #app</h1>
          <p>El elemento con id="app" no existe en el HTML.</p>
        </div>
      `
    }
  }
}

// Iniciar la aplicación
initApp()
