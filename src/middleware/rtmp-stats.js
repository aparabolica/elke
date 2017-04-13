'use strict';

const express = require('express');
const http = require('http');
// const parseString = require('xml2js').parseString;

const rtmpStats = express();

rtmpStats.get('/', (req, res, next) => {
  res.send({});
  // Must find workaround: Nginx container is not recognized in node app container. Should it?
  // http.get('http://localhost/stats.xml', response => {
  //   let xml = '';
  //   response.on('data', chunk => {
  //     xml += chunk;
  //   });
  //   response.on('error', err => {
  //     console.log(err);
  //   });
  //   response.on('timeout', err => {
  //     console.log(err);
  //   });
  //   response.on('end', () => {
  //     parseString(xml, (err, result) => {
  //       res.send(result);
  //     });
  //   });
  // });
});

module.exports = () => {
  return rtmpStats;
};
