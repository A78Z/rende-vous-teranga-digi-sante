import Parse from 'parse';

const appId = process.env.NEXT_PUBLIC_PARSE_APPLICATION_ID || 'YOUR_APP_ID';
const jsKey = process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY || 'YOUR_JAVASCRIPT_KEY';
const serverURL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL || 'https://parseapi.back4app.com/';

if (typeof window !== 'undefined') {
  Parse.initialize(appId, jsKey);
  Parse.serverURL = serverURL;
} else {
  // Use Parse/node if we are strictly in a node env, but parse handles it mostly.
  Parse.initialize(appId, jsKey);
  Parse.serverURL = serverURL;
}

export default Parse;
