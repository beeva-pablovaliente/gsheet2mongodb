# Nodejs App to Extract information from a Google SpreadSheet and Insert it into a MongoDB Database #

It is necessary to set the next parameters into the creds.json file:

1- spreadSheetId : SpreadSheet Identifier from Google. We can get this parameter when we share the SpreadSheet. This parameter comes in the URL
2- workSheetName : The name of the sheet we want to read data from
3- token : Token obtained from Google

# Obtain Token from Google #

We can get the Token from Google OAuth 2.0 Protocol. We will need two parameters to retrieve the Token:
1- Client Id
2- Client Secret

To obtain these parameters we have to log into Google Developer Console (https://console.developers.google.com),
navigate to APIs & Auth --> Credentials
Next, We have to create a new Client ID --> Web application

To follow the OAuth2.0 flow, we can use the documentation from here: https://developers.google.com/accounts/docs/OAuth2WebServer