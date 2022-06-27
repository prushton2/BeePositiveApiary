# BeePositiveApiary
Repository for the website BeePositiveApiary.com

This is the frontend of [beepositiveapiary.com](https://www.beepositiveapiary.com), a website that was built to handle orders of products from my apiary.
Check out the [node.js server](https://github.com/prushton2/BeePositiveApiaryNodeServer) to see the backend code aswell.

# Setup

## This project uses Javascript modules, which are standard in [ECMAScript 6](http://es6-features.org/). 
If you are using Python's HTTP server to run the site and modules do not work, use ```python run.py [port]``` to run the project instead. This only allows connections from the localhost, and this should not be used for production. Python's http server is not production ready either.<br><br>

## Actually setting up the program
Create a config.js file in root and populate it with the following:
```javascript
export const dburl = "<database URL>"
export const tax = "<Your area tax, type 0 if it doesnt exist>"
```
## Allowing  authentication
### Google
All the authentication scripts are located in ```/login``` directory. Please refer to [Google's guide to google authentication](https://developers.google.com/identity/gsi/web) for help setting this up. 