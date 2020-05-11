const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const jobRouter = require('./routers/jobRouter');
const userRouter = require('./routers/userRouter');
// const contactRouter = require('./routers/contactRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/*
GET to /api/search -> jobs router -> jobs controller -> searchJobs, api request
GET to /api/savedJobs -> jobs router -> jobs controller -> ping database for jobs with the queried user ID
POST to /api/savedJobs -> jobs router -> jobs controller -> create job in database with given user ID
DELETE to /api/savedJobs -> jobs router -> jobs controller -> delete saved job
PUT/PATCH to /api/savedJobs -> jobs router -> jobs controller -> edit job info (notes)
POST to /api/users/signup -> user router -> users controller -> createUser in database
POST to /api/contact -> contact router -> contact controller -> createContact in database
GET to /api/contact -> contact router -> contact controller -> getContact frrm database with queried job
PUT/PATCH /api/contact -> contact router -> contact controller -> changeContact in database
POST /api/users/login -> sessionController -> verify user, start session
*/

// Routing a request to search for jobs.
app.use('/api/search', jobRouter, (req, res) => {
  console.log('Back in /search server.js');
});

// app.use('/api/savedJobs', jobRouter, (req, res) => {
//   return res.status(200).json();
// });
app.use('/api/users', userRouter, (req, res) => {
  console.log('Back in server.js');
  // return res.status(200).send('Returning from /api/users in server.js');
});

app.use('/', (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, '../../index.html'));
});

// Set static path as the bundle.js when in production mode
if (process.env.NODE_env === 'production') {
  app.use('/build', express.static(path.resolve(__dirname, '../../build')));

  app.get('/', (req, res) => {
    return res
      .status(200)
      .sendFile(path.resolve(__dirname, '../../index.html'));
  });
}

/*
Global Error Handling
*/
app.use('/', (req, res) => {
  res.status(404).send('Wrong way, turn around.');
});

app.use((err, req, res) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error!',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(...defaultErr, ...err);
  console.log('Global error handler: ', errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
