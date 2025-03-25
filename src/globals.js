// global.pdf = require('html-pdf');
const {configAuthGeneral, configContractors, configHR} = require("./firebase-config");

global.path = require('path');
global.os = require('os');
global.fs = require('fs');
global.atob = require("atob");
global.Blob = require('node-blob');
global.ejs = require("ejs");
global.fetch = require('node-fetch');
const { google } = require('googleapis');
global.google = google;

global.functions = require('firebase-functions');

global.JWT_AUTH_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5G/KvZxHn+cEL\ndSfhKbGgijjhk/iAwBe9gEDGGoWr21KVwuwItjEV4F0/cTze1o2EqbVIg3FBWNsK\nX+LO3zBDG8rGntT/SgbDFftNqUq8n3pkSCPwqbWMEXfu6qm82is864oUckLSUiBJ\neOQVibzlC1+L235wpxlRoQD6gjBRkYrO3KNhhiq9BR8OQ6ROz1zuK01c0BBpK1ky\nOq0vnk1MxXAK6Fq2fCMv8rWAFBdprjome1uZGPgZ4NGQvVcJJwXoyxJhXJus9cGm\nHQ10k7Usa59j4S0LWHYgihCMqVVZo5pJaPXzB6vVBBhQtwvmEeaHGyFA/RJvlQzL\nNGI6KtsdAgMBAAECggEAC91DNkPUbXpgCaR2LGPYOzJwx+CMjnABdYdpX2kmxSeX\nCPtH1p0a00ygnWbcIGo/AtA/ysiF80rHK0iPCHRcqwh2fDmE7GHpwgpAI6+klydf\nmFrZVt0BwlsCRWFsBKs1Fz//hyT1rHZQFHV3pPvBjCqo8pVcassC/+ziW6wJfcjK\n0pGFd5+BnPfQDlXLmB3aiT9eP5ZVzPAxyF7olBI/8UKVk2na35sbBasr46nGbKFr\nADBjvngvJXa2/NeJGVtwur7gFxh6ubPfsLWspcLGcdtzV6Mxdi/9aZHsifVG/ouT\nutMMH4aF7AOl9HWJV++dbEQ6A3q/5uwaCO7dNpLtzwKBgQDqJ4+zIVQsmHn8Q5+E\nEFWOoOxXefaxayuKT1dbfZiDmw5Fq/vBu86Yr5CboAzWkjR/HcWIC2PtlFjAIGDx\nmJRuMXTK8nYFVJ8Y5FZ/J39mfrJE62A7fPm5faQbAid7ZcULAKSj93LwWkL1FGwz\niW6OmLRVbu5+ehAiiUErpCHvZwKBgQDKYQKFtbrFCeo9Q2Hp006WInfiLFA4jLPb\naBJm/zhXTLKDYZwpuezLVJUUAQUlNXZmrfBt4AxmHPVI5UCUEb1XIirdmpBMxfE4\n+n5InUHhuys3mtBJwEGwv5U7Dl+Ky7PCbFeJUQRjE4oi9Gh5/XG+JLmagNyrzwBs\nSCwwITHC2wKBgQDOsYtkyYffMd2EdEEMN8r+c0kNUukT5hFyLuVjKrQFgEsR72X1\ntw4AtAGHjrmmczsJ9sLWe4+DOc86EZrhyRlFSDzbpTnPLMqgE3fTGI+abz54Hfo9\nqO1b8u94s+ccQ1KziqbK4nTAfDzc0GFPAQLptxyAycKXPLKfed9gYatfAwKBgCEc\n3E/KW0PQCn55nvSmOU6BV0IvY/TMuMTmc1Rc3/gQuYibmPSO0jq2nSnHvPLIm5XT\nUep4ZS70AAIsWHOhr2wpUAAwQPn+zSg4fB8fc98eQ8T2VKwsg9MKlb0y7dkE2WWv\nWmdCVUhsswZjHREQseKdmay49uI5nWUaLfi2BbFPAoGBALXcbBlJf10UieiML4AN\niwbI5rqNDxZHJWdczl/fiOydKfL3Na/sCmolHXw37w+MOcFoLuIFP+QrLpVRorEa\n/vXvW1B9xE2zYgZY+0d5tsnLZgr/yscjIdzd2G9UCsJRd+259OPMPe1ykyjkrvBg\n6L3wnhU1oPNaGOk0h+onhfbp\n-----END PRIVATE KEY-----\n";
global.JWT_DEFAULT_SERVICE_ACCOUNT = "sheqsolve@appspot.gserviceaccount.com";

