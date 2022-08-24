import createAuth0Client from '@auth0/auth0-spa-js';

const config = {
  domain: 'sgnota.us.auth0.com',
  clientId: 'dMuqia5K4PlR7FkRzEH2lkkSo0PB4szK',
};

const attachListeners = () => {
  const loginButton = document.getElementById('auth0-login');
  if (loginButton) {
    loginButton.addEventListener('click', login);
  }

  const logoutButton = document.querySelector('auth0-logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => logout());
  }
};

let auth0 = null;
const configureClient = async () => {
  attachListeners();
  try {
    auth0 = await createAuth0Client({
      domain: config.domain,
      client_id: config.clientId,
    });
    window.checkitout = auth0;
  } catch (e) {
    console.error('FUCK', e);
  }
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin, // + "/dashboard/main"
  });
};

const applyStartEndWildcard = (str) => `^${str}$`;

const formatWildcard = (valueToFmt) => valueToFmt.replace(/\*/g, '[^ ]*');

const isLoggedOut = () => {
  const validLogoutPaths = ['/', '/access-denied', '/public', '/landing', '/pubwild/*'];

  const loggedout = validLogoutPaths
    .map(applyStartEndWildcard)
    .map(formatWildcard)
    .reduce((valid, lPath) => {
      if (valid === true) return true;
      const currentLocation = window.location.pathname;

      const result = currentLocation.match(lPath);
      console.log('here', { lPath, currentLocation, result });
      return !!result;
    }, false);

  console.log('loggedout', loggedout);
  return loggedout;
};

const logout = (logoutPath = '/') => {
  if (!isLoggedOut()) {
    auth0.logout({
      returnTo: window.location.origin + logoutPath,
    });
  }
};

const populateAuth0Element = (data, key, domAttribute = 'innerText') => {
  const elements = document.body.querySelectorAll(`[data-auth0="${key}"]`);
  const elementsArray = Array.from(elements);
  elementsArray.map((element) => {
    if (element) {
      element[domAttribute] = data[key];
    }
  });
};

const updateUI = async () => {
  console.log('updateUI');
  const isAuthenticated = await auth0.isAuthenticated();
  if (!isAuthenticated) {
    logout();
  } else {
    // use full if you need to make requests using an auth0 token

    const token = await auth0.getTokenSilently();

    const user = await auth0.getUser();

    populateAuth0Element(user, 'picture', 'src');
    populateAuth0Element(user, 'name');
    populateAuth0Element(user, 'email');
    populateAuth0Element(user, 'family_name');
    populateAuth0Element(user, 'given_name');
    populateAuth0Element(user, 'nickname');

    return;
  }
};

const handleAuth0 = async () => {
  console.log('handleAuth0');

  await configureClient();

  // check for the code and state parameters
  const query = window.location.search;

  if (query.includes('code=') && query.includes('state=')) {
    // Process the login state
    await auth0.handleRedirectCallback();

    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  updateUI();
};

handleAuth0();
