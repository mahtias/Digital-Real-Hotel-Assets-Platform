// Block ALL tracking and analytics requests
const BLOCKED_PATTERNS = [
  '/app-logs/',
  'log-user-in-app',
  '/analytics',
  '/track',
  'segment.com',
  'google-analytics.com',
  'mixpanel.com',
];

// INTERCEPT FETCH
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  const urlString = typeof url === 'string' ? url : url.toString();
  
  const isBlocked = BLOCKED_PATTERNS.some(pattern => 
    urlString.includes(pattern)
  );
  
  if (isBlocked) {
    console.warn(' Blocked tracking request:', urlString);
    
    // Return fake success response
    return Promise.resolve(new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
      }
    ));
  }
  
  return originalFetch.call(this, url, options);
};

//  INTERCEPT XMLHttpRequest
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  const urlString = typeof url === 'string' ? url : url.toString();
  
  const isBlocked = BLOCKED_PATTERNS.some(pattern => 
    urlString.includes(pattern)
  );
  
  if (isBlocked) {
    console.warn(' Blocked XHR tracking request:', urlString);
    
    // Override send to do nothing
    this.send = function() {
      // Fake success
      Object.defineProperty(this, 'status', { value: 200 });
      Object.defineProperty(this, 'responseText', { value: '{"success":true}' });
      Object.defineProperty(this, 'readyState', { value: 4 });
      
      // @ts-ignore
      if (this.onload) this.onload();
      // @ts-ignore
      if (this.onreadystatechange) this.onreadystatechange();
    };
    
    return;
  }
  
  return originalOpen.call(this, method, url, ...args);
};

// ✅ BLOCK WEBSOCKETS
const OriginalWebSocket = window.WebSocket;
// @ts-ignore
window.WebSocket = function(url, protocols) {
  const urlString = typeof url === 'string' ? url : url.toString();
  
  if (urlString.includes('ws-user-apps') || 
      urlString.includes('socket.io') ||
      urlString.includes('app_id=disabled')) {
    console.warn(' Blocked WebSocket:', urlString);
    
    // Return fake WebSocket
    return {
      close: () => {},
      send: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      readyState: 3,
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3,
    };
  }
  
  return new OriginalWebSocket(url, protocols);
};

console.log(' Request blocker initialized');
