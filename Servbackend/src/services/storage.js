const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

let bucket = null;

function init(db) {
  if (!db) throw new Error('db required to init storage');
  bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'files' });
}

async function uploadFromPath(localPath, filename, contentType = 'application/octet-stream') {
  if (!bucket) throw new Error('storage not initialised');
  const read = fs.createReadStream(localPath);
  const uploadStream = bucket.openUploadStream(filename, { contentType });
  return new Promise((resolve, reject) => {
    read.pipe(uploadStream)
      .on('error', reject)
      .on('finish', (file) => {
        resolve(file._id.toString());
      });
  });
}

async function uploadFromBuffer(buffer, filename, contentType = 'application/octet-stream') {
  if (!bucket) throw new Error('storage not initialised');
  const uploadStream = bucket.openUploadStream(filename, { contentType });
  return new Promise((resolve, reject) => {
    uploadStream.end(buffer, (err, file) => {
      if (err) return reject(err);
      resolve(file._id.toString());
    });
  });
}

function getFileStream(id) {
  if (!bucket) throw new Error('storage not initialised');
  try {
    const _id = new ObjectId(id);
    return bucket.openDownloadStream(_id);
  } catch (err) {
    throw new Error('Invalid file id');
  }
}

async function getFileInfo(id) {
  if (!bucket) throw new Error('storage not initialised');
  const filesColl = bucket.s.db.collection(bucket.s.bucketName + '.files');
  const doc = await filesColl.findOne({ _id: new ObjectId(id) });
  return doc;
}

module.exports = { init, uploadFromPath, uploadFromBuffer, getFileStream, getFileInfo };
