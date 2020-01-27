const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Arguments',
  addFields: [
    {
      name: 'ideaId',
      type: 'string',
      label: 'Idea ID (if empty it will try to fetch the ideaId from the URL)',
    },
    {
      name: 'emptyPlaceholder',
      type: 'string',
      label: 'Placeholder text',
      help: 'Will be shown in case there are no arguments yet.',
      required: true
    },
    {
      name: 'replyingEnabled',
      type: 'boolean',
      label: 'Is replying to arguments allowed?',
      def: true,
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
    },
    {
      name: 'votingEnabled',
      type: 'boolean',
      label: 'Is voting for arguments allowed?',
      def: true,
      choices: [
          {
              value: true,
              label: "Yes"
          },
          {
              value: false,
              label: "No"
          },
      ]
    },
    {
      name: 'argumentSentiment',
      type: 'select',
      label: 'Argument sentiment',
      help: `Select the sentiment when the 'in favor' and 'against' arguments are separately listed. Otherwise, choose 'No sentiment'.`,
      def: '',
      choices: [
        {
          label: 'No sentiment',
          value: '',
        },
        {
          label: 'In favor',
          value: 'for',
        },
        {
          label: 'Against',
          value: 'against',
        },
      ]
    },
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'General',
        fields: ['emptyPlaceholder', 'argumentSentiment']

      },
      {
        name: 'advanced',
        label: 'Advanced',
        fields: ['replyingEnabled', 'votingEnabled', 'ideaId']
      }
    ])

     const superPushAssets = self.pushAssets;
     //const auth = "Basic " + new Buffer("xxx:xxx#").toString("base64");

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('script', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

     var superOutput = self.output;
     self.output = function(widget, options) {
       return superOutput(widget, options);
  //     return result;
     };
   }
};
