import { greetUser } from '$utils/greet';

import { handleAuth0 } from './wf-auth';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Auth is Damn Working';
  greetUser(name);
});

handleAuth0();
