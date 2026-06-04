// cookie.js - Simple cookie utility for Rotana E-learning

/**
 * Set a cookie
 * @param {string} name
 * @param {string} value
 * @param {number} days
 */
function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

/**
 * Get a cookie by name
 * @param {string} name
 * @returns {string|null}
 */
function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
  }
  return null;
}

/**
 * Delete a cookie by name
 * @param {string} name
 */
function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Example usage:
// setCookie('rotana_user', 'username', 7);
// let user = getCookie('rotana_user');
// eraseCookie('rotana_user');
