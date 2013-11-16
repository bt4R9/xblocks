(function(xtag, xblocks) {
    'use strict';

    var SCHEMA_REL = 'http://xblocks.ru/xb-field';

    (function(schema) {
        tv4 && tv4.addSchema(SCHEMA_REL, schema);
    })(
        /* borschik:include:schema.json */
    );

    xtag.register('xb-field', {
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
            /*schema: {
                get: function() {
                    return SCHEMA_REL;
                }
            },
             */
            defaultAttrs: {
                get: function() {
                    return {
                        'type': 'text',
                        'xb-size': 'm'
                    };
                }
            },

            styleSource: {
                get: function() {
                    return '../src/blocks/field/styl/_field.css';
                    //borschik.link('styl/_button.css')
                }
            },

            value: {
                get: function() {
                    var value;
                    xtag.query(this, 'input').forEach(function(elem) {
                        value = elem.value;
                    });

                    return value;
                },
                set: function(value) {
                    xtag.query(this, 'input').forEach(function(elem) {
                        elem.value = value;
                    });
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
                    return false;
                }

                if (xtag.hasClass(event.target, 'js-reset')) {
                    xtag.query(this, 'input').forEach(function(elem) {
                        elem.setAttribute('value', '');
                        elem.value = '';
                    });
                }

                return true;
            }
        },

        methods: {

        }
    });

})(xtag, xblocks);
