## Run

### `npm start`

## How to use
- For the API calls that don't require a AEM Admin API token you 
can use the app directly
- If you need to set send an AEM Admin API Token:
  - click on `Settings`
  - click on 'Login Options' next to the `AEM Admin API Token` input field
  - select a provider
  - login
  - open dev console for login window
  - extract token from cookie
  - paste it in the input field
  - Save

  After that you can use the API calls that require the token.
- Some API Calls (UpdatePreview) require an AEM Token:
  - click on `Settings`
  - in a seperate window opeen your AEMaaCS instance
  - open dev console
  - on network filter for token
  - extract the token 
  - paste it in the input field
  - Save

  When set it will be sent with the requests that require it.