global.JWT_AUTH_KEY_CONTRACTOR = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDoHExmQDaJt7o/\ncwW3lAk0DVZgbJ44dATIGK7IfJi0pcIzB68ttrFgLxT0ck7VKGNUlcIcl3hsBYlu\n3K29XJqbGbb7iSWRFUpSsakgdMY7RgNqQAe1UtnPeDuSDsmC/bNHksZ6tHzQSobg\nLCJujS23mpQoe+OjJlRi6MSIOU1yDChroriAWGCtdCLBO2OeLBf4nMKOKscCdz/a\n2hsMD2YFZ+JUW5x72E6Cn6Y5ZXKh69x0OYZhh1zY9B8QCyYWBWM2yEgVHAd0aNNK\nMgM/hDk9LKvwDuD/nQILCnFDf2U30MalKIG32+WGLWMq5FWyZvl3BBzetBewI5hT\njjN9vndlAgMBAAECggEATKRLddfuKjtIfHr2gE+ZWl6tDtnOxMVKbuf3jqvVoJC7\nNy5qYaXZm/Dv8mdsMGZNpjhtCBPb549MehbUJ5rUUjKDgTsf9HAbQoL3XYgxjJDp\nv8O0x+K7mQ4SXYAUefRbpl6Iuyutqvlw38Sy+d4UInQgR93gpJabdq11d6W0NNu9\n30tlJi9cFK36HoybaOqL1DIgZOqzB8J1RmbxpFfMG4OwJ+EoQsJf88Tzt0s5KNKY\nFSnKfowZWGviylq46sr5Jk6Mq72qV1sf8dIAVaDDJBnAO5u8IKgs8JlKmHMf6prr\nchpe0aU0somoTedfkUoohlwfuZM1Ilwnmhm5+xeDYQKBgQD2hVAQbuaQmZL9KH7c\n5POr1V1pv7eH8ux5sPj/Fyq4qO+63ZamwE2LO5lmluU/RDO4lJS1YzSmDohRAE+Q\nO6RCqely1CRyFLgwd/8Ir1TlcCkNyM7xnoPhZfphITYlEz4J9NirnwUA+dPzduDb\n6vPKqSrY9UUkMduDT5R1uYJ6JwKBgQDxCSKfJ0DDQOdQCUcmaOVF0tP4qfoz9XOH\nH5u85k0/ooFKcDlFLvibdMWdqACfBJ57awaVRZpzu4A1hfeMUud3+2m6ic/biXS8\nydkLsoarqdhQ9Wwihv9p+zSmlxkrWVk4Ikih/22sVds/iW35oRm6G34maVn02NYc\n5CkzuZ31kwKBgQDQfdFIBLNFSk1RhGU+5vfatRpK7JUJCn/LL8x22Z4NDPurW+sk\n3nD2t5I2fJooFsNzcV4PxnZpltLdRtkDkB2NL+y7bAXi4fkhLOtp6fdwEJr4CIRV\nPw4knD3U1eTYGF0YyJZTF6uAtsn2F+12sVA8bzRIx68RPIV9mdlic2GRcwKBgQDj\nsUKAX99A003vgGQy94Il/Gv7Ce7uKF7S9Vv0DQZKJ6PFAtBG94EnsR6AuNSlYwKn\nCco1NoQZ8bTCWuQnLaW05M3Sxh6Rf37EXFTpROMMxKwwhjZ5Q1eB8SiiejfviD7M\n1S4Rwi4DTzOHCLbXyoR4F0KK3Jh6wF86+ZmmYCDEewKBgBP6tzqxdrsnXwAo6dxf\nQXlXfM4FSKBaByw/cP0T7WsGB3jO9gFAcUsjjY7hZH3PUnXGtE36WfDYl2QerWvi\nfOGoLvu8FLOdbzqC5dHbzboWnq79UqioujYUBrK75VZ4rR7BViXg+dpCxhoxkbDb\nyj/2+9ZlIxkWS3NUvZw4LxHb\n-----END PRIVATE KEY-----\n";
global.JWT_DEFAULT_SERVICE_ACCOUNT_CONTRACTOR = "sheqassist-8e36a@appspot.gserviceaccount.com";

