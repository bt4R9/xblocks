(function(xtag, xblocks) {
    'use strict';

    var SCHEMA_REL = 'http://xblocks.ru/xb-link';

    (function(schema) {
        tv4 && tv4.addSchema(SCHEMA_REL, schema);
    })(/* borschik:include:schema.json */);



    xtag.register('xb-link', {
        lifecycle: {
            created: function() {
                this.observer.on();

                xblocks.elementUpdate(this);
            },
            inserted: function() {
            },
            removed: function() {
                this.observer.remove();
            },
            attributeChanged: function() {
                xblocks.elementUpdate(this);
            }
        },

        accessors: {
            schema: {
                get: function() {
                    return SCHEMA_REL;
                }
            },

            defaultAttrs: {
                get: function() {
                    return {
                        'theme': 'normal',
                        'size': 'm'
                    };
                }
            },

            styleSource: {
                get: function() {
                    return borschik.link('@link.css');
                }
            },

            value: {
                get: function() {
                    return xblocks.elementHTML(this);
                },
                set: function(value) {
                    xblocks.elementHTML(this, value);
                }
            },

            observer: {
                get: function() {
                    var that = this;
                    var observer;

                    if (!Modernizr.createshadowroot) {
                        observer = that.__observer || (that.__observer = new MutationObserver(function() {
                            xblocks.elementUpdate(that);
                        }));
                    }

                    return {
                        on: function() {
                            observer && observer.observe(that, {
                                childList: true,
                                subtree: true,
                                characterData: true
                            });
                        },

                        off: function() {
                            observer && observer.disconnect();
                        },

                        remove: function() {
                            observer && observer.disconnect();
                            delete that.__observer;
                        }
                    };
                }
            }
        },

        events: {
            click: function(event) {
                if (this.hasAttribute('disabled')) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },

        methods: {

        }
    });

})(xtag, xblocks);
