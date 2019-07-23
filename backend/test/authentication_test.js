require("dotenv").config();

const crypto = require("crypto");
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect()
const assert = chai.assert;
const app = require("../app");
chai.use(chaiHttp)



describe('User Authentication', () =>{

    // attempted authentication without any credentials.
	it('Should reject unauthorized access', function(done){
        this.timeout(0);
        chai.request(app).get('/').end(function(error, response, body){
            assert.equal(response.status, 401);
            assert.equal(response.body.errorCode, 1402);
            done();
        });
    });
    
    // attempted authentication without proper credentials.
    it('Should deny invalid authentication attempts', function(done){
        this.timeout(0);
        chai.request(app).post('/')
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('Name', "Thijmen Boot")
        .set('Signature', "bla bla bla signature")
        .set('Token', "TOKEN12345678")
        .end(function(error, response, body) {
            assert.isNotEmpty(error);
            done();
        });
    });
    
    // attempted authentication with proper credentials.
    it('Should accept valid authentication attempts', function(done){
        this.timeout(0);

        // requesting initial token.
        chai.request(app).get('/login').end(function(error, response, body) {
            name = "Thijmen Boot";
            responseToken = response.headers.token;
            signature = signToken({token: responseToken}); 

            // using token to verify the request to '/stream' 
            chai.request(app).get('/streams')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set('Name', "Thijmen Boot")
            .set('Signature', signature)
            .set('Token', responseToken)
            .end(function(error, response, body) {
                assert.equal(response.status, 200);
                done();
            });
        });
	});
});

// private key to test authentication
var test_certificate = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEApyYdM\/GSWaSyupbCk5et0Fs6nhWNG2YlJrrADVBxSYpW6956\nNC5JmFnhv47WLgbxtHJLMzLkRHNPCrWphFCqDvnY3KA21oMH02SOD4KLkEgoZl\/o\nIp3BFVD8yQRFkofCyVJOlZYZgBSNIOGOfvBDNhrFt547LNlxKZu\/LKItBroyIyh\/\ngh7EoO5K6GZYkOe4et9jJa2nUjeje+7n7bh4gfOkgcTfDvA5ZWavk1NzpwJ7KQfe\nU4\/Eyx7vVn0OkxyVZZcaxVniqecvoRZV+09oKtjSLZncfznV+NfdVD05DF6GC3u8\nz5iTwuH035I+DOQTBx2QpifAamHEfHrmo9wOjwIDAQABAoIBAHGPtZuK7vG0sjGP\nKBd6n\/7FXKf24G3TEj6j9sOU+cMLGE8cUk6NfDbkKjopY17WHPWKCYl5dBkFdphC\nIC\/jVgbivPH4cAmB8Jkw4kurWALo43nagy6xm3NOGNDB9Dq\/vhllsDp1RlH8pH3I\ngTXBKwjhW5+LA41PFlE8ncBHVuwQD6w\/qaqXz9UoUJRYKeX571tkZw\/xuS8rsC2D\nLscYxiro7FfHX7tQd1sBYBdg8aDx0HRSeci6cyYVD6iw974i0pl4V76mds4fy5pY\nnVAEj9A9c9kM1v92lKKJqul34d2ay0+dphVq9G6mBVOPUVKzT4YZf8XCioNniEQ\/\n2Ay95tECgYEA1hrZGR3iZF0OQhPlOKzPk5KikeURs5gf5R8AvlKY0dnystBRteEJ\nG7d2damfbSzfhiJHiz7+0I3Kcm4b8tLLGoq8p\/IZWVyTrer+upOC+ixshwaeAwcI\n4iAMvPyCueCylAwsaUK3adIbmG63gFyBfZMzqR\/JtmtuykpgGWuOcxsCgYEAx9sZ\nrXb7Z6FfMNqeFsKTc2EpUAmJVC+hJc\/L59eWYaFT+2H4mM6BvN+NS32J4zXqskwn\nPTPXhgUB2MkNf1Y82L3h1dkXo0w1FQjNc95dSzR+vL88nGuLe5ivc59od6otwzqa\nqzwa9UoSnEYNRggGq\/uGnLSu3+7obFi3pRjO1Z0CgYEAkiwcQbiUYp7haB17Jjld\nMkwvL1nrvuhCBkQnVsi\/Sq34sznkPz8W39ReTLB0hq3XIRVwMNHeV\/Yl2\/\/ultZx\nEXrcl\/CCe+7naBqCtFCXYENKCNlssXZxCyiEadYfTdXpNYgmHesNm3J1opkcMMd3\nJIuF\/pYUObWZGwSyHUjAJTcCgYArMwrr2eohzlnbH4ZIeSqSKBBcApOypND6cV4r\n8QfKdqrGjbjEnu6gOto51Rr3B\/KBM8DPk+MkTvTFPUAzpBpm5zRnmxNm8tQOheaT\nAx+7X899UQDy9rQhtTFHls9n\/lsB9ir0lHtnRemb6fB4kMeQaUABo3ShZuzKbqrT\nfvdGaQKBgQDBtOnuSbsAcr4ZIRI0FLWtL1Df2s79nNgDpFmddODPdOjCTNmuQQH4\n2kDJk8vIJCpBFA44hazi9lLuScOpZLF2EtIZOi8cUg9FQJM8IfmZO+1bSdmiNJcn\n9VihyKnoWSx0dAsLHi+KT5q5AAriYRJyu5RXUy2HUzxlHPNjin+VAQ==\n-----END RSA PRIVATE KEY-----';
function signToken(data) { // Functie om datas te signen
    if(!data) return false // Om te voorkomen dat alles vastloopt als de data leeg is

    console.log(test_certificate);
  
    let sign = crypto.createSign('RSA-SHA256') // De sign instantie
    sign.write(JSON.stringify(data)) // Het token wordt gesigned 
    sign.end() 
    return sign.sign(test_certificate, 'hex') // De signature wordt teruggestuurd
}
