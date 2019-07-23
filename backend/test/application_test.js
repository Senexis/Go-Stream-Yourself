const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect()
const app = require("../app");
const assert = chai.assert;

chai.use(chaiHttp)

var mongoose = null;

describe('Application is running...', () =>{

	// check if the server is running.
	it('Should be running', function(done){
        chai.request(app).get('/').end(function(error, response, body){
            assert.isNotEmpty(response);
            done();
        });
	});
});