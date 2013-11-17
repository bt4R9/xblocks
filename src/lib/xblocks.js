(function() {
    'use strict';

    var xblocks = {};

    var namespace;

    if (typeof module !== 'undefined') {
        namespace = module.exports = xblocks;
    } else {
        namespace = (function() {
            return this || (1, eval)('this');
        }());
    }

    namespace.xblocks = xblocks;


    xblocks.log = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[xblocks]');
        console.log.apply(console, args);
    };


    var __options = {
        inlineStyle: Modernizr.stylescoped || Modernizr.createshadowroot
    };

    xblocks.option = function(name, value) {
        if (typeof value === 'undefined') {
            if (typeof name === 'string') {
                return __options[name];
            }

        } else {
            if (typeof name === 'string') {
                return __options[name] = value;
            }
        }

        return undefined;
    };


    xblocks.isEmptyAttr = function(element, attrName) {
        if (element.hasAttribute(attrName)) {
            var value = element.getAttribute(attrName);
            if (!value || value === 'false') {
                return true;
            }

            return false;
        }

        return true;
    };


    xblocks.attrs2obj = function(element, def) {
        var out = {};
        for (var i = 0, attrs = element.attributes, l = attrs.length; i < l; i++) {
            var attr = attrs.item(i);
            if (attr.value === 'true' || attr.value === 'false' || attr.nodeName === attr.value) {
                if (attr.nodeName === attr.value || attr.value === 'true') {
                    out[attr.nodeName] = true;

                } else {
                    out[attr.nodeName] = false;
                }

            } else {
                out[attr.nodeName] = attr.value;
            }
        }

        if (def) {
            for (var name in def) {
                if (!out.hasOwnProperty(name)) {
                    out[name] = def[name];
                }
            }
        }

        return out;
    };


    xblocks.rootElement = function(element) {
        if (Modernizr.createshadowroot) {
            return element.shadowRoot;
        }

        return element;
    };


    xblocks.elementHTML = function(element, html) {
        if (typeof html !== 'undefined') {
            element.innerHTML = html;

            if (!Modernizr.createshadowroot) {
                xblocks.elementUpdate(element);
            }
        }

        var content;
        if (!Modernizr.createshadowroot) {
            content = element.querySelector('content');
        }

        return content && content.innerHTML || element.innerHTML;
    };


    xblocks.elementUpdate = function(element, onupdate) {
        xblocks.log('elementUpdate', element);

        element.observer.off();

        var isInlineStyle = element.styleSource && xblocks.option('inlineStyle');
        var tagName = element.tagName.toLowerCase();
        var data = {
            attrs: xblocks.attrs2obj(element, element.defaultAttrs || {}),
            content: null
        };

        if (!Modernizr.createshadowroot) {
            data.content = xblocks.elementHTML(element);
        }

        if (tv4 && element.schema) {
            var schema = tv4.getSchema(element.schema);
            var check = tv4.validateResult(data, schema);

            if (!check.valid) {
                throw check.error;
            }
        }

        var html = yr.run(tagName, data, 'template');
        var template = xtag.createFragment(html);

        if (isInlineStyle) {
            var css = '@import url(' + element.styleSource + ');';
            var style = document.createElement('style');

            style.setAttribute('type', 'text/css');
            style.setAttribute('scoped', 'scoped');

            if (style.styleSheet) {
                style.styleSheet.cssText = css;

            } else {
                style.appendChild(document.createTextNode(css));
            }

            template.insertBefore(style, template.firstChild);
        }

        var root;
        if (Modernizr.createshadowroot) {
            root = element.shadowRoot;
            if (!root) {
                root = element.createShadowRoot();
                root.resetStyleInheritance = !isInlineStyle;
                root.applyAuthorStyles = !isInlineStyle;
            }

        } else {
            root = element;
        }

        xtag.innerHTML(root, '');
        root.appendChild(template.cloneNode(true));

        element.observer.on();

        if (onupdate) {
            onupdate(element);
        }
    };


}());
