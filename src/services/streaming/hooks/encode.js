'use strict';

const exec = require('child_process').exec;
const ffmpeg = require('fluent-ffmpeg');
const errors = require('feathers-errors');

module.exports = () => hooks => {

  const service = hooks.app.service('streamings');
  const dir = process.env.DATA_DIR;

  let streaming;

  const getName = () => {
    return streaming.streamName;
  };
  const getOriginalInput = () => {
    return dir + '/' + getName() + '.flv';
  };
  const getOutput = ver => {
    return dir + '/' + getName() + '/' + ver;
  };
  const init = () => {
    return new Promise((resolve,reject) => {
      service.patch(hooks.id, {status: 'encoding'})
        .then(resolve)
        .catch(reject);
    });
  };
  const getStreaming = () => {
    return new Promise((resolve,reject) => {
      service.get(hooks.id).then(data => {
        streaming = data;
        resolve();
      }).catch(reject);
    });
  };
  const createDir = () => {
    return new Promise((resolve,reject) => {
      var cmd = 'mkdir -p ' + dir + '/' + getName() + '/thumbs';
      exec(cmd, (err, stdout, stderr) => {
        if(err !== null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
  const createScreenshots = () => {
    return new Promise((resolve,reject) => {
      ffmpeg()
        .input(getOriginalInput())
        .screenshots({
          count: 4,
          folder: getOutput('thumbs')
        })
        .on('end', () => {
          resolve();
        })
        .on('error', err => {
          reject(err);
        });
    });
  };
  const createAudio = () => {
    return new Promise((resolve,reject) => {
      ffmpeg()
        .input(getOriginalInput())
        .output(getOutput('audio.mp3'))
        .noVideo()
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .on('end', () => {
          resolve();
        })
        .on('error', err => {
          reject(err);
        })
        .run();
    });
  };
  const createVideo = (format) => {
    let size, videoBitrate, audioBitrate;
    switch (format) {
      case '720p':
        size = '?x720';
        videoBitrate = '1920k';
        audioBitrate = '128k';
        break;
      case '480p':
        size = '?x480';
        videoBitrate = '1024k';
        audioBitrate = '128k';
        break;
      case '360p':
        size = '?x360';
        videoBitrate = '768k';
        audioBitrate = '96k';
        break;
      case '240p':
        size = '?x240';
        videoBitrate = '256k';
        audioBitrate = '32k';
        break;
      default:
    }
    return () => {
      return new Promise((resolve, reject) => {
        ffmpeg()
        .input(getOriginalInput())
        .output(getOutput(format + '.mp4'))
        .videoCodec('libx264')
        .audioCodec('libmp3lame')
        .format('mp4')
        .size(size)
        .videoBitrate(videoBitrate)
        .audioBitrate(audioBitrate)
        .on('progress', info => {
          // console.log('Encoding progress: ' + info.percent + '%');
        })
        .on('end', () => {
          resolve();
        })
        .on('error', err => {
          reject(err);
        })
        .run();
      });
    }
  }
  const moveOriginal = () => {
    return new Promise((resolve,reject) => {
      exec('mv ' + dir + '/' + getName() + '.flv ' + dir + '/' + getName() + '/', (err, stdout, stderr) => {
        if(err !== null) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };
  const res = err => {
    if(err) {
      console.log(err);
    } else {
      service.patch(hooks.id, {status: 'encoded'});
    }
    return hooks;
  };
  if(hooks.params.action == 'encode') {
    init()
      .then(getStreaming)
      .then(createDir)
      .then(createScreenshots)
      .then(createVideo('720p'))
      .then(createAudio)
      .then(moveOriginal)
      .then(res)
      .catch(res);
  }
  return hooks;
};
