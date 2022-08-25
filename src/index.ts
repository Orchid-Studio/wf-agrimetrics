import { greetUser } from '$utils/greet';

import { handleAuth0 } from './wf-auth';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'John Doe';
  greetUser(name);
});

handleAuth0();
