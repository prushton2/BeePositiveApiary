# BeePositiveApiary
Repository for the website BeePositiveApiary.com

This is a website build to handle ordering items from my local apiary<br>

### Making a fork (Unfinished, these instructions dont work yet)
* Download the [node.js server](https://github.com/prushton2/BeePositiveApiaryNodeServer)
* edit the [itemInfo.js](https://github.com/prushton2/BeePositiveApiary/blob/master/itemInfo.js) file to reflect the URL of the database
* create a post request to the database following this format to set up your passwords:
```javascript
{
  "password": <Current password>, //Dont include this key if you havent set up a password.
  "addPasswords": [<passwords>], //List of passwords to add. Leave empty if none.
  "removePasswords": [<passwords>] //List of passwords to remove. Leave empty if none
}
```
* Once this is done, disable the ability to edit passwords by changing ```allowPasswordChange``` to ```false``` in index.js
* You can view, complete, and archive the orders made by clients by entering a password in the ```/orders``` page.
