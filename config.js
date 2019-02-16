
const aws = require('aws-sdk');
  let s3 = new aws.S3({
  d_token: process.env.SECRET_TOKEN,
  prefix: "/",
  adminID: "206308444662267905",
  db_password: "jackspass"
  });
