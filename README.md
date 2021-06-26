# Reddit Clone Backend

Reddit Clone MVC app made with React.js, Node.js, Express.js & MongoDB

[Live Demo](https://reddit-clone-20.herokuapp.com/)

[Video Demo](https://www.youtube.com/watch?v=isD8eEcNyv0) (in case the live site is broken)

[Frontend code](https://github.com/tamalweb/reddit-clone-20)

![Reddit Clone](https://raw.githubusercontent.com/tamalweb/reddit-clone-20/master/screenshot.png)

## To run the project

You only need to have this backend project to run the full app. After building the React app, I put the generated files into the `/client` folder in this project.

Download the fronend source code:

`git clone https://github.com/tamalweb/reddit-clone-20.git`

Download the backend source code:

`git clone https://github.com/tamalweb/reddit-clone-20-backend.git`

Go to each of the directories and install the dependencies:

`npm install`

Run the backend:

`npm run dev`

Run the frontend:

`npm start`

The app will start on `localhost:3000` and the backend server will run on `localhost:8080`

You will need node version `8.12.0` for this to work because some driver dependencies have updated. Install Node Version Manager (NVM) to install that specific version and run this project. [See this page for NVM instructions](https://tamalweb.com/which-nodejs-version#how-to-install-nvm-for-windows-computers)

For time constraints, I haven't updated the project to run on newer drivers and Node versions, so if you update the app, please do send me a PR, I would appreciate the update.

## Database

Provide your own MongoDB database driver and secret text.

Rename `sample.env` to just `.env` and set the DATABASE and SECRET with your own info like this:

```
DATABASE=mongodb://database_info
SECRET=RandomText
```

You can get free sandbox mongoDB hosting from [MongoDB Atlas](https://www.mongodb.com/)
