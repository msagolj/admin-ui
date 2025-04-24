# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


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