global.JWT_AUTH_KEY_EMPLOYEE = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzHgB/IVaNk5aX\nufSD/4J7AGcDSCPWVplgc+kxLIy+hXJmTtX8H03HtTKPV609ATNCSBO6iJU1KulS\nurjX9c6Dj8aE8tNkqfVANV5CH0EdAlDXsV3LMBHZO4iORZ3dvBPAReOvGP1HyGPW\nofK9VptOrIKVSQBKGy2mGi+R6HScXHyt0t7bKi3FurzqpwJwwZ4V6zpuIqMfsqGW\nl7fOAvxcCO/KoGA2zjxHQUDEb23BUsdaZoyTR2hwzuJ1DutqIr6OCcC/qnmIR7nq\nSNMxZXYtmKT0b8gqdfwZ+/Qou/9oTLEvR92sRpb75weMuQD+Dsz40h0qLGcLHddZ\nyznBdZqHAgMBAAECggEAP+bjPHfTXj0aS9Uu0+zTSziwh640AuLwY0XXGxEOwWXw\nk2lq1EECyc3uVM9t4cbM18fJKhJSUR6XEUnGal2qqKshowrSuiYcdiTUFPj7jPLn\njpwbn0LuCzc/F6rkkFfqH/2PJkffDL4ESG2MoVoFnILVL5dUwBuEJK9Q61goSiPn\nZuwxbTXJVuxSsT5q92S9dIiWJ+1SZajxxkFzckuqjI/w1zxAvkI+C3JtXj/fjFzc\nGZRzTSDST1zxdbKwb+rY15wbvcIS7YeoUS816ij63z0bzDdYLbR+HdyBj7LFar+b\nbDtJjzT1H+Oq5qQGmH7ohI+rt7kdOvCbZa1XFKbUoQKBgQDrh9kRRhevWdRfSZrM\nnnfnSyg1hiPBeJ/16ZANQswaeeeExHbx5cGrZo0T6sR0+a/2LJrDj0Fie2ekJxDI\n20MhgktmDML9eRme87VFWIdmNqw63zEIA3gFJatPaLx1T1UV24p+1/WYJ/WLMna4\nT2twY0ooO7Yod8gpTgEZ0OO0MQKBgQDCrw0wpR8JEpeRzl1Z92L2108YCiErnR3S\nrJyFnYq4lLnsUdGeo+D/DPRqVTFJQLpoQpqrRZAyFNA5lB6sk0ho2MEcD4vYKsmH\nZ4g1tADK3NUEDltKXJz61l+bNgweX/5WqtTslNmXn6y9KBzvH8Tua6NN8WuDzkwS\n59uMIKMkNwKBgEjZ4RNNud+8Ckta6e2minHZNluv3PlnxRp8HtlrMtRxpmHTnvLd\nXRUWCEcD07ZW0M11KH2ant/GSd1lU/S8lTwVIBs1kU5zmbAns4b6hg7glE81X+YZ\npJL6/sz2GWyzmB7FpEXtqIJiwblHZ59EuXeuzm45YfOMcTYNcZu5l+TRAoGAbDmD\ny5b/ObvsJlHh8zFjAnWOsn5vEh+1hHgQSvbZNuL2uDiDnvzbBu3csX/Kdj5VYcAk\n2zFAh5aqale89ZKqnh5gu4io5PJkNbGINtJp3lwEzsxsU1pIqeiiHVZeRkR2zxcI\nZrwYegF5tW2nKAcxIpkTnzCl5A+6mofptGwwROECgYBL0v2fg2efV6y1SOpMwZy2\nVEH6/tu/cMiyUJmM4CkDKWsneuD1Vd5SGc2Q99CO56AqZGI+LOOCZkrEfQMu82Dg\nkjYlPx8CPev//xsE2ZNrzAAW6gEwPdwfc+nTift8jldJKHyFxfcMqNlXvX++XpDc\n5/+qRfQajYAXp22M7S93Ng==\n-----END PRIVATE KEY-----\n";
global.JWT_DEFAULT_SERVICE_ACCOUNT_EMPLOYEE = "sheqaid-hr@appspot.gserviceaccount.com";

global.DEFAULT_BUCKET = 'sheqsolve.appspot.com';

global.isProduction = process.env.ENVIRONMENT === 'production';
global.isDevelopment = !isProduction;

//

global.admin = require('firebase-admin');
admin.initializeApp();
global.adminAuthGeneral = admin.initializeApp(configAuthGeneral, 'adminAuthGeneral');

global.adminContractors = admin.initializeApp(configContractors, 'adminContractors');
global.adminContractorsAuthGeneral = admin.initializeApp(configContractors, 'adminContractorsAuthGeneral');
// console.log('adminContractors', adminContractors)

global.adminHR = admin.initializeApp(configHR, 'adminHR');
global.adminHRAuthGeneral = admin.initializeApp(configHR, 'adminHRAuthGeneral');

const { Storage } = require("@google-cloud/storage");
global.adminStorage = new Storage({
	keyFilename: path.join(__dirname, "./firebase/service-account.json"),
	projectId: "sheqsolve",
});

require('./libs/objects.util');
require('./libs/date-utils');
global.EmailUtils = require('./libs/email.util');
global.SendEmailUtils = require('./libs/send.email.util.js');
global.DriveUtils = require('./libs/drive.utils');
global.DeepSeek = require('./ai/deepseek');

require('./libs/funs_impl');
require('./libs/graphql_impl');
require('./libs/auth_impl');
require('./libs/files_impl');
require('./libs/face.util');
require('./libs/users.utils.js');
require('./graphql/convertMutations');
