const   OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: `${process.env.OKTA_CLIENT_ID}`,
  issuer: `https://${process.env.OKTA_ISSUER}/oauth2/default`,
  assertClaims: {
    aud: 'api://default',
  },
})

module.exports = (req, res, next) => {
    // require every request to have an authorization header
  if (!req.headers.authorization) {
    //return next(new Error('Authorization header is required'))
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    return next(error);
  }
  let parts = req.headers.authorization.trim().split(' ');
  let accessToken = parts.pop();
  const expectedAudience = 'api://default';
  oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience)
    .then(jwt => {
      req.user = {
        uid: jwt.claims.uid,
        email: jwt.claims.sub
      }
      next()
    })
    .catch(next) // jwt did not verify!
}