const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'openstad-widgets',
  label: 'Counter',
  addFields: [
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true,
      help: 'The label shown next to the counter number.'
    },
    {
      name: 'url',
      type: 'string',
      label: 'Url',
      help: 'Optional: URL when counter is clicked.',
      required: false
    },
    {
      name: 'counterType',
      type: 'select',
      label: 'Select counter type',
      help: `The idea counter dynamically shows the number of uploaded ideas. The number for the static counter can be set by hand.`,
      choices: [
        {
          label: 'Dynamically idea counter',
          value: 'ideasCount',
        },
        {
          label: 'Static counter',
          value: 'staticCount',
          showFields: ['staticCount'],
        },
/*        {
          label: 'Vote count (not)',
          value: 'voteCount',
        },
        {
          label: 'Arguments count',
          value: 'argumentsCount',
        },
        */
      ]
    },
    {
      name: 'staticCount',
      type: 'string',
      label: 'Static counter number',
      required: false
    },
    styleSchema.definition('containerStyles', 'Styles for the container')
  ],
  construct: function(self, options) {
    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'General',
        fields: ['label', 'url', 'counterType', 'staticCount']
      },
      {
        name: 'stylinggroup',
        label: 'Styling',
        fields: ['containerStyles']
      }
    ])

    const superLoad = self.load;
    self.load = function (req, widgets, callback) {
        widgets.forEach((widget) => {
          if (widget.containerStyles) {
            const containerId = styleSchema.generateId();
            widget.containerId = containerId;
            widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }
        });

        return superLoad(req, widgets, function (err) {
            if (err) {
                return callback(err);
            }
            // `widgets` is each widget of this type being loaded on a page
            widgets.forEach(function (widget) {
                // do something cool, attach it to widget
              //  console.log('----req.data.ideas', req.data.ideas);
                widget.ideasCount = req.data.ideas ? req.data.ideas.length : 0;
            });
            return callback(null);
        });
    };



    const superOutput = self.output;
    self.output = function(widget, options) {
      var count;

  //    console.log('----idget.counterTypes', widget);


      switch(widget.counterType) {
        case 'ideasCount':
          // code block
          count = widget.ideasCount;
          break;
        case 'staticCount':
          // code block
          count = widget.staticCount;
          break;
        default:
          count = 0;
          // code block
      }

      widget.count = ('000' + count).slice(-3);
      var result = superOutput(widget, options);
      return result;
    };

    const superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
    };
  }
};
