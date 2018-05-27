
/**
 * It is a homemade middleware. 
 * A middleware has the ability to intercept requests, 
 * make some checking or update this request, before returning it 
 * or sending it to the destiny. 
 * 
 * For instance:
 *  Here we are checking if the user is logged in. 
 *  So, our middleware will intercept our request.
 *  It will check if the user is correctly logged in, and:
 * 
 *      >   if the user is not logged in, it will return it with an 
 *          appropriated error (res).
 *      >   or, if the user is logged in, it will allow the user to 
 *          continue with the request (next).
 */
module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ error: 'You must log in!' });
    }

    next();
};