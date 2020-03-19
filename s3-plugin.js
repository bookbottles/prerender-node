// @NOTE Copied from https://github.com/prerender/prerender-aws-s3-cache

var s3 = new (require('aws-sdk')).S3({params:{Bucket: process.env.S3_BUCKET_NAME}});

module.exports = {

  requestReceived: function(req, res, next) {
    if(req.method !== 'GET') {
      return next();
    }

    var options = {
      key: req.prerender.url
    };

    if (process.env.S3_PREFIX_KEY) {
      options.key = process.env.S3_PREFIX_KEY + '/' + options.key;
    }

    if (process.env.S3_CACHE_TTL) {
      options.IfModifiedSince = (Date.now() / 1000) - (process.env.S3_CACHE_TTL * 60 * 60);
    }

    s3.getObject(options, function (err, result) {

      if (!err && result) {
        return res.send(200, result.Body);
      }

      next();
    });
  },

  pageLoaded: function(req, res, next) {
    if(req.prerender.statusCode !== 200) {
      return next();
    }

    var key = req.prerender.url;

    if (process.env.S3_PREFIX_KEY) {
      key = process.env.S3_PREFIX_KEY + '/' + key;
    }

    s3.putObject({
      Key: key,
      ContentType: 'text/html;charset=UTF-8',
      StorageClass: 'REDUCED_REDUNDANCY',
      Body: req.prerender.content
    }, function(err, result) {

      if (err) console.error(err);

      next();
    });
  }
};