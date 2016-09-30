/* global it describe before after */

const assert = require('assert');
const path = require('path');
const request = require('request');
const binstaface = require('../lib');

describe('my app test', function appTests() {
  const PORT = 4455;

  let server;

  // Create a request instance with defaults
  const req = request.defaults({
    baseUrl: `http://localhost:${PORT}/messages`,
    json: true,
  });

  before(function beforeTests(done) {
    server = binstaface(path.join(__dirname, '..'))
      .listen(PORT, () => {
        req({
          url: '/',
          method: 'post',
          body: { message: 'A test message' },
        }, error => done(error));
      });
  });

  after(function afterTests(done) {
    server.close(() => done());
  });

  describe('messages service', function messageService() {
    it('GET / lists all messages', function getAllMessages(done) {
      req('/', (error, res, body) => {
        assert.deepEqual(body, [{
          id: 1,
          message: 'A test message',
        }]);
        done(error);
      });
    });
    it('GET /:id returns a single message', function getOneMessage(done) {
      req('/1', (error, res, body) => {
        assert.deepEqual(body, {
          id: 1,
          message: 'A test message',
        });
        done(error);
      });
    });
    it('POST / creates a new message', function createMessage(done) {
      const message = 'Created message';

      req({
        url: '/',
        method: 'post',
        body: { message },
      }, (error, res, body) => {
        assert.deepEqual(body, { id: 2, message });
        done(error);
      });
    });

    it('PUT /:id extends a message', function updateMessage(done) {
      req({
        url: '/1',
        method: 'put',
        body: { message: 'New message' },
      }, (error, res, body) => {
        assert.deepEqual(body, {
          id: 1,
          message: 'New message',
        });
        done(error);
      });
    });

    it('DELETE /:id removes a message', function deleteMessage(done) {
      req({
        url: '/1',
        method: 'delete',
      }, (err, res) => {
        if (err) {
          return done(err);
        }
        assert.equal(res.statusCode, 204);

        req('/', (error, response, bod) => {
          assert.equal(bod.length, 1, 'Only one message left');
          done(error);
        });
        return this;
      });
    });
  });
});
