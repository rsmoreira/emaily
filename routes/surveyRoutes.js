const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    
    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });
    
    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');
        
        _.chain(req.body)
            .map(({url, email}) => {
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return {
                        email: email, surveyId: match.surveyId, choice: match.choice
                    }
                }
            })
            .compact()
            .uniqBy('email', 'surveyId')
            .each( ({ surveyId, email, choice }) => {
                Survey.updateOne({
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email: email, responded: false }
                    }
                }, {
                    $inc: { [choice]: 1 },
                    $set: { 'recipients.$.responded': true },
                    lastResponded: new Date()
                    
                }).exec();
            })
            .value();

        res.send({});
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