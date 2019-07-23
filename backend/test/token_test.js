require("dotenv").config();

const crypto = require("crypto");
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect()
const assert = chai.assert;
const app = require("../app");
chai.use(chaiHttp)

describe('Token generation', () =>{

    // getting a token from the server.
    it('Should return a token', function(done){
        chai.request(app).get('/login').end(function(error, response, body) {
            assert.isNotEmpty(response.headers.token);
            done(); 
        });
	});
});

