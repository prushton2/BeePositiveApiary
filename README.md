# BeePositiveApiary
Repository for the website BeePositiveApiary.com

This is the frontend of [beepositiveapiary.com](https://www.beepositiveapiary.com), a website that was built to handle orders of products from my apiary.
Check out the [node.js server](https://github.com/prushton2/BeePositiveApiaryNodeServer) to see the backend code aswell.

## Frontend Setup

### This project uses Javascript modules, which are standard in [ECMAScript 6](http://es6-features.org/). 
If you are using Python's HTTP server to run the site and modules do not work, use ```python run.py [port]``` to run the project instead. This bug is caused by an older version of Python's HTTP server not supporting modules, and this patches in a solution. I recommend updating Python for a permanent fix.<br><br>

### Actually setting up the program
Create a config.js file and populate it with the following:
```javascript
export const dburl = "<database URL>"
export const tax = "<Your area tax, type 0 if it doesnt exist>"
```
