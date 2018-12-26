# Reload Sample App

## Instructions

1. Install dependencies `npm i`
2. Run `npm start`
3. Make a noticeable change to index.html in the `public` directory
4. The server should restart and the browser should automatically reload with the changes
    * Note: When implementing reload into your application it is up to you to implement an automatic server reload with server reload tools like [supervisor](https://www.npmjs.com/package/supervisor), [nodemon](https://www.npmjs.com/package/nodemon), etc. Otherwise you will have to manually reload the server before reload will do the automatic browser refresh