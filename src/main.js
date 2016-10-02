const defaults = {
    selectorAttr: 'data-i18n',
    targetAttr: 'i18n-target',
    optionsAttr: 'i18n-options',
    useOptionsAttr: false,
    parseDefaultValueFromContent: true
};

function init(i18next, options={}){
    options = { ...defaults, ...options };

    function parse(elem, key, opts){
        var attr = 'text';
        var extendDefault = (o, val) => options.parseDefaultValueFromContent
                                        ? { ...o, ...{ defaultValue: val } } : o;

        if(key.indexOf('[') == 0){
            var parts = key.split(']');
            key = parts[1];
            attr = parts[0].substr(1, parts[0].length - 1);
        }

        if(key.indexOf(';') == key.length -1){
            key = key.substr(0, key.length - 2);
        }

        if (attr === 'html') {
            elem.innerHTML = i18next.t(key, extendDefault(opts, elem.innerHTML));
        } else if(attr === 'text') {
            elem.textContent = i18next.t(key, extendDefault(opts, elem.textContent));
        } else if(attr === 'prepend') {
            elem.innerHTML = [i18next.t(key, extendDefault(opts, elem.innerHTML)), elem.innerHTML].join('');
        } else if(attr === 'append') {
            elem.innerHTML = [elem.innerHTML, i18next.t(key, extendDefault(opts, elem.innerHTML))].join('');
        } else if(attr.indexOf('data-') === 0) {
            let dataAttr = attr.substr('data-'.length);
            let translated = i18next.t(key, extendDefault(opts, elem.getAttribute(dataAttr)));
            // we change into the data cache
            elem.setAttribute(dataAttr, translated);
            // we change into the dom
            elem.setAttribute(attr, translated);
        } else {
            elem.setAttribute(attr, i18next.t(key, extendDefault(opts, elem.getAttribute(attr))));
        }
    };

    function _loc(elem, opts){
        var key = elem.getAttribute(options.selectorAttr);
//        if (!key && typeof key !== 'undefined' && key !== false)
//            key = elem.textContent || elem.innerHTML;
        if(!key) return;

        var target = elem,
            targetSelector = elem.getAttribute(options.targetAttr);

        if(targetSelector != null)
            target = elem.querySelector(targetSelector) || elem;

        if(!opts && options.useOptionsAttr === true)
            opts = elem.getAttribute(options.optionsAttr);

        opts = opts || {};

        if(key.indexOf(';') >= 0) {
            let keys = key.split(';');
            for(let ix=0, l_ix=keys.length; ix < l_ix; ix++){
                if(keys[ix] != '') parse(target, keys[ix], opts);
            }
        } else {
            parse(target, key, opts);
        }

        if(options.useOptionsAttr === true) {
            var clone = {};
            clone = _extends({ clone: clone }, opts);
            delete clone.lng;
            elem.setAttribute(options.optionsAttr, clone);
        }
    }

    function handle(selector, opts){
        var elems = document.querySelectorAll(selector);
        for(let i = 0; i < elems.length; i++){
            let elem = elems[i];
            let childs = elem.querySelectorAll('[' + options.selectorAttr + ']');
            for(let j = childs.length - 1; j > -1; j--){
                _loc(childs[j], opts);
            }
            _loc(elem, opts);
        }
    };
    return handle
}

export default {
    init: init,
};
