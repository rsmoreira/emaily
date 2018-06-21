const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    
    app.get('/api/surveys/thanks', (req, res) => {
        res.send('Thanks for voting!');
    });
    
    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, recipients } = req.body;

        const survey = new Survey({
            title: title,
            // On ES6, for keys and values that have the same
            // name, you can omit the value assignment, adding just 
            // the key name. It can be done for the title and body as 
            // well, but them were kept with the old format to 
            // highlight this feature on ES6.
            subject,
            body: body,
            // this line below, is the same as the line below, but with ES6
            // recipients: recipients.split(',').map(email => ({ email }))
            recipients: recipients.split(',').map(email => { return { email : email.trim() } }),
            _user: req.user.id,
            dateSent: Date.now()
        });

        try {
            const mailer = new Mailer(survey, surveyTemplate(survey));
            await mailer.send();
            await survey.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch(err) {
            res.status(422).send(err);
        }
    })
}