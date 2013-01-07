function Util() {}

Util.getSubObjByPropAndValue = function(obj, subObjProp, subObjVal) {
    var pos;

    pos = Util.findSubObjPosByPropAndValue(obj, subObjProp, subObjVal);
    return pos > -1 && pos < obj.length ? obj[pos] : null;
};

Util.findSubObjPosByPropAndValue = function(obj, subObjProp, subObjVal) {
    var pos = -1;
    for (var i = 0; obj && i < obj.length; i++) {
        if (obj[i] && obj[i][subObjProp] === subObjVal) {
            pos = i;
            break;
        }
    }
    return pos;
};

Util.deleteSubObjByPropAndValue = function(obj, subObjProp, subObjVal) {
    var pos = Util.findSubObjPosByPropAndValue(obj, subObjProp, subObjVal);
    if (pos > -1) {
        obj.splice(pos, 1);
        return true;
    }
    else {
        return false;
    }
};

Util.ajaxCounterInc = function() {
    if (!jQuery.active++) {
        jQuery.event.trigger("ajaxStart");
    }
};

Util.ajaxCounterDec = function() {
    if (!--jQuery.active) {
        jQuery.event.trigger("ajaxStop");
    }
};

Util.random = function(whole) {
    var number = whole ? Number(Math.random().toString().replace(".", "")) : Math.random();
    var d = new Date();
    number += d.getFullYear() + d.getMonth() + d.getDate();
    return number;
};

Util.isArray = function(o) {
    return Object.prototype.toString.call(o) == "[object Array]";
};

// Array Remove - By John Resig (MIT Licensed)
Util.removeFromArray = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

Util.callOut = function(el, messages) {
    var offset,
        height,
        outerWidth,
        ul,
        i,
        li;

    ul = document.createElement("ul");
    ul.innerHTML = "";
    for (i = 0; i < messages.length; i++) {
        li = document.createElement("li");
        li.appendChild(document.createTextNode(messages[i]));
        ul.appendChild(li);
    }

    offset     = jQuery(el).offset();
    height     = jQuery(el).outerHeight();
    outerWidth = jQuery(el).outerWidth()-4;

    jQuery(ul).css("top", (offset.top + height - 4) + "px")
        .css("left", offset.left + 4 + "px")
        .css("width", outerWidth + "px")
        .addClass("callOut");

    el.parentNode.appendChild(ul);
};

Util.getLonZones = function() {
    var i,
        a;

    a = [];

    for (i = 1; i < 61; i++) {
        a.push(i.toString());
    }

    return a;
};

Util.getLatZones = function() {
    return ["C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X"];
};

Util.getHemispheres = function() {
    return ["N", "S"];
};

Util.loadCss = function() {
    var url,
        callback,
        link;

    callback = arguments[arguments.length-1];

    if (arguments.length === 1) {
        callback();
    }
    else {
        url = [].shift.call(arguments);
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
        this.loadCss.apply(this, arguments);
    }
};

Util.loadLanguageFile = function(_readyCallback, _lang, _optionalDomain) {
    var resources,
        url;

    resources = {
        "EN_US": "/static/js/map/translations/EN_US.js",
        "ES_LA": "/static/js/map/translations/ES_LA.js",
        "FR_FR": "/static/js/map/translations/FR_FR.js"
    };

    _lang = _lang || "EN_US";

    url = _optionalDomain ? _optionalDomain + resources[_lang] : resources[_lang];

    head.js(url, _readyCallback);
};

Util.handleError = function(errorText) {
    alert(errorText);
    throw(errorText);
};

Util.getFormValueTyped = function(value) {
    var ret;

    // parseInt("123hui") : returns 123
    // Number("123hui")   : returns NaN
    // parseInt(" ")      : returns NaN
    // Number(" ")        : returns 0

    if (value !== "" && !isNaN(Number(value)) && !isNaN(parseInt(value, 10))) {
        // number
        if (value.indexOf(".") > -1) {
            ret = parseFloat(value);
        }
        else {
            ret = parseInt(value, 10);
        }
    }
    else {
        // string
        ret = value;
    }

    return ret;
};

Util.copyFormInputValuesToObject = function(form, object) {
    for (var i = 0, len = form.elements.length; i < len; i++) {
        if (!form.elements[i].name || form.elements[i].nodeName.toLowerCase() === "fieldset") {
            // no op
        }
        else if (form.elements[i].type === "radio" || form.elements[i].type === "checkbox") {
            if (form.elements[i].checked) {
                object[form.elements[i].name] = form.elements[i].value;
            }
        }
        else {
            object[form.elements[i].name] = form.elements[i].value;
        }
    }
};

Util.convertDMStoDD = function(dir, deg, min, sec) {
    if (dir === "S" || dir === "W") {
        deg = -deg;
        min = -min;
        sec = -sec;
    }

    deg = deg + min/60 + sec/3600;

    return deg;
};

Util.convertDDtoDMS = function(decimal, optionalMaxDecimalPlaces) {
    var deg,
        min,
        sec;

    decimal = Math.abs( Math.round(decimal * 1000000000.0));

    deg = Math.floor(decimal/1000000000);
    min = Math.floor(((decimal/1000000000)-deg)*60);
    sec = Math.floor(((((decimal/1000000000)-Math.floor(decimal/1000000000))*60)-min)*100000000)*60/100000000;
    if (optionalMaxDecimalPlaces) {
        sec = Number(sec.toFixed(optionalMaxDecimalPlaces));
    }
    return (deg+"°"+min+"'"+sec+'"');
};

Util.convertLatLngToUtm = function(latitude, longitude, optionalMaxDecimalPlaces) {
    var utm;

    utm = new UTM(latitude, longitude);
    return {
        "northing": utm.northing.toFixed(optionalMaxDecimalPlaces).toString(),
        "easting" : utm.easting.toFixed(optionalMaxDecimalPlaces).toString(),
        "lngZone" : utm.lngZone,
        "hemisphere" : utm.hemisphere
    };
};

Util.getValueSafe = function(o, key, optionalDefault) {
    var ret;

    if (o && o[key]) {
        ret = o[key];
    }
    else if (optionalDefault) {
        ret = optionalDefault;
    }
    else {
        ret = null;
    }

    return ret;
};

Util.supplant = function (str, o) {
    // lifted from http://javascript.crockford.com/remedial.html
    return str.replace(/\{([^{}]*)\}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : typeof r === 'boolean' ? r.toString() : a;
        }
    );
};

function Validate() {}

Validate._isNumber = function(number) {
    return !isNaN(parseFloat(number)) && isFinite(number);
};

Validate.isValidLatitude = function(number) {
    var fullResult,
        result,
        i;

    fullResult = {
        valid: true,
        messages: []
    };

    result = Validate.isWithinRange(number, -85, 85, sMap.get("core_latitude"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    return result;
};

Validate.isValidLongitude = function(number) {
    var fullResult,
        result,
        i;

    fullResult = {
        valid: true,
        messages: []
    };

    if (!Validate._isNumber(number)) {
        fullResult.valid = false;
        fullResult.messages.push(sMap.get("error_numbers_only", {
            label: sMap.get("longitude")
        }));
    }

    result = Validate.isWithinRange(number, -180, 180, sMap.get("longitude"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    return result;
};

Validate.isWholePositiveNumber = function(number, label) {
    var result,
        intRegex;

    intRegex = /^\d+$/;

    result = {
        valid: true,
        messages: []
    };

    if (!intRegex.test(number)) {
        result.messages.push(sMap.get("error_whole_numbers_only", {
            label: label
        }));
        result.valid = false;
    }

    return result;
};

Validate.isWithinRange = function(number, start, end, label) {
    var result;

    result = {
        valid: true,
        messages: []
    };

    if (!Validate._isNumber(number)) {
        result.messages.push(sMap.get("error_numbers_only", {
            label: label
        }));
        result.valid = false;
    }

    if (number < start || number > end) {
        result.messages.push(sMap.get("error_out_of_range", {
            start: start,
            end: end,
            label: label
        }));
        result.valid = false;
    }

    return result;
};

Validate.isValidSecond = function(second) {
    var fullResult,
        result,
        i;

    fullResult = {
        valid: true,
        messages: []
    };

    result = Validate.isWholePositiveNumber(second, sMap.get("second"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    result = Validate.isWithinRange(second, 0, 60, sMap.get("second"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    return result;
};

Validate.isValidMinute = function(minute) {
    var fullResult,
        result,
        i;

    fullResult = {
        valid: true,
        messages: []
    };

    result = Validate.isWholePositiveNumber(minute, sMap.get("minute"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    result = Validate.isWithinRange(minute, 0, 60, sMap.get("minute"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    return result;
};

Validate.isValidLatitudeDegree = function(degree) {
    var fullResult,
        result,
        i;

    fullResult = {
        valid: true,
        messages: []
    };

    result = Validate.isWholePositiveNumber(degree, sMap.get("degree"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    result = Validate.isWithinRange(degree, -80, 80, sMap.get("degree"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    return result;
};

Validate.isValidLongitudeDegree = function(degree) {
    var fullResult,
        result,
        i;

    fullResult = {
        valid: true,
        messages: []
    };

    result = Validate.isWholePositiveNumber(degree, sMap.get("degree"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    result = Validate.isWithinRange(degree, 0, 180, sMap.get("degree"));
    if (!result.valid) {
        fullResult.valid = false;
        for (i = 0; i < result.messages.length; i++) {
            fullResult.messages.push(result.messages[i]);
        }
    }

    return result;
};

Validate.isValidNorthing = function(northing) {
    return Validate.isWithinRange(northing, 0, 10000000, sMap.get("northing"));
};

Validate.isValidEasting = function(easting) {
    return Validate.isWithinRange(easting, 160000, 834000, sMap.get("easting"));
};

Validate.isValidHemisphere = function(hemisphere) {
    var result;

    result = {
        valid: true,
        messages: []
    };

    result.valid = jQuery.inArray(hemisphere, Util.getHemispheres()) !== -1;

    if (result.valid === false) {
        result.messages.push(sMap.get("error_select_latitude_zone"));
    }

    return result;
};

Validate.isValidLonZone = function(zone) {
    var result;

    result = {
        valid: true,
        messages: []
    };

    result.valid = jQuery.inArray(zone, Util.getLonZones()) !== -1;

    if (result.valid === false) {
        result.messages.push(sMap.get("error_select_longitude_zone"));
    }

    return result;
};

var SelectBuilder = function(inputName, useSmallText) {
    var self,
        selectedOption,
        options,
        label,
        postSyncCallback,
        preSyncCallback,
        wrapper,
        button;

    self    = {};
    options = [];

    self.label = function(l) {
        label = l;
        return self;
    };

    self.setSelectedValue = function(value) {
        var i;

        if (options.length < 1) {
            throw("SelectBuilder.setSelectedValue: need to add options before setting a selected value");
        }

        for (i = 0; i < options.length; i++) {
            if (value && options[i].value === value.toString()) {
                options[i].selected = true;
                selectedOption = options[i];
                break;
            }
        }

        return self;
    };

    self.setPreSyncCallback = function(fx) {
        preSyncCallback = fx;
        return self;
    };

    self.setPostSyncCallback = function(fx) {
        postSyncCallback = fx;
        return self;
    };

    self.addOption = function(value, label, selected) {
        var option;

        option = {
            value: value,
            label: label,
            selected: selected
        };
        options.push(option);
        selectedOption = selected ? option : selectedOption;

        return self;
    };

    self.build = function(buttonDisabled, optionalId, optionalClassNames) {
        var buttonLabel,
            synchedInput,
            hidden,
            ul,
            li,
            a,
            i,
            menuIsOpen;

        function toggleMenu(e) {
            var offset,
                height,
                outerWidth;

            if (e.clientX > 0 && e.clientY > 0) {
                if (!toggleMenu.ranOnce) {
                    offset     = jQuery(this).offset();
                    height     = jQuery(this).height();
                    outerWidth = jQuery(this).outerWidth();

                    jQuery(ul).css("top", (offset.top + height) + "px")
                        .css("left", offset.left + "px")
                        .css("width", outerWidth + "px");

                    toggleMenu.ranOnce = true;
                }

                if (menuIsOpen) {
                    jQuery(ul).slideUp('fast');
                }
                else {
                    jQuery(ul).slideDown('medium');
                }

                menuIsOpen = !menuIsOpen;
                e.preventDefault();
            }
        }

        function setSelected(a) {
            jQuery(ul).find("a").removeClass("selected");
            jQuery(a).addClass("selected");
        }

        self.build.buttonDisabled = buttonDisabled || self.build.buttonDisabled;
        self.build.optionalId     = optionalId || self.build.optionalId;
        menuIsOpen                = false;

        if (!label && !selectedOption) {
            selectedOption = options[0];
        }

        wrapper        = document.createElement("div");
        button         = document.createElement("a");
        synchedInput   = document.createElement("input");
        ul             = document.createElement("ul");
        button.href    = "redirect";
        button.onclick = function() { return false; };

        wrapper.id         = self.build.optionalId || wrapper.id;
        synchedInput.type  = "hidden";
        synchedInput.name  = inputName;
        synchedInput.value = (selectedOption && selectedOption.value) ? selectedOption.value : null;

        for (i = 0; i < options.length; i++) {
            li     = document.createElement("li");
            a      = document.createElement("a");
            hidden = document.createElement("input");

            a.href           = ".";
            a.title          = options[i].label;
            a.className      = selectedOption && selectedOption.value === options[i].value ? "selected" : "";
            hidden.type      = "hidden";
            hidden.value     = options[i].value;
            hidden.className = "ignore";

            a.appendChild(document.createTextNode(options[i].label));

            li.appendChild(a);
            li.appendChild(hidden);
            ul.appendChild(li);
        }

        buttonLabel = selectedOption && selectedOption.label ? selectedOption.label : label;

        jQuery(button).button({disabled: self.build.buttonDisabled, label: buttonLabel})
            .addClass("fake-select")
            .bind("mousedown", toggleMenu);

        jQuery(wrapper).append(button)
            .append(synchedInput).append(ul)
            .addClass("fake-select-wrapper")
            .addClass(optionalClassNames)
            .addClass(useSmallText ? "small" : null);

        jQuery(ul).click(function(e) {
            var tgt,
                label,
                value,
                stopExecution;

            tgt   = e.target;
            label = jQuery(tgt).text();
            value = Util.getFormValueTyped(jQuery(tgt).next().val());

            if (preSyncCallback) {
                stopExecution = preSyncCallback(value, label);
                if (stopExecution === true) {
                    jQuery(ul).fadeOut('fast');
                    menuIsOpen = false;
                }
            }

            if (!stopExecution) {
                if (tgt.nodeName.toLowerCase() === "a") {
                    synchedInput.value = value;
                    jQuery(button).button("option", "label", label);
                    jQuery(ul).fadeOut('fast');
                    setSelected(tgt);
                    menuIsOpen = false;
                }

                if (postSyncCallback) {
                    postSyncCallback(value, label);
                }
            }

            e.preventDefault();
        });

        self.removeDomElements = function() {
            jQuery(wrapper).remove();
        };

        self.getRootEl = function() {
            return wrapper;
        };

        self.getValue = function() {
            return jQuery(synchedInput).val();
        };

        return wrapper;
    };

    self.rebuild = function() {
        if (!self.removeDomElements) {
            Util.handleError("Error: can't call rebuild until you've built at least once");
        }
        else {
            self.removeDomElements();
            return self.build();
        }
    };

    self.getButtonEl = function() {
        return button;
    };

    return self;
};

var FormBuilder = function(classNames) {
    var self,
        fields,
        dispatch,
        formEl;

    self   = {};
    fields = [];

    dispatch = {
        "degree": function(field) {
            var li,
                label,
                text,
                wrapper_degree,
                wrapper_minute,
                wrapper_second,
                input_degree,
                input_minute,
                input_second,
                hint_degree,
                hint_minute,
                hint_second,
                deg_default,
                min_default,
                sec_default;

            li             = document.createElement("li");
            label          = document.createElement("label");
            text           = document.createTextNode(field.label);
            wrapper_degree = document.createElement("div");
            wrapper_minute = document.createElement("div");
            wrapper_second = document.createElement("div");
            input_degree   = document.createElement("input");
            input_minute   = document.createElement("input");
            input_second   = document.createElement("input");
            hint_degree    = document.createElement("span");
            hint_minute    = document.createElement("span");
            hint_second    = document.createElement("span");

            // 1°2'3"
            if (field.value) {
                deg_default    = field.value.split("°")[0];
                min_default    = field.value.split("'")[0].split("°")[1];
                sec_default    = field.value.split("'")[1].split('"')[0];
            }

            jQuery(input_degree).attr("name", field.name + "_degree").attr("type", "text").attr("maxLength", 3).val(deg_default);
            jQuery(input_minute).attr("name", field.name + "_minute").attr("type", "text").attr("maxLength", 2).val(min_default);
            jQuery(input_second).attr("name", field.name + "_second").attr("type", "text").attr("maxLength", 6).val(sec_default);

            jQuery(li).attr("className", "degree " + (field.fullWidth ? "full-width" : ""));
            jQuery(wrapper_degree).attr("className", "fake-text-wrapper degree");
            jQuery(wrapper_minute).attr("className", "fake-text-wrapper minute");
            jQuery(wrapper_second).attr("className", "fake-text-wrapper second");
            jQuery(hint_degree).attr("className", "hint symbol");
            jQuery(hint_minute).attr("className", "hint symbol");
            jQuery(hint_second).attr("className", "hint symbol");

            hint_degree.appendChild(document.createTextNode("°"));
            hint_minute.appendChild(document.createTextNode("′"));
            hint_second.appendChild(document.createTextNode("″"));

            wrapper_degree.appendChild(input_degree);
            wrapper_degree.appendChild(hint_degree);
            wrapper_minute.appendChild(input_minute);
            wrapper_minute.appendChild(hint_minute);
            wrapper_second.appendChild(input_second);
            wrapper_second.appendChild(hint_second);

            label.appendChild(text);
            li.appendChild(label);
            li.appendChild(wrapper_degree);
            li.appendChild(wrapper_minute);
            li.appendChild(wrapper_second);
            li.appendChild(field.el);

            field.origValidate = field.validate;
            field.validate = function() {
                return field.origValidate({
                    "degree":    jQuery(input_degree).val(),
                    "minute":    jQuery(input_minute).val(),
                    "second":    jQuery(input_second).val(),
                    "direction": jQuery(field.el).find("input")[0].value,
                    "degreeEl":  input_degree,
                    "minuteEl":  input_minute,
                    "secondEl":  input_second,
                    "directionEl": jQuery(field.el).find("button")
                });
            };

            return li;
        },
        "dropdown": function(field) {
            var li,
                selectWrapper,
                label,
                text;

            li            = document.createElement("li");
            selectWrapper = field.el;
            label         = document.createElement("label");
            text          = document.createTextNode(field.label);

            li.className  = "dropdown " + (field.fullWidth ? "full-width" : "");

            label.appendChild(text);
            li.appendChild(label);
            li.appendChild(selectWrapper);

            return li;
        },
        "text": function(field) {
            var li,
                inputWrapper,
                input,
                label,
                text;

            li           = document.createElement("li");
            inputWrapper = document.createElement("div");
            input        = field.el || document.createElement("input");
            label        = document.createElement("label");
            text         = document.createTextNode(field.label);

            input.type   = "text";
            input.name   = field.name;
            input.value  = field.value || input.value;
            li.className = "text " + (field.fullWidth ? "full-width" : "");
            inputWrapper.className = "fake-text-wrapper";

            label.appendChild(text);
            inputWrapper.appendChild(input);
            li.appendChild(label);
            li.appendChild(inputWrapper);

            if (field.validate) {
                field.origValidate = field.validate;
                field.validate = function() {
                    return field.origValidate({
                        "value":   jQuery(input).val(),
                        "el":      inputWrapper
                    });
                };
            }

            return li;
        },
        "utm": function(field) {
            var li,
                label,
                text,
                wrapper_x,
                wrapper_y,
                input_x,
                input_y,
                hint_x,
                hint_y,
                sb_hemisphere,
                sb_lonZone,
                sb_hemisphere_el,
                sb_lonZone_el,
                lonZones,
                hemispheres,
                i,
                len;

            li         = document.createElement("li");
            label      = document.createElement("label");
            text       = document.createTextNode(field.label);
            wrapper_x  = document.createElement("div");
            wrapper_y  = document.createElement("div");
            input_x    = document.createElement("input");
            input_y    = document.createElement("input");
            sb_hemisphere = new SelectBuilder("utm_hemisphere", true);
            sb_lonZone    = new SelectBuilder("utm_lonZone", true);
            lonZones      = Util.getLonZones();
            hemispheres   = Util.getHemispheres();

            // build the hemisphere drop down
            for (i = 0, len = hemispheres.length; i < len; i++) {
                sb_hemisphere.addOption(hemispheres[i], hemispheres[i], false);
            }

            // build the lon zone drop down
            for (i = 0, len = lonZones.length; i < len; i++) {
                sb_lonZone.addOption(lonZones[i], lonZones[i], false);
            }

            jQuery(input_x).attr("name", field.name + "_x").attr("type", "text").attr("maxLength", 12);
            jQuery(input_y).attr("name", field.name + "_y").attr("type", "text").attr("maxLength", 12);

            jQuery(li).attr("className", "utm " + (field.fullWidth ? "full-width" : ""));
            jQuery(wrapper_x).attr("className", "fake-text-wrapper x");
            jQuery(wrapper_y).attr("className", "fake-text-wrapper y");

            wrapper_x.appendChild(input_x);
            wrapper_y.appendChild(input_y);

            // set defaults on drop downs
            if (field.value && field.value.northing) {
                sb_lonZone.setSelectedValue(field.value.lngZone);
                sb_hemisphere.setSelectedValue(field.value.hemisphere);
                jQuery(input_x).val(field.value.easting);
                jQuery(input_y).val(field.value.northing);
            }
            else {
                sb_hemisphere.label(sMap.get("label_lat_zone"));
                sb_lonZone.label(sMap.get("label_lon_zone"));

                hint_x = document.createElement("span");
                hint_y = document.createElement("span");
                jQuery(hint_x).attr("className", "hint text");
                jQuery(hint_y).attr("className", "hint text");
                hint_x.appendChild(document.createTextNode("easting"));
                hint_y.appendChild(document.createTextNode("northing"));
                wrapper_x.appendChild(hint_x);
                wrapper_y.appendChild(hint_y);
            }

            sb_hemisphere_el = sb_hemisphere.build(null, null, "latitude-zone");
            sb_lonZone_el = sb_lonZone.build(null, null, "longitude-zone");

            label.appendChild(text);
            li.appendChild(label);
            li.appendChild(wrapper_x);
            li.appendChild(wrapper_y);
            li.appendChild(sb_hemisphere_el);
            li.appendChild(sb_lonZone_el);

            field.origValidate = field.validate;
            field.validate = function() {
                return field.origValidate({
                    "northing":     jQuery(input_y).val(),
                    "easting":      jQuery(input_x).val(),
                    "hemisphere":   sb_hemisphere.getValue(),
                    "lonZone":      sb_lonZone.getValue(),
                    "northingEl":   wrapper_y,
                    "eastingEl":    wrapper_x,
                    "hemisphereEl": sb_hemisphere_el,
                    "lonZoneEl":    sb_lonZone_el
                });
            };

            return li;
        },
        "image-single": function(field) {
            var li,
                label,
                text,
                wrapper,
                uploadEl,
                queueEl,
                tmp,
                hidden;

            li          = document.createElement("li");
            label       = document.createElement("label");
            text        = document.createTextNode(field.label);
            wrapper     = document.createElement("div");
            uploadEl    = document.createElement("div");
            queueEl     = document.createElement("div");
            hidden      = document.createElement("input");
            wrapper.id  = Util.random(true);
            uploadEl.id = Util.random(true);
            queueEl.id  = Util.random(true);
            hidden.type = "hidden";
            hidden.name = field.name;

            jQuery(wrapper).append(uploadEl).append(queueEl);
            jQuery("#temp").append(wrapper);

            jQuery(uploadEl).uploadify({
                'fileExt'   : '*.jpg;*.gif;*.png;*.bmp;*.tif',
                'buttonText': sMap.get("button_select_file"),
                'uploader'  : '../static/js/uploadify-2.0/uploadify.swf',
                'script'    : 'upload',
                'cancelImg'  : '../static/js/uploadify-2.0/cancel.png',
                'auto'      : true,
                'multi'     : false,
                'queueID'   : queueEl.id,
                'wmode'       : 'transparent',
                'hideButton'  : false,
                'sizeLimit'   : 524288, // 512KB
                'removeCompleted': false,
                'onOpen': Util.ajaxCounterInc,
                'onComplete': function(event, queueID, fileObj, response, data) {
                    var o;

                    o = JSON.parse(response);

                    if (o['status'] === "success") {
                        jQuery(hidden).val(o["uri"]);
                    }

                    Util.ajaxCounterDec();
                },
                'onError': Util.ajaxCounterDec,
                'onAllComplete' : function(event, data) {
                    var flashButton,
                        done;

                    done = document.createElement("div");
                    jQuery(done).append(document.createTextNode(sMap.get("completed"))).addClass("done");
                    flashButton = jQuery(tmp).find("object").get(0);
                    flashButton.style.visibility = "hidden";
                    flashButton.parentNode.replaceChild(done, flashButton);
                }
            });

            tmp = wrapper.parentNode.removeChild(wrapper);

            jQuery(label).append(text);
            jQuery(li).append(label)
                .append(tmp)
                .append(hidden)
                .attr("className", "image-single " + (field.fullWidth ? "full-width" : ""));

            if (field.validate) {
                field.origValidate = field.validate;
                field.validate = function() {
                    return field.origValidate({
                        "value":   jQuery(hidden).val(),
                        "el":      wrapper
                    });
                };
            }

            return li;
        },
        "image-multi": function(field) {
            var li,
                label,
                text,
                wrapper,
                uploadEl,
                queueEl,
                tmp,
                hidden,
                uris,
                removeUploadedImages;

            li          = document.createElement("li");
            label       = document.createElement("label");
            text        = document.createTextNode(field.label);
            wrapper     = document.createElement("div");
            uploadEl    = document.createElement("div");
            queueEl     = document.createElement("div");
            hidden      = document.createElement("input");
            wrapper.id  = Util.random(true);
            uploadEl.id = Util.random(true);
            queueEl.id  = Util.random(true);
            hidden.type = "hidden";
            hidden.name = field.name;
            if (field.value) {
                hidden.value = field.value;
            }
            uris        = [];

            jQuery(wrapper).append(uploadEl).append(queueEl);
            jQuery("#temp").append(wrapper);

            jQuery(uploadEl).uploadify({
                'buttonText': sMap.get("button_select_file"),
                'uploader'  : '../static/js/uploadify-2.0/uploadify.swf',
                'script'    : 'upload',
                'cancelImg'  : '../static/js/uploadify-2.0/cancel.png',
                'auto'      : true,
                'multi'     : true,
                'queueID'   : queueEl.id,
                'wmode'       : 'transparent',
                'hideButton'  : false,
                'removeCompleted': false,
                'queueSizeLimit' : 14,
                'onOpen': Util.ajaxCounterInc,
                'onComplete': function(event, queueID, fileObj, response, data) {
                    var o;

                    o = JSON.parse(response);

                    if (o['status'] === "success") {
                        uris.push(o["uri"]);
                    }

                    Util.ajaxCounterDec();
                },
                'onError': Util.ajaxCounterDec,
                'onAllComplete' : function(event, data) {
                    var flashButton,
                        done,
                        existingImagesValue;

                    existingImagesValue = jQuery(hidden).val();
                    done = document.createElement("div");
                    jQuery(done).append(document.createTextNode(sMap.get("completed"))).addClass("done");
                    flashButton = jQuery(tmp).find("object").get(0);
                    flashButton.style.visibility = "hidden";
                    flashButton.parentNode.replaceChild(done, flashButton);
                    if (existingImagesValue) {
                        jQuery(hidden).val(existingImagesValue + "," + uris.join(","));
                    }
                    else {
                        jQuery(hidden).val(uris.join(","));
                    }
                }
            });

            tmp = wrapper.parentNode.removeChild(wrapper);

            jQuery(label).append(text);
            jQuery(li).append(label)
                .append(tmp)
                .append(hidden)
                .attr("className", "image-multi " + (field.fullWidth ? "full-width" : ""));

            if (field.value) {
                removeUploadedImages = document.createElement("a");
                removeUploadedImages.href = ".";
                removeUploadedImages.appendChild(document.createTextNode(sMap.get("already_uploaded_images_warning", {
                    number_of_files: field.value.split(",").length
                })));
                jQuery(removeUploadedImages)
                    .click(function(e) {
                        e.preventDefault();
                        jQuery(hidden).val(null);
                        jQuery(this).remove();
                    })
                    .addClass("already_uploaded");

                jQuery(li).append(removeUploadedImages);
            }

            if (field.validate) {
                field.origValidate = field.validate;
                field.validate = function() {
                    return field.origValidate({
                        "value":   jQuery(hidden).val(),
                        "el":      wrapper
                    });
                };
            }

            return li;
        },
        "custom": function(field) {
            jQuery(field.el).addClass("custom")
                .addClass(field.fullWidth ? "full-width" : "");

            return field.el;
        }
    };

    self.getData = function() {
        var o;

        o = {};

        Util.copyFormInputValuesToObject(formEl, o);

        return o;
    };

    self.addCustomPositionField = function(el, fullWidth) {
        return addField("custom", null, null, null, fullWidth, el, null);
    };

    self.addMultiImageField = function(name, label, value, validator) {
        return addField("image-multi", name, label, value, true, null, validator);
    };

    self.addSingleImageField = function(name, label, validator) {
        return addField("image-single", name, label, null, true, null, validator);
    };

    self.addTextField = function(name, label, value, fullWidth, optionalEl, validator) {
        return addField("text", name, label, value, fullWidth, optionalEl, validator);
    };

    self.addDmsLatitudeField = function(name, label, value, fullWidth, dropDownEl) {
        value = value ? Util.convertDDtoDMS(value, 4) : null;
        return addField("degree", name, label, value, fullWidth, dropDownEl, function(o) {
            var isValid,
                result1,
                result2,
                result3;

            isValid = true;

            result1 = Validate.isValidLatitudeDegree(o.degree);
            if (!result1.valid) {
                isValid = false;
            }

            result2 = Validate.isValidMinute(o.minute);
            if (!result2.valid) {
                isValid = false;
            }

            result3 = Validate.isValidSecond(o.second);
            if (!result3.valid) {
                isValid = false;
            }

            if (!isValid) {
                Util.callOut(o.secondEl.parentNode.parentNode, result1.messages.concat(result2.messages, result3.messages));
            }

            return isValid;
        });
    };

    self.addDmsLongitudeField = function(name, label, value, fullWidth, dropDownEl) {
        value = value ? Util.convertDDtoDMS(value, 4) : null;
        return addField("degree", name, label, value, fullWidth, dropDownEl, function(o) {
            var isValid,
                result1,
                result2,
                result3;

            isValid = true;

            result1 = Validate.isValidLongitudeDegree(o.degree);
            if (!result1.valid) {
                isValid = false;
            }

            result2 = Validate.isValidMinute(o.minute);
            if (!result2.valid) {
                isValid = false;
            }

            result3 = Validate.isValidSecond(o.second);
            if (!result3.valid) {
                isValid = false;
            }

            if (!isValid) {
                Util.callOut(o.secondEl.parentNode.parentNode, result1.messages.concat(result2.messages, result3.messages));
            }

            return isValid;
        });
    };

    self.addDropDownField = function(label, fullWidth, dropDownEl, validator) {
        return addField("dropdown", null, label, null, fullWidth, dropDownEl, validator);
    };

    self.addUtmField = function(name, label, value, fullWidth) {

        if (value && value.core_latitude && value.core_longitude) {
            value = Util.convertLatLngToUtm(parseFloat(value.core_latitude), parseFloat(value.core_longitude), 4);
        }
        else {
            value = null;
        }

        return addField("utm", name, label, value, fullWidth, null, function(o) {
            var isValid,
                result;

            isValid = true;

            result = Validate.isValidEasting(o.easting);
            if (!result.valid) {
                Util.callOut(o.eastingEl, result.messages);
                isValid = false;
            }

            result = Validate.isValidNorthing(o.northing);
            if (!result.valid) {
                Util.callOut(o.northingEl, result.messages);
                isValid = false;
            }

            result = Validate.isValidLonZone(o.lonZone);
            if (!result.valid) {
                Util.callOut(o.lonZoneEl, result.messages);
                isValid = false;
            }

            result = Validate.isValidHemisphere(o.hemisphere);
            if (!result.valid) {
                Util.callOut(o.hemisphereEl, result.messages);
                isValid = false;
            }

            return isValid;
        });
    };

    self.rebuild = function() {
        if (!self.removeDomElements) {
            Util.handleError("Error: can't call rebuild until you've built at least once");
        }
        else {
            self.removeDomElements();
            return self.build();
        }
    };

    self.build = function() {
        var ul,
            i,
            li,
            mod;

        mod           = 0;
        formEl        = document.createElement("form");
        ul            = document.createElement("ul");
        ul.className  = classNames;

        for (i = 0; i < fields.length; i++) {
            li = dispatch[fields[i].type](fields[i]);
            // TODO: THIS CODE LOOKS LIKE SHIT, SO FIX IT
            mod = (fields[i].fullWidth || mod === 1) ? 0 : mod+1;
            if (fields[i].fullWidth || mod === 1) {
                jQuery(li).addClass("new-line");
            }
            ul.appendChild(li);
        }

        formEl.appendChild(ul);

        self.removeDomElements = function() {
            jQuery(formEl).remove();
        };

        jQuery(formEl).submit(function(e) {
            e.preventDefault();
        });

        jQuery(ul).bind("keydown", function(e) {
            var tgt,
                nodeName;

            tgt      = jQuery(e.target);
            nodeName = tgt[0].nodeName.toLowerCase();

            if (nodeName === "input" || nodeName === "textarea") {
                tgt.siblings(".hint.text").css("display", "none");
            }
        });

        jQuery(ul).bind("click", function(e) {
            var tgt,
                nodeName;

            tgt      = jQuery(e.target);
            nodeName = tgt[0].nodeName.toLowerCase();

            if (tgt.hasClass("hint") && tgt.hasClass("text")) {
                tgt.css("display", "none").siblings().focus();
            }
            else if (nodeName === "input" || nodeName === "textarea") {
                tgt.siblings(".hint.text").css("display", "none");
            }
        });

        return formEl;
    };

    self.isValid = function() {
        var i,
            len,
            formValid,
            fieldValid;

        formValid = true;
        jQuery(formEl).find(".callOut").remove();

        for (i = 0, len = fields.length; i < len; i++) {
            if (fields[i].validate) {
                fieldValid = fields[i].validate();
                formValid = fieldValid ? formValid : false;
            }
        }

        return formValid;
    };

    function addField(type, name, label, value, fullWidth, el, validator) {
        fields.push({
            el: el,
            fullWidth: fullWidth,
            label: label,
            name: name,
            type: type,
            value: value,
            validate: validator
        });
        return self;
    }

    return self;
};

var TableBuilder = function(colDefs, emptyMessage) {
    var self,
        data;

    self = {};

    self.setData = function(array) {
        data = array;
        return self;
    };

    self.build = function() {
        var i,
            len,
            table,
            thead,
            tbody,
            tr,
            emptyMessageTr,
            th,
            td,
            dispatch;

        dispatch = {};
        table    = document.createElement("table");
        thead    = document.createElement("thead");
        tbody    = document.createElement("tbody");
        tr       = document.createElement("tr");

        table.cellSpacing = 0;

        for (i = 0, len = colDefs.length; i < len; i++) {
            th = document.createElement("th");
            if (colDefs[i].labelFormatter) {
                colDefs[i].labelFormatter(th);
            }
            else {
                th.appendChild(document.createTextNode(colDefs[i].label));
            }

            th.className = colDefs[i].key;
            tr.appendChild(th);
        }

        thead.appendChild(tr);

        for (i = 0, len = data.length; i < len; i++) {
            tbody.appendChild(makeDataRow(data[i], i, len));
        }

        if (!data || !data.length) {
            emptyMessageTr = document.createElement("tr");
            td = document.createElement("td");
            td.colSpan = colDefs.length;
            td.appendChild(document.createTextNode(emptyMessage));
            emptyMessageTr.appendChild(td);
            tbody.appendChild(emptyMessageTr);
            emptyMessageTr.className = "odd";
        }

        table.appendChild(thead);
        table.appendChild(tbody);

        self.removeRowByIndex = function(pos) {
            var rowToRemove;
            
            data.splice(pos, 1);
            rowToRemove = jQuery(tbody.getElementsByTagName("tr")[pos]).remove();
        };

        self.addRow = function(o) {
            if (data.length === 1) {
                jQuery(emptyMessageTr).remove();
            }
            jQuery(tbody).append(makeDataRow(o));
        };

        self.rebuild = function() {
            jQuery(table).remove();
            return self.build();
        };

        return table;
    };

    function makeDataRow(fullRowData, index, totalRecords) {
        var tr,
            td,
            len,
            i;

        if (!makeDataRow.flip) {
            makeDataRow.flip = ["even", "odd"];
        }
        else {
            makeDataRow.flip.reverse();
        }

        tr = document.createElement("tr");
        tr.className = makeDataRow.flip[0];

        for (i = 0, len = colDefs.length; i < len; i++) {
            td = document.createElement("td");
            td.className = colDefs[i].key;
            if (colDefs[i].formatter) {
                colDefs[i].formatter(td, fullRowData[colDefs[i].key], fullRowData, index, totalRecords);
            }
            else {
                td.appendChild(document.createTextNode(fullRowData[colDefs[i].key]));
            }
            tr.appendChild(td);
        }

        return tr;
    }

    return self;
};

var Modal = function(_readyCallback, _height, _width) {
    var self,
        d,
        view;

    _height = (!_height) ? 600 : _height;
    _width  = (!_width) ? 700 : _width;

    self = {};

    self.open = function() {
        jQuery(d).dialog("open");
    };

    self.close = function() {
        jQuery(d).dialog("close");
    };

    self.setTitle = function(title) {
        jQuery(d).dialog("option", "title", title);
    };

    self.setContents = function(el) {
        jQuery(d).html(el);
    };

    self.setButtons = function(leftButtonMap, rightButtonMap) {
        var buttons;

        buttons = [];

        if (leftButtonMap) {
            leftButtonMap["className"] = "left";
            buttons.push(leftButtonMap);
        }

        if (rightButtonMap) {
            rightButtonMap["className"] = "right";
            buttons.push(rightButtonMap);
        }

        jQuery(d).dialog("option", "buttons", buttons);

        self.setRightButtonText = function(text) {
            buttons[buttons.length-1]["text"] = text;
            jQuery(d).dialog("option", "buttons", buttons);
        };

        self.setLeftButtonText = function(text) {
            buttons[buttons.length-1]["text"] = text;
            jQuery(d).dialog("option", "buttons", buttons);
        };
    };

    self.destroyContents = function() {
        if (view) {
            view.destroy();
            view = null;
        }
        self.setTitle(null);
        self.setContents(null);
        self.setButtons(null, null);
    };

    self.displayView = function(v) {
        self.destroyContents();
        v.render();
        view = v;
    };

    self.setDialogClass = function(cssClass) {
        jQuery(d).dialog({
            dialogClass: cssClass
        });
    };

    d = jQuery("<div></div>").dialog({
        autoOpen: false,
        bgiframe: true,
        closeOnEscape: false,
        height: _height,
        modal: true,
        position: "center",
        resizable: false,
        width: _width
    });
    _readyCallback(self);

    return self;
};

var Mask = function(_readyCallback) {
    var d,
        el;

    el = jQuery("<div class=\"loading\"></div>")
            .html("<img src=\"/static/img/ajax-loader-bar.gif\" width=\"100%\">");

    d = jQuery(el).dialog({
        autoOpen: false,
        closeOnEscape: false,
        dialogClass: "wait",
        draggable: false,
        height: 80,
        modal: true,
        resizable: false,
        title: sMap.get("mask_waiting_message")
    });

    jQuery(d).ajaxStart(function() {
        jQuery(d).dialog("open");
    });

    jQuery(d).ajaxStop(function() {
        jQuery(d).dialog("close");
    });

    _readyCallback();

    return self;
};

////////////////////
// VIEWS

var BaseView = function() {
    var self;

    self = {};

    self.destroy = function() {

    };

    return self;
};

var BaseWizardView = function() {
    var self;

    self = new BaseView();

    self.makeLeftButtonForWizard = function(controller) {
        return {
            "text": sMap.get(controller.getLeftButtonKey(self)),
            "click": function() {
                controller.handleLeftButtonClicked(self.getData());
            }
        };
    };

    self.makeRightButtonForWizard = function(controller) {
        return {
            "text": sMap.get(controller.getRightButtonKey(self)),
            "click": function() {
                controller.handleRightButtonClicked(self.getData());
            }
        };
    };

    self.destroy = function() {

    };

    return self;
};

var LandingPagePublicView = function(_container, _controller) {
    var self;

    self                = new BaseView();
    self.userSettings   = null;
    self.buttons        = {};
    self.positionMap    = {};
    self.DEFAULT_LATLNG = new google.maps.LatLng(14.838664, -89.15529600000001);
    self.latLngs        = [];
    self.infowindow     = new google.maps.InfoWindow({
        content: null,
        maxWidth: (jQuery(window).width()*0.8)
    });

    self.resetMap = function() {
        self.clearPositions();
        self.map.setZoom(4);
        self.map.panTo(self.DEFAULT_LATLNG);
    };

    self.removePositionById = function(positionId) {
        self.positionMap[positionId.toString()]["marker"].setMap(null);
    };

    self.drawSinglePosition = function(position, focusAfterAdding, msDelay) {
        var j,
            dispatch,
            latLng;

        dispatch = {
            "core_icon" : function(x) {
                position.getIcon = function() {
                    return x;
                };
            },
            "core_latitude": function(value, propertyOffset) {
                var val;
                val = value;
                position.getLatitude = function() {
                    return parseFloat(val);
                };
                position.setLatitude = function(newValue) {
                    val = newValue;
                    position["position_properties"][propertyOffset].value = newValue;
                };
            },
            "core_longitude": function(value, propertyOffset) {
                var val;
                val = value;
                position.getLongitude = function() {
                    return parseFloat(val);
                };
                position.setLongitude = function(newValue) {
                    val = newValue;
                    position["position_properties"][propertyOffset].value = newValue;
                };
            }
        };

        for (j = 0; position['position_properties'].length && j < position['position_properties'].length; j++) {
            if (dispatch[position['position_properties'][j]['name']]) {
                dispatch[position['position_properties'][j]['name']](position['position_properties'][j]['value'], j);
            }
        }

        latLng = new google.maps.LatLng(position.getLatitude(), position.getLongitude());

        self.latLngs.push(latLng);

        if (msDelay) {
            // 0 loosely tests to false
            window.setTimeout(function() {
                self.drawMarker(latLng, position, focusAfterAdding);
            }, msDelay);
        }
        else {
            self.drawMarker(latLng, position, focusAfterAdding);
        }
    };

    self.drawPositions = function(positions) {
        var i,
            delay,
            len;

        len = positions.length;
        delay = len && len.length > 50 ? 0 : Math.round(2000/positions.length);

        for (i = 0; len && i < len; i++) {
            self.drawSinglePosition(positions[i], false, i*delay);
        }

        if (i > 1) {
            self.zoomToShow(self.latLngs);
        }
        else if (i === 1) {
            self.map.panTo(self.latLngs[0]);
        }
    };

    self.setButtonActivatedState = function(buttonName, activated) {
        jQuery(self.buttons[buttonName]).button({disabled: !activated});
    };

    self.render = function() {
        var north_control_holder,
            map_canvas,
            i,
            searchButtonShim,
            input_search,
            console;

        searchButtonShim     = document.createElement("div");
        searchButtonShim.id  = "search_shim";
        self.searchShim      = document.createElement("div");
        self.searchShim.id   = "search_input_shim";
        input_search         = document.createElement("input");
        input_search.type    = "text";
        input_search.id      = "search";
        self.searchShim.className = "fake-text-wrapper";

        console = document.createElement("textarea");
        console.className = "console";
        console.rows = 12;
        console.cols = 50;
        console.id   = "console";

        north_control_holder                  = document.createElement("div");
        self.buttons['search_button']         = document.createElement("button");
        self.buttons['search_button'].id      = "search_public";
        self.buttons['search_button'].href    = "redirect";
        self.buttons['search_button'].onclick = function() { return false; };

        self.buttons['search_button'].appendChild(document.createTextNode(sMap.get("button_search")));

        map_canvas    = document.createElement("div");
        map_canvas.id = "map_canvas";

        self.map = new google.maps.Map(map_canvas, {
            zoom: 4,
            center: self.DEFAULT_LATLNG,
            mapTypeId: google.maps.MapTypeId[self.userSettings["default_google_map_type"]],
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            styles: [{
                featureType: "poi.business",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.school",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "transit",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.attraction",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.sports_complex",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.government",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.place_of_worship",
                stylers: [{
                    visibility: "off"
                }]
            }]
        });

        self.distancePoly = new google.maps.Polyline({
            clickable: false,
            map: self.map,
            strokeColor: '#00d73a',
            strokeOpacity: 0.5,
            strokeWeight: 1
        });

        self.areaPoly = new google.maps.Polygon({
            clickable: false,
            fillColor: "#00d73a",
            fillOpacity: 0.1,
            map: self.map,
            strokeOpacity: 0
        });

        google.maps.event.addListener(self.map, 'rightclick', function(e) {
            jQuery("#console").fadeOut("fast");
            self.distancePoly.getPath().clear();
            self.areaPoly.getPath().clear();
        });

        north_control_holder.className = "landing-page-control-holder north";

        jQuery(self.buttons['search_button']).button();

        // for the search box
        self.searchShim.appendChild(input_search);
        searchButtonShim.appendChild(self.buttons['search_button']);
        searchButtonShim.appendChild(self.searchShim);
        north_control_holder.appendChild(searchButtonShim);

        north_control_holder.appendChild(self.buttons['search_button']);
        _container.appendChild(north_control_holder);
        _container.appendChild(console);
        _container.appendChild(map_canvas);

        // attach listeners
        jQuery(self.buttons['search_button']).click(self.toggleSearchBox);
        jQuery(input_search).bind('keyup', self.handleSearchInputKeyboardEvent);
    };

    self.drawMarker = function(latLng, positionObj, focusAfterAdding) {
        var marker;

        marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: latLng,
            map: self.map,
            title: self.getTitle(latLng, self.userSettings["default_gps_format"]),
            icon: positionObj.getIcon ? positionObj.getIcon() : null,
            draggable: self.allowDragAndDropUpdates
        });

        self.positionMap[positionObj.position_id.toString()] = {};
        self.positionMap[positionObj.position_id.toString()]["marker"] = marker;

        if (focusAfterAdding) {
            self.map.panTo(latLng);
            if (Util.isArray(self.latLngs) && self.latLngs.length > 1) {
                self.zoomToShow(self.latLngs);
            }
            self.revealInfowindow(positionObj, marker);
        }

        google.maps.event.addListener(marker, 'click', function(e) {
            self.revealInfowindow(positionObj, marker);
        });
        google.maps.event.addListener(marker, 'rightclick', function(e) {
            self.updateMeasurements(e);
        });

        if (self.allowDragAndDropUpdates) {
            google.maps.event.addListener(marker, 'dragend', function(e) {
                positionObj.setLatitude(e.latLng.lat());
                positionObj.setLongitude(e.latLng.lng());
                self.revealInfowindow(positionObj, marker);
                _controller.updatePositionByDragAndDrop(positionObj);
            });
        }
    };

    self.revealInfowindow = function(positionObj, marker) {
        self.infowindow.setContent(self.makePositionPropertiesInfowindowContent(positionObj));
        self.infowindow.open(self.map, marker);
    };

    self.updateMeasurements = function(e) {
        var console,
            lenPath,
            areaPath,
            len,
            area,
            measurement_system,
            unit,
            message;

        measurement_system = self.userSettings["default_measurement_system"];
        console = jQuery("#console").fadeIn("fast");
        lenPath = self.distancePoly.getPath();
        lenPath.push(e.latLng);
        areaPath = self.areaPoly.getPath();
        areaPath.push(e.latLng);

        if (lenPath.length > 1) {
            len = google.maps.geometry.spherical.computeLength(lenPath);

            if (measurement_system === "IMPERIAL") {
                len = len * 3.280839895;
                unit = sMap.get("feet");
            }
            else {
                unit = sMap.get("meters");
            }

            message = sMap.get("polyline_length", {
                len: len.toFixed(2),
                unit: unit
            }) + "\n";

            if (areaPath.length > 2) {
                area = google.maps.geometry.spherical.computeArea(areaPath);

                if (measurement_system === "IMPERIAL") {
                    area = area * 10.7639104;
                }

                message += sMap.get("polygon_area", {
                    area: area.toFixed(2),
                    unit: unit + "^2"
                }) + "\n";
            }

            jQuery(console).append(message + "\n").scrollTop(jQuery(console)[0].scrollHeight - jQuery(console).height());
        }
    };

    self.getTitle = function(latLng, default_gps_format) {
        var s,
            dispatch;

        dispatch = {
            "DEGREE" : function() {
                var lat_label,
                    lon_label;

                lat_label = latLng.lat() < 0 ? sMap.get("label_S") : sMap.get("label_N");
                lon_label = latLng.lng() < 0 ? sMap.get("label_W") : sMap.get("label_E");
                s = sMap.get("core_latitude") + ": " + lat_label + " " + Util.convertDDtoDMS(latLng.lat(), 4) + ", ";
                s += sMap.get("longitude") + ": " + lon_label + " " + Util.convertDDtoDMS(latLng.lng(), 4);
            },
            "DECIMAL": function() {
                s = sMap.get("core_latitude") + ": " + latLng.lat().toString() + ", ";
                s += sMap.get("longitude") + ": " + latLng.lng().toString();
            },
            "UTMWGS84": function() {
                var utm;

                utm = Util.convertLatLngToUtm(latLng.lat(), latLng.lng(), 4);
                s = "WGS84: " + utm.lngZone + "" + utm.hemisphere + " " + utm.easting.toString() + " " + utm.northing.toString();
            }
        };

        return dispatch[default_gps_format]();
    };

    self.clearPositions = function() {
        var key,
            j;

        for (key in self.positionMap) {
            if (self.positionMap.hasOwnProperty(key)) {
                self.positionMap[key]["marker"].setMap(null);
            }
        }

        for (j = 0; j < self.latLngs.length; j++) {
            self.latLngs[j] = null;
        }

        self.latLngs.length = 0;
    };

    self.zoomToShow = function(listOfLatLng) {
        var bounds;

        bounds = new google.maps.LatLngBounds();

        for (var i = 0; i < listOfLatLng.length; i++) {
            bounds.extend(listOfLatLng[i]);
        }

        self.map.fitBounds(bounds);
    };

    self.buildControlRowsHtml = function() {
        var html;

        html = "";
        if (self.showInfowindowControls) {
            html += "<tr class\"controls\"><td colspan=\"2\"><a class=\"delete\" href=\"#\">" + sMap.get("remove") + "</a>&nbsp;|&nbsp;<a class=\"edit\" href=\"#\">" + sMap.get("edit") + "</a></td></tr>";
        }

        return html;
    };

    self.buildRowsHtml = function(position) {
        var html,
            i,
            coreFieldsDispatch,
            typesDispatch;

        html = "<table class=\"infowindow\"><tbody>";

        coreFieldsDispatch = {
            "DEGREE" : function(name, value) {
                var val_label,
                    val,
                    field_label;

                val = parseFloat(value);
                field_label = sMap.get(name);

                if (name === "core_latitude") {
                    val_label = val < 0 ? sMap.get("label_S") : sMap.get("label_N");
                }
                else {
                    val_label = val < 0 ? sMap.get("label_W") : sMap.get("label_E");
                }

                html += "<tr><td>" + field_label  + ":</td><td>" + val_label + " " + Util.convertDDtoDMS(value, 4).toString() + "</td></tr>";
            },
            "DECIMAL": function(name, value) {
                var field_label;

                field_label = sMap.get(name);

                html += "<tr><td>" + field_label + ":</td><td>" + value.toString() + "°</td></tr>";
            },
            "UTMWGS84": function(name, value) {
                var utm,
                    s;

                utm = Util.convertLatLngToUtm(parseFloat(position.getLatitude()), parseFloat(position.getLongitude()), 4);
                s = utm.lngZone + "" + utm.hemisphere + " " + utm.easting.toString() + " " + utm.northing.toString();

                html +="<tr><td>WGS84</td><td>" + s + "</tr>";
            }
        };

        typesDispatch = {
            "IMAGE": function(name, value) {
                html += "<tr class=\"IMAGE\"><td colspan=\"2\"><div class=\"box\"><label>" + name + "</label><a class=\"lightBox\" target=\"_blank\" href=\"" + value + "\"><img border=\"0\" src=\"" + value + "\"></a></div></td></tr>";
            },
            "IMAGE_LIST": function(name, value) {
                var images,
                    i;

                images = value.split(",");
                for (i = 0; i < images.length; i++) {
                    images[i] = "<a target=\"_blank\" class=\"lightBox\" href=\"" + images[i] + "\"><img border=\"0\" src=\"" + images[i] + "\">";
                }
                html += "<tr class=\"IMAGE_LIST\"><td colspan=\"2\"><div class=\"box\"><label>" + name + "</label>" + images.join("") + "</div></td></tr>";
            },
            "STRING": function(name, value) {
                html += "<tr class=\"TEXT\"><td>" + name + ":</td><td>" + value + "</td></tr>";
            }
        };

        for (i = 0; i < position.position_properties.length; i++) {
            if (position.position_properties[i].visible === "Y") {
                var d,
                    suppressFields,
                    coreFields;

                suppressFields = ["core_icon"];
                coreFields = ["core_latitude", "core_longitude"];

                if (jQuery.inArray(position.position_properties[i].name, suppressFields) !== -1) {
                    // no-op
                }
                else if (jQuery.inArray(position.position_properties[i].name, coreFields) !== -1) {
                    coreFieldsDispatch[self.userSettings["default_gps_format"]](position.position_properties[i].name, position.position_properties[i].value);
                }
                else {
                    typesDispatch[position.position_properties[i].field_type](position.position_properties[i].name, position.position_properties[i].value);
                }
            }
        }

        html += self.buildControlRowsHtml();
        html += "</tbody></table>";

        return html;
    };

    self.makePositionPropertiesInfowindowContent = function(position) {
        var el,
            maxHeight,
            maxWidth;

        el = document.createElement("div");
        maxHeight = jQuery(window).height();
        maxHeight = maxHeight - Math.floor(maxHeight*.2);
        maxWidth = jQuery(window).width();
        maxWidth = maxWidth - Math.floor(maxWidth*.1);

        jQuery(el)
            .click(function(e) {
                if (e.target.nodeName.toLowerCase() === "a") {
                    self.dispatchInfowindowContentClicked(e.target.className, position);
                    return false;
                }
            })
            .html(self.buildRowsHtml(position))
            .find(".lightBox")
            .lightBox({
                imageLoading:  '/static/img/jquery-lightbox-0/lightbox-ico-loading.gif',
                imageBtnPrev:  '/static/img/jquery-lightbox-0/lightbox-btn-prev.gif',
                imageBtnNext:  '/static/img/jquery-lightbox-0/lightbox-btn-next.gif',
                imageBtnClose: '/static/img/jquery-lightbox-0/lightbox-btn-close.gif',
                imageBlank:    '/static/img/jquery-lightbox-0/lightbox-blank.gif',
                txtImage:      sMap.get("lightBox_image"),
                txtOf:         sMap.get("lightBox_of"),
                imageMaxHeight:    maxHeight,
                imageMaxWidth:     maxWidth
            });

        return el;
    };

    self.dispatchInfowindowContentClicked = function(action, position) {
        // deliberately no-op
    };

    self.handleSearchInputKeyboardEvent = function(e) {
        var dispatch;

        dispatch = {
            13: function() {
                _controller.setSearchKeyword(jQuery(e.target).val());
                _controller.searchPositions();
            },
            27: function() {
                self.toggleSearchBox(e);
            }
        };

        if (dispatch[e.keyCode]) {
            dispatch[e.keyCode]();
        }
    };

    self.toggleSearchBox = function(e) {
        var elements,
            offset,
            height,
            width,
            outerWidth;

        elements = [self.buttons['search_button'], self.searchShim];

        if (!self.toggleSearchBox.ranOnce) {
            offset     = jQuery(e.target).offset();
            height     = jQuery(e.target).height();
            outerWidth = jQuery(e.target).outerWidth() + 2;

            jQuery(self.searchShim.parentNode).css("width", outerWidth + "px");
            jQuery("#search").focus();
            self.toggleSearchBox.ranOnce = true;
        }

        if (self.toggleSearchBox.flipped) {
            elements.reverse();
        }

        self.toggleSearchBox.flipped = !self.toggleSearchBox.flipped;

        jQuery(elements[0]).fadeToggle("fast", function() {
            jQuery(elements[1]).fadeToggle("fast");
        });
    };

    return self;
};

var LandingPagePrivateView = function(_container, _controller) {
    var self,
        sb_projectSelect,
        selectProjectShim,
        newProjectShim;

    self = new LandingPagePublicView(_container, _controller);

    self.removePositionById = function(positionId) {
        self.positionMap[positionId.toString()]["marker"].setMap(null);
    };

    self.addNewProjectToSelectAndHideInput = function(projectId, name) {
        var el;
        sb_projectSelect.addOption(projectId, name, true);
        el = sb_projectSelect.rebuild();
        jQuery(el).css("display", "none");
        selectProjectShim.appendChild(el);
        toggleNewProjectInput();
    };

    self.setMouseControlsActivatedState = function(activated) {
        self.allowDragAndDropUpdates = activated;
    };

    self.setInfowindowControlsActivatedState = function(activated) {
        self.showInfowindowControls = activated;
    };

    self.setButtonActivatedState = function(buttonName, activated) {
        jQuery(self.buttons[buttonName]).button({disabled: !activated});
    };

    self.render = function() {
        var north_control_holder,
            south_control_holder,
            map_canvas,
            controls_disabled,
            input_projectName,
            i,
            searchButtonShim,
            input_search,
            console,
            sb_addPositions,
            sb_addPositions_el,
            GOOGLE_MAP_TYPE_DEFAULT;

        GOOGLE_MAP_TYPE_DEFAULT = "SATELLITE";
        controls_disabled = self.userId ? false : true;

        sb_projectSelect = new SelectBuilder("project_select", false)
            .label(sMap.get("button_select_project"))
            .addOption("new_project", sMap.get("new_project"));

        sb_addPositions = new SelectBuilder("add_positions", false)
            .label(sMap.get("enter_or_import_positions"))
            .addOption("single_position", sMap.get("add_single_position"))
            .addOption("batch_position_garmin", sMap.get("import_multiple_positions_from_garmin"));

        sb_addPositions_el = sb_addPositions.build(null, "add-positions");

        for (i = 0; self.projects && i < self.projects.length; i++) {
            sb_projectSelect.addOption(self.projects[i].project_id, self.projects[i].name, false);
        }

        selectProjectShim        = document.createElement("div");
        selectProjectShim.id     = "new_project_shim";
        newProjectShim           = document.createElement("div");
        newProjectShim.id        = "new_project_input_shim";
        input_projectName        = document.createElement("input");
        input_projectName.type   = "text";
        input_projectName.id     = "new_project";
        newProjectShim.className = "fake-text-wrapper";

        searchButtonShim     = document.createElement("div");
        searchButtonShim.id  = "search_shim";
        self.searchShim      = document.createElement("div");
        self.searchShim.id   = "search_input_shim";
        input_search         = document.createElement("input");
        input_search.type    = "text";
        input_search.id      = "search";
        self.searchShim.className = "fake-text-wrapper";

        console = document.createElement("textarea");
        console.className = "console";
        console.rows = 15;
        console.cols = 50;
        console.id   = "console";

        north_control_holder                   = document.createElement("div");
        south_control_holder                   = document.createElement("div");
        self.buttons['search_button']          = document.createElement("a");
        self.buttons['share_button']           = document.createElement("a");
        self.buttons['add_positions_button']   = sb_addPositions.getButtonEl();
        self.buttons['manage_custom_fields']   = document.createElement("a");
        self.buttons['logout_button']          = document.createElement("a");
        self.buttons['update_settings_button'] = document.createElement("a");
        self.buttons['search_button'].href = "#";
        self.buttons['share_button'].href = "#";
        self.buttons['manage_custom_fields'].href = "#";
        self.buttons['logout_button'].href = "#";
        self.buttons['update_settings_button'].href = "#";

        self.buttons['search_button'].appendChild(document.createTextNode(sMap.get("button_search")));
        self.buttons['share_button'].appendChild(document.createTextNode(sMap.get("button_share")));
        self.buttons['manage_custom_fields'].appendChild(document.createTextNode(sMap.get("button_manage_custom_fields")));
        self.buttons['logout_button'].appendChild(document.createTextNode(sMap.get("button_logout")));
        self.buttons['update_settings_button'].appendChild(document.createTextNode(sMap.get("update_settings")));

        map_canvas    = document.createElement("div");
        map_canvas.id = "map_canvas";

        self.map = new google.maps.Map(map_canvas, {
            zoom: 4,
            center: self.DEFAULT_LATLNG,
            mapTypeId: google.maps.MapTypeId[self.userSettings && self.userSettings["default_google_map_type"] ? self.userSettings["default_google_map_type"] : GOOGLE_MAP_TYPE_DEFAULT],
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            styles: [{
                featureType: "poi.business",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.school",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "transit",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.attraction",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.sports_complex",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.government",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "poi.place_of_worship",
                stylers: [{
                    visibility: "off"
                }]
            }]
        });

        self.distancePoly = new google.maps.Polyline({
            clickable: false,
            map: self.map,
            strokeColor: '#00d73a',
            strokeOpacity: 0.5,
            strokeWeight: 1
        });

        self.areaPoly = new google.maps.Polygon({
            clickable: false,
            fillColor: "#00d73a",
            fillOpacity: 0.1,
            map: self.map,
            strokeOpacity: 0
        });

        google.maps.event.addListener(self.map, 'rightclick', function(e) {
            jQuery("#console").fadeOut("fast");
            self.distancePoly.getPath().clear();
            self.areaPoly.getPath().clear();
        });

        north_control_holder.className = "landing-page-control-holder north";
        south_control_holder.className = "landing-page-control-holder south";

        // the new project select/swappy thing
        newProjectShim.appendChild(input_projectName);
        selectProjectShim.appendChild(sb_projectSelect.build(controls_disabled, "select-project"));
        selectProjectShim.appendChild(newProjectShim);
        north_control_holder.appendChild(selectProjectShim);

        // for the search box
        self.searchShim.appendChild(input_search);
        searchButtonShim.appendChild(self.buttons['search_button']);
        searchButtonShim.appendChild(self.searchShim);
        north_control_holder.appendChild(searchButtonShim);

        north_control_holder.appendChild(self.buttons['share_button']);
        north_control_holder.appendChild(sb_addPositions_el);
        north_control_holder.appendChild(self.buttons['manage_custom_fields']);
        south_control_holder.appendChild(self.buttons['logout_button']);
        south_control_holder.appendChild(self.buttons['update_settings_button']);

        // disable the project-related buttons until we select or create a project
        jQuery(self.buttons['search_button']).button({disabled: true});
        jQuery(self.buttons['share_button']).button({disabled: true});
        jQuery(self.buttons['add_positions_button']).button({disabled: true});
        jQuery(self.buttons['manage_custom_fields']).button({disabled: true});
        jQuery(self.buttons['logout_button']).button({disabled: controls_disabled});
        jQuery(self.buttons['update_settings_button']).button({disabled: controls_disabled});

        _container.appendChild(north_control_holder);
        _container.appendChild(console);
        _container.appendChild(map_canvas);
        _container.appendChild(south_control_holder);

        // attach listeners
        sb_projectSelect.setPreSyncCallback(toggleIfNewProjectSelected);
        sb_projectSelect.setPostSyncCallback(loadIfProjectSelected);

        sb_addPositions.setPreSyncCallback(handleAddPositionsClicked);

        jQuery(self.buttons['search_button']).click(function(e) {
            e.preventDefault();
            self.toggleSearchBox(e);
        });
        jQuery(self.buttons['share_button']).click(function(e) {
            e.preventDefault();
            _controller.showShareProject();
        });
        jQuery(self.buttons['manage_custom_fields']).click(function(e) {
            e.preventDefault();
            _controller.showManagePositionFields();
        });
        jQuery(self.buttons['logout_button']).click(_controller.logOut);
        jQuery(self.buttons['update_settings_button']).click(function(e) {
            e.preventDefault();
            _controller.showUpdateSettings();
        });
        jQuery(input_projectName).bind('keyup', handleAddProjectInputKeyboardEvent);
        jQuery(input_search).bind('keyup', self.handleSearchInputKeyboardEvent);
    };

    self.dispatchInfowindowContentClicked = function(action, position) {
        var dispatch;

        dispatch = {
            "delete": function(position) {
                _controller.deletePosition(position.position_id);
            },
            "edit": function(position) {
                _controller.showAddUpdatePosition(position);
            }
        };

        if (dispatch[action]) {
            dispatch[action](position);
        }
    };

    function toggleIfNewProjectSelected(value, label) {
        if (value === "new_project") {
            self.setButtonActivatedState("search_button", false);
            self.setButtonActivatedState("share_button", false);
            self.setButtonActivatedState("add_positions_button", false);
            self.setButtonActivatedState("manage_custom_fields", false);
            toggleNewProjectInput();
        }
    }

    function loadIfProjectSelected(value, label) {
        var access_type,
            i;

        if (value !== "new_project") {
            for (i = 0; self.projects && i < self.projects.length; i++) {
                access_type = self.projects[i].project_id === value ? self.projects[i].access_type : access_type;
            }
            _controller.selectProject(value, access_type);
        }
    }

    function handleAddProjectInputKeyboardEvent(e) {
        var dispatch;

        dispatch = {
            13: function() {
                _controller.addProject(jQuery(e.target).val());
            },
            27: function() {
                toggleNewProjectInput();
            }
        };

        if (dispatch[e.keyCode]) {
            dispatch[e.keyCode]();
        }
    }

    function toggleNewProjectInput() {
        var elements;

        elements = [sb_projectSelect.getRootEl(), newProjectShim];

        if (toggleNewProjectInput.flipped) {
            elements.reverse();
        }

        toggleNewProjectInput.flipped = !toggleNewProjectInput.flipped;

        jQuery(elements[0]).fadeToggle("fast", function() {
            jQuery(elements[1]).fadeToggle("fast");
        });
    }

    function handleAddPositionsClicked(value, label) {
        var dispatch;

        dispatch = {
            "single_position": _controller.showAddUpdatePosition,
            "batch_position_garmin": _controller.showAddPositionsFromGarmin
        };

        dispatch[value]();

        return true; // suppresses the rest of the click callback in the SelectBuilder instance
    }

    return self;
};

var LoginModalView = function(_modal, _controller) {
    var self;

    self = new BaseView();

    self.render = function() {
        var div,
            buttons,
            p,
            button_fr,
            button_en,
            button_es,
            br1,
            br2,
            default_language;

        function showUIComponentsByLanguageAndSetCookie(lang) {
            jQuery.cookie('default_language', lang);
            jQuery(buttons).hide();
            jQuery(p).html(sMap.get("welcome_message_" + lang));
            _modal.setButtons(null, {
                "text": sMap.get("button_login_" + lang),
                "click": _controller.redirectToLogin
            });
        }

        default_language = jQuery.cookie("default_language");

        div = document.createElement("div");
        buttons = document.createElement("div");
        p = document.createElement("p");
        br1 = document.createElement("br");
        br2 = document.createElement("br");

        button_en = document.createElement("a");
        button_en.href = "#";
        button_es = document.createElement("a");
        button_es.href = "#";
        button_fr = document.createElement("a");
        button_fr.href = "#";

        buttons.appendChild(button_en);
        buttons.appendChild(br1);
        buttons.appendChild(button_es);
        buttons.appendChild(br2);
        buttons.appendChild(button_fr);
        div.appendChild(buttons);
        div.appendChild(p);

        _modal.setDialogClass("welcome");
        _modal.setTitle(sMap.get("title_login"));
        _modal.setContents(div);
        _modal.setButtons(null, null);

        if (!default_language) {
            jQuery(button_en).button({label: sMap.get("EN_US")}).click(function(e) {
                showUIComponentsByLanguageAndSetCookie("EN_US");
                return false;
            });

            jQuery(button_es).button({label: sMap.get("ES_LA")}).click(function(e) {
                showUIComponentsByLanguageAndSetCookie("ES_LA");
                return false;
            });

            jQuery(button_fr).button({label: sMap.get("FR_FR")}).click(function(e) {
                showUIComponentsByLanguageAndSetCookie("FR_FR");
                return false;
            });
        }
        else {
            showUIComponentsByLanguageAndSetCookie(default_language);
        }
    };

    self.destroy = function() {
        self = null;
    };

    return self;
};

var ManagePositionFieldsModalView = function(_modal, _controller) {
    var self,
        tbl_positionFields,
        MAX_POSITION_PROPERTIES;

    self                    = new BaseView();
    self.positionFields     = null;
    self.projectId          = null;

    MAX_POSITION_PROPERTIES = 8;

    self.render = function() {
        var root,
            fb_fieldList,
            inputAndSelectWrapper,
            addCustomFieldWrapper,
            newCustomFieldShim,
            input_fieldName,
            sb_customFieldTypes,
            btn_addCustomPositionField;

        function toggleNewCustomFieldInput() {
            var elements;

            elements = [btn_addCustomPositionField, inputAndSelectWrapper];

            if (!inputAndSelectWrapper.style.display || inputAndSelectWrapper.style.display === "none")  {
                jQuery(inputAndSelectWrapper).find("input[name='name']").val("");
            }

            if (toggleNewCustomFieldInput.flipped) {
                elements.reverse();
            }

            toggleNewCustomFieldInput.flipped = !toggleNewCustomFieldInput.flipped;

            jQuery(elements[0]).fadeToggle("fast", function() {
                jQuery(elements[1]).fadeToggle("fast");
            });
        }

        function handleKeyboardEvent(e) {
            var dispatch;

            dispatch = {
                13: function() {
                    _controller.addCustomPositionField(fb_fieldList.getData());
                    toggleNewCustomFieldInput();
                },
                27: function() {
                    toggleNewCustomFieldInput();
                }
            };

            if (dispatch[e.keyCode]) {
                dispatch[e.keyCode]();
            }
        }

        root                         = document.createElement("div");
        addCustomFieldWrapper        = document.createElement("div");
        addCustomFieldWrapper.id     = "new_custom_field_shim";
        inputAndSelectWrapper        = document.createElement("div");
        inputAndSelectWrapper.id     = "new_custom_field_inputSelect_wrapper";
        newCustomFieldShim           = document.createElement("div");
        newCustomFieldShim.id        = "new_custom_field_input_shim";
        input_fieldName              = document.createElement("input");
        input_fieldName.type         = "text";
        input_fieldName.id           = "new_custom_field";
        newCustomFieldShim.className = "fake-text-wrapper";
        btn_addCustomPositionField           = document.createElement("a");
        btn_addCustomPositionField.href      = "redirect";
        btn_addCustomPositionField.onclick   = function() { return false; };

        sb_customFieldTypes = new SelectBuilder("field_type")
            .addOption("STRING", sMap.get("label_STRING"))
            .addOption("IMAGE_LIST", sMap.get("label_IMAGE_LIST"));

        fb_fieldList = new FormBuilder("field-list")
            .addTextField("name", sMap.get("name"), null, false, input_fieldName)
            .addDropDownField(sMap.get("type"), false, sb_customFieldTypes.build());

        tbl_positionFields = new TableBuilder([
            {
                key: "name",
                label: sMap.get("name"),
                formatter: function(el, colData) {
                    var s;

                    s = colData.indexOf("core_") > -1 ? sMap.get(colData) : colData;
                    el.appendChild(document.createTextNode(s));
                }
            },
            {
                key: "field_type",
                label: sMap.get("type"),
                formatter: function(el, data) {
                    el.appendChild(document.createTextNode(sMap.get("label_" + data)));
                }
            },
            {
                key: "visible",
                label: sMap.get("visible"),
                formatter: function(el, data) {
                    el.appendChild(document.createTextNode(sMap.get("visibility_label_" + data)));
                }
            },
            {
                key: "position_field_id",
                label: sMap.get("action"),
                formatter: function(el, colData, rowData, index, totalRecords) {
                    var up,
                        down,
                        del,
                        toggleVisible,
                        up_disabled,
                        down_disabled,
                        del_disabled;

                    up_disabled   = (rowData["name"].indexOf("core_icon") > -1) || (index === 0);
                    down_disabled = (rowData["name"].indexOf("core_icon") > -1) || (index === (totalRecords-1));
                    del_disabled  = (rowData["name"].indexOf("core_") > -1);
                    up            = document.createElement("button");
                    down          = document.createElement("button");
                    del           = document.createElement("button");
                    toggleVisible = document.createElement("button");
                    up.href       = "redirect";
                    down.href     = "redirect";
                    del.href      = "redirect";
                    toggleVisible.href = "redirect";
                    up.onclick    = function() { return false; };
                    down.onclick  = function() { return false; };
                    del.onclick   = function() { return false; };
                    toggleVisible.onclick   = function() { return false; };


                    jQuery(up).html(sMap.get("positionFields_moveUp")).addClass("small").button({
                        disabled: up_disabled,
                        icons: {
                            primary: "ui-icon-arrowthick-1-n"
                        },
                        text: false
                    }).click(colData, upCustomFieldClickHandler);

                    jQuery(down).html(sMap.get("positionFields_moveDown")).addClass("small").button({
                        disabled: down_disabled,
                        icons: {
                            primary: "ui-icon-arrowthick-1-s"
                        },
                        text: false
                    }).click(colData, downCustomFieldClickHandler);

                    jQuery(del).html(sMap.get("positionFields_delete")).addClass("small").button({
                        disabled: del_disabled,
                        icons: {
                            primary: "ui-icon-trash"
                        },
                        text: false
                    }).click(colData, deleteCustomFieldClickHandler);

                    jQuery(toggleVisible).html(sMap.get("positionFields_toggleVisibility")).addClass("small").button({
                        icons: {
                            primary: rowData.visible === "Y" ? "ui-icon-cancel" : "ui-icon-search"
                        },
                        text: false
                    }).click(colData, toggleVisibleClicked);

                    el.appendChild(up);
                    el.appendChild(down);
                    el.appendChild(del);
                    el.appendChild(toggleVisible);
                }
            }
        ], sMap.get("no_records_returned"));
        tbl_positionFields.id = "customFields";

        tbl_positionFields.setData(stripIconFieldAndReturnNew(self.positionFields));

        btn_addCustomPositionField.appendChild(document.createTextNode(sMap.get("button_add_custom_field")));

        jQuery(btn_addCustomPositionField).button({disabled: self.positionFields.length >= MAX_POSITION_PROPERTIES}).bind('mousedown', toggleNewCustomFieldInput);
        jQuery(root).bind('keyup', handleKeyboardEvent);

        newCustomFieldShim.appendChild(input_fieldName);
        inputAndSelectWrapper.appendChild(fb_fieldList.build());
        addCustomFieldWrapper.appendChild(btn_addCustomPositionField);
        addCustomFieldWrapper.appendChild(inputAndSelectWrapper);
        root.appendChild(addCustomFieldWrapper);
        root.appendChild(tbl_positionFields.build());

        _modal.setTitle(sMap.get("title_manage_custom_fields"));
        _modal.setContents(root);
        _modal.setButtons({
            "text": sMap.get("button_close"),
            "click": function() {
                _controller.endWorkflow();
            }
        }, null);
        _modal.setDialogClass("manageCustomFields");

        self.addRow = function(positionField) {
            self.positionFields.push(positionField);
            tbl_positionFields.addRow(positionField);
            if (self.positionFields.length >= MAX_POSITION_PROPERTIES) {
                jQuery(btn_addCustomPositionField).button({disabled: true});
            }
        };

        self.redrawTable = function() {
            tbl_positionFields.setData(stripIconFieldAndReturnNew(self.positionFields));
            root.appendChild(tbl_positionFields.rebuild());
        };

        self.deleteRow = function(positionFieldId) {
            var i;

            for (i = self.positionFields.length-1; i >= 0; i--) {
                if (self.positionFields[i].position_field_id === positionFieldId) {
                    Util.removeFromArray(self.positionFields, i);
                    break;
                }
            }

            if (self.positionFields.length <= MAX_POSITION_PROPERTIES) {
                jQuery(btn_addCustomPositionField).button({disabled: false});
            }

            self.redrawTable();
        };
    };

    self.destroy = function() {
        self = null;
    };

    function stripIconFieldAndReturnNew(positionFields) {
        var stripped;

        stripped = [];
        jQuery.each(positionFields, function(i, o) {
            if (o.name.indexOf("core_icon") === -1) {
                stripped.push(o);
            }
        });
        
        return stripped;
    }

    function deleteCustomFieldClickHandler(e) {
        var position_field_id;

        position_field_id = e.data;

        if (confirm(sMap.get("sure_want_delete_custom_position_property"))) {
            _controller.deleteCustomPositionField(position_field_id);
        }
    }

    function upCustomFieldClickHandler(e) {
        var pos,
            temp;

        pos = Util.findSubObjPosByPropAndValue(self.positionFields, "position_field_id", e.data);
        temp = self.positionFields[pos];
        self.positionFields[pos] = self.positionFields[pos-1];
        self.positionFields[pos-1] = temp;
        _controller.updatePositionFields(self.positionFields);
    }

    function downCustomFieldClickHandler(e) {
        var pos,
            temp;

        pos = Util.findSubObjPosByPropAndValue(self.positionFields, "position_field_id", e.data);
        temp = self.positionFields[pos];
        self.positionFields[pos] = self.positionFields[pos+1];
        self.positionFields[pos+1] = temp;
        _controller.updatePositionFields(self.positionFields);
    }

    function toggleVisibleClicked(e) {
        var pos;

        pos = Util.findSubObjPosByPropAndValue(self.positionFields, "position_field_id", e.data);
        self.positionFields[pos].visible = self.positionFields[pos].visible === "Y" ? "N" : "Y";
        _controller.updatePositionFields(self.positionFields);
    }

    return self;
};

var AddPositionsFromGarminModalView = function(_modal, _controller) {
    var self;

    self           = new BaseView();
    self.waypoints = null;

    self.render = function() {
        var i,
            len,
            sb_positionFieldsForNameMapping,
            sb_positionFieldsForElevMapping,
            fb_mapPositionFieldsToGarminFields,
            tbl_waypoints,
            wrapperEl,
            saveButton;

        wrapperEl = document.createElement("div");
        if (self.waypoints.length > 0) {
            saveButton = {
                "text": sMap.get("button_save"),
                "click": function() {
                    var o,
                        p,
                        mapNameFieldTo,
                        mapElevFieldTo;

                    o = {
                        "project_id": self.projectId,
                        "positions": []
                    };

                    mapNameFieldTo = fb_mapPositionFieldsToGarminFields.getData().position_field_for_name;
                    mapNameFieldTo = mapNameFieldTo !== "do_not_map_garmin_field" ? mapNameFieldTo : null;

                    mapElevFieldTo = fb_mapPositionFieldsToGarminFields.getData().position_field_for_elev;
                    mapElevFieldTo = mapElevFieldTo !== "do_not_map_garmin_field" ? mapElevFieldTo : null;

                    for (var i = 0, len = self.waypoints.length; i < len; i++) {
                        p = [
                            {
                                "name": "core_latitude",
                                "value": self.waypoints[i].lat
                            },
                            {
                                "name": "core_longitude",
                                "value": self.waypoints[i].lng
                            }
                        ];

                        if (mapNameFieldTo) {
                            p.push({
                                "name": mapNameFieldTo,
                                "value": self.waypoints[i].name
                            });
                        }

                        if (mapElevFieldTo) {
                            p.push({
                                "name": mapElevFieldTo,
                                "value": Number(self.waypoints[i].elev).toFixed(2).toString()
                            });
                        }

                        o.positions.push({
                            "position_properties": p
                        });
                    }

                    _controller.addPositions(o);
                }
            }
        }

        sb_positionFieldsForNameMapping = new SelectBuilder("position_field_for_name", false);
        sb_positionFieldsForElevMapping = new SelectBuilder("position_field_for_elev", false);

        if (self.customPositionFields.length > 0) {
            sb_positionFieldsForNameMapping.addOption("do_not_map_garmin_field", sMap.get("do_not_map_garmin_field"), true);
            sb_positionFieldsForElevMapping.addOption("do_not_map_garmin_field", sMap.get("do_not_map_garmin_field"), true);            

            for (i = 0, len = self.customPositionFields.length; i < len; i++) {
                sb_positionFieldsForNameMapping.addOption(self.customPositionFields[i].name, self.customPositionFields[i].name, false);
                sb_positionFieldsForElevMapping.addOption(self.customPositionFields[i].name, self.customPositionFields[i].name, false);
            }
        }
        else {
            sb_positionFieldsForNameMapping.addOption("do_not_map_garmin_field", sMap.get("no_mappable_field"), true);
            sb_positionFieldsForElevMapping.addOption("do_not_map_garmin_field", sMap.get("no_mappable_field"), true);
        }

        fb_mapPositionFieldsToGarminFields = new FormBuilder("field-list")
            .addDropDownField(sMap.get("map_garmin_name_field"), false, sb_positionFieldsForNameMapping.build())
            .addDropDownField(sMap.get("map_garmin_elev_field"), false, sb_positionFieldsForElevMapping.build());

        tbl_waypoints = new TableBuilder([
            {
                key: "name",
                label: sMap.get("name")
            },
            {
                key: "lat",
                label: sMap.get("latitude_DECIMAL")
            },
            {
                key: "lng",
                label: sMap.get("longitude_DECIMAL")
            },
            {
                key: "elev",
                label: sMap.get("elevation"),
                formatter: function(el, colData) {
                    el.appendChild(document.createTextNode(Number(colData).toFixed(2).toString()));
                }
            }
        ], sMap.get("no_waypoints_found_on_device"));

        tbl_waypoints.setData(self.waypoints);

        wrapperEl.appendChild(fb_mapPositionFieldsToGarminFields.build());
        wrapperEl.appendChild(tbl_waypoints.build());

        _modal.setTitle(sMap.get("import_multiple_positions_from_garmin"));
        _modal.setContents(wrapperEl);
        _modal.setButtons({
            "text": sMap.get("button_cancel"),
            "click": function() {
                _controller.endWorkflow();
            }
        }, saveButton);
        _modal.setDialogClass("importFromGarmin");
    };

    self.destroy = function() {

    };

    return self;
};

var UpdateUserSettingsModalView = function(_modal, _controller) {
    var self;

    self              = new BaseView();
    self.userSettings = null;

    self.render = function() {
        var fb_fieldList,
            sb_defaultLanguages,
            sb_defaultMeasurementSystems,
            sb_defaultGpsFormats,
            sb_defaultGoogleMapTypes,
            email,
            i,
            button_cancel;

        sb_defaultLanguages          = new SelectBuilder("default_language");
        sb_defaultMeasurementSystems = new SelectBuilder("default_measurement_system");
        sb_defaultGpsFormats         = new SelectBuilder("default_gps_format");
        sb_defaultGoogleMapTypes     = new SelectBuilder("default_google_map_type");

        for (i = 0; self.defaultLanguages && i < self.defaultLanguages.length; i++) {
            sb_defaultLanguages.addOption(self.defaultLanguages[i].value, self.defaultLanguages[i].label);
        }

        for (i = 0; self.defaultMeasurementSystems && i < self.defaultMeasurementSystems.length; i++) {
            sb_defaultMeasurementSystems.addOption(self.defaultMeasurementSystems[i].value, self.defaultMeasurementSystems[i].label);
        }

        for (i = 0; self.defaultGpsFormats && i < self.defaultGpsFormats.length; i++) {
            sb_defaultGpsFormats.addOption(self.defaultGpsFormats[i].value, self.defaultGpsFormats[i].label);
        }

        for (i = 0; self.defaultGoogleMapTypes && i < self.defaultGoogleMapTypes.length; i++) {
            sb_defaultGoogleMapTypes.addOption(self.defaultGoogleMapTypes[i].value, self.defaultGoogleMapTypes[i].label);
        }

        if (self.userSettings) {
            sb_defaultLanguages.setSelectedValue(self.userSettings['default_language']);
            sb_defaultMeasurementSystems.setSelectedValue(self.userSettings['default_measurement_system']);
            sb_defaultGpsFormats.setSelectedValue(self.userSettings['default_gps_format']);
            sb_defaultGoogleMapTypes.setSelectedValue(self.userSettings['default_google_map_type']);
            email = self.userSettings.email;
        }

        fb_fieldList = new FormBuilder("field-list")
            .addDropDownField(sMap.get("default_language"), false, sb_defaultLanguages.build())
            .addDropDownField(sMap.get("default_measurement_system"), false, sb_defaultMeasurementSystems.build())
            .addDropDownField(sMap.get("default_gps_format"), false, sb_defaultGpsFormats.build())
            .addDropDownField(sMap.get("default_google_map_type"), false, sb_defaultGoogleMapTypes.build());

        if (!self.userSettings["needs_to_update_settings"]) {
            button_cancel = {
                "text": sMap.get("button_cancel"),
                "click": function() {
                    _controller.endWorkflow();
                }
            };
        }

        _modal.setTitle(sMap.get("title_update_settings"));
        _modal.setContents(fb_fieldList.build());
        _modal.setButtons(button_cancel, {
            "text": sMap.get("button_save"),
            "click": function() {
                _controller.saveUserSettings(fb_fieldList.getData());
            }
        });
    };

    self.destroy = function() {

    };

    return self;
};

var AddUpdateProjectPermissionsModalView = function(_modal, _controller) {
    var self;

    self = new BaseView();

    self.projectAccess = null;

    function makeAccessContents() {
        var h,
            i;

        h = "";

        for (i = 0; i < self.projectAccess.length; i++) {
            if (self.projectAccess[i].access_type === "PUBLIC") {
                h += "<span class=\"access public\">" + sMap.get("access_PUBLIC") + "</span>"
            }
            else {
                h += "<span class=\"access email\">" + self.projectAccess[i].email + "</span>"
            }
        }

        return h;
    }

    function handleProjectAccessClicked(e) {
        var tgt,
            email,
            i;

        tgt = jQuery(e.target);
        if (tgt.get(0).nodeName.toLowerCase() === "span") {
            if (tgt.hasClass("email")) {
                email = tgt.text();
                for (i = 0; i < self.projectAccess.length; i++) {
                    if (self.projectAccess[i].email === email) {
                        _controller.removeProjectAccess(self.projectAccess[i].project_access_id);
                        break;
                    }
                }
            }
            else if (tgt.hasClass("public")) {
                for (i = 0; i < self.projectAccess.length; i++) {
                    if (self.projectAccess[i].access_type === "PUBLIC") {
                        _controller.removeProjectAccess(self.projectAccess[i].project_access_id);
                        break;
                    }
                }
            }
        }
    }

    function removeLineBreaks(e) {
        var tgt;

        tgt = jQuery(e.target);
        tgt.val(tgt.val().split("\n").join("").split(" ").join(""));
    }

    self.render = function() {
        var fb_fieldList,
            sb_accessType,
            sb_defaultLanguages,
            sb_defaultMeasurementSystems,
            sb_defaultGpsFormats,
            sb_defaultGoogleMapTypes,
            inviteLi,
            emailsLi,
            accessLi,
            i;

        function showAppropriateFieldsForAccessType(value) {
            if (value === "PUBLIC") {
                jQuery([inviteLi, emailsLi]).fadeOut("fast");
                _modal.setRightButtonText(sMap.get("button_self_send_link"));
            }
            else {
                jQuery([inviteLi, emailsLi]).fadeIn("fast");
                _modal.setRightButtonText(sMap.get("button_send_invite"));
            }
        }

        inviteLi                     = document.createElement("li");
        emailsLi                     = document.createElement("li");
        accessLi                     = document.createElement("li");
        sb_defaultLanguages          = new SelectBuilder("default_language", false);
        sb_defaultMeasurementSystems = new SelectBuilder("default_measurement_system", false);
        sb_defaultGpsFormats         = new SelectBuilder("default_gps_format", false);
        sb_defaultGoogleMapTypes     = new SelectBuilder("default_google_map_type", false);
        sb_accessType                = new SelectBuilder("access_type", false)
            .addOption("OWNER", sMap.get("access_OWNER"), true)
            .addOption("READONLY", sMap.get("access_READONLY"), false)
            .addOption("PUBLIC", sMap.get("access_PUBLIC"), false)
            .setPostSyncCallback(showAppropriateFieldsForAccessType);

        for (i = 0; self.defaultLanguages && i < self.defaultLanguages.length; i++) {
            sb_defaultLanguages.addOption(self.defaultLanguages[i].value, self.defaultLanguages[i].label);
        }

        for (i = 0; self.defaultMeasurementSystems && i < self.defaultMeasurementSystems.length; i++) {
            sb_defaultMeasurementSystems.addOption(self.defaultMeasurementSystems[i].value, self.defaultMeasurementSystems[i].label);
        }

        for (i = 0; self.defaultGpsFormats && i < self.defaultGpsFormats.length; i++) {
            sb_defaultGpsFormats.addOption(self.defaultGpsFormats[i].value, self.defaultGpsFormats[i].label);
        }

        for (i = 0; self.defaultGoogleMapTypes && i < self.defaultGoogleMapTypes.length; i++) {
            sb_defaultGoogleMapTypes.addOption(self.defaultGoogleMapTypes[i].value, self.defaultGoogleMapTypes[i].label);
        }

        jQuery(inviteLi).addClass("textarea").addClass("greeting").html("<label>" + sMap.get("invitation_message") + "</label><div class=\"fake-text-wrapper\"><div class=\"text hint\">" + sMap.get("hint_invitation_message") + "</div><textarea name=\"message\" rows=\"2\"></textarea></div>");
        jQuery(emailsLi).addClass("textarea").addClass("enter_emails").html("<label>" + sMap.get("enter_emails") + "</label><div class=\"fake-text-wrapper\"><div class=\"text hint\">" + sMap.get("hint_enter_emails") + "</div><textarea name=\"emails\" rows=\"2\"></textarea></div>").bind("keyup", removeLineBreaks);
        jQuery(accessLi).addClass("textarea").addClass("access").html("<label>" + sMap.get("existing_collaborators") + "</label><div class=\"fake-text-wrapper\"><div class=\"access-list\">" + makeAccessContents() + "</div></div>");

        fb_fieldList = new FormBuilder("field-list")
            .addCustomPositionField(accessLi, true)
            .addDropDownField(sMap.get("access_type"), false, sb_accessType.build())
            .addDropDownField(sMap.get("default_language"), false, sb_defaultLanguages.build())
            .addDropDownField(sMap.get("default_measurement_system"), false, sb_defaultMeasurementSystems.build())
            .addDropDownField(sMap.get("default_gps_format"), false, sb_defaultGpsFormats.build())
            .addDropDownField(sMap.get("default_google_map_type"), false, sb_defaultGoogleMapTypes.build())
            .addCustomPositionField(inviteLi, true)
            .addCustomPositionField(emailsLi, true);

        jQuery(accessLi).click(handleProjectAccessClicked);

        _modal.setTitle(sMap.get("title_share"));
        _modal.setContents(fb_fieldList.build());
        _modal.setButtons({
            "text": sMap.get("close"),
            "click": function() {
                _controller.endWorkflow();
            }
        }, {
            "text": sMap.get("button_send_invite"),
            "click": function() {
                handleSendInviteClicked(fb_fieldList.getData());
            }
        });

        self.redrawPermissionsControl = function() {
            jQuery(accessLi).find(".access-list").html(makeAccessContents());
        };
    };

    self.destroy = function() {

    };

    function handleSendInviteClicked(o) {
        o.emails     = jQuery.unique(o.emails.split("\n").join("").split(" ").join("").split(","));
        o.project_id = self.projectId;
        o.message = o.access_type === "PUBLIC" ? sMap.get("self_send_message") : o.message;
        _controller.addProjectAccess(o);
    }

    return self;
};

var AddUpdatePositionCoreFieldsModalView = function(_modal, _controller) {
    var self,
        userSettings,
        position,
        formData;

    self = new BaseWizardView();
    formData = {};
    
    self.setUserSettings = function(o) {
        userSettings = o;
    };
    
    self.setPosition = function(o) {
        position = o;
        formData = o || formData;
    };

    function createIconField() {
        var iconField,
            iconFieldLabel,
            hidden,
            icon_default;

        icon_default   = Util.getSubObjByPropAndValue(formData["position_properties"], "name", "core_icon");
        icon_default   = icon_default ? icon_default["value"] : null;
        iconField      = document.createElement("li");
        iconFieldLabel = document.createElement("label");
        hidden         = document.createElement("input");
        hidden.type    = "hidden";
        hidden.name    = "core_icon";
        iconFieldLabel.appendChild(document.createTextNode(sMap.get("core_icon")));
        iconField.appendChild(iconFieldLabel);
        iconField.appendChild(hidden);
        jQuery(iconField).append("<ul class=\"icons\"><li><img src=\"http://google-maps-icons.googlecode.com/files/police.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/postal.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/customs.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/powerlinepole.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/communitycentre.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/factory.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/bank.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/powersubstation.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/mine.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/atm.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/billiard.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/cinema.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/museum.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/museum-naval.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/museum-historical.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/music-classical.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/themepark.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/bullfight.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/walking-tour.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/bus-tour.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/university.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/school.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/fire.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/strike.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/home.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/family.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/photo.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/bar.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/winery.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/coffee.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/restaurant.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/restaurantmexican.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/vegetarian.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/hotel.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/firstaid.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/ophthalmologist.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/doctor.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/dentist.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/basketball.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/soccer2.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/stadium.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/baseball.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/mountainbike.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/motorbike.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/climbing.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/horseriding.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/gym.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/swim-outdoor.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/clothes-male.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/supermarket.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/bookstore.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/tailor.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/dolphins.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/beautiful.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/waterfall.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/ruins.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/church2.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/cemetary.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/corral.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/fountain.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/pyramid-southam.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/campingsite.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/fireworks.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/museum-science.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/petroglyphs.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/gazstation.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/taxi.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/bus.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/airport.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/tram.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/accident.png\"></li>"
        + "<li><img src=\"http://google-maps-icons.googlecode.com/files/zoo.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-a.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-b.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-c.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-d.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-e.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-f.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-g.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-h.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-i.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-j.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-k.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-l.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-m.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-n.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-o.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-p.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-q.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-r.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-a-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-b-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-c-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-d-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-e-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-f-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-g-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-h-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-i-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-j-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-k-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-l-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-m-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-n-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-o-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-p-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-q-trans.png\"></li>"
        + "<li><img src=\"http://simplemappingsystem.com/static/img/dot-r-trans.png\"></li>"

        + "</ul>");

        if (icon_default) {
            hidden.value = icon_default;
            jQuery(iconField).find("img[src='" + icon_default + "']").parent().addClass("selected");
        }

        jQuery(iconField).click(function(e) {
            var tgt,
                img;

            tgt = e.target;
            tgt = tgt.nodeName.toLowerCase() === "img" ? tgt.parentNode : tgt;
            if (tgt.nodeName.toLowerCase() === "li") {
                jQuery(iconField).find(".selected").removeClass("selected");
                jQuery(tgt).addClass("selected");
                img = jQuery(tgt).find("img").get(0);
                jQuery(hidden).val(img.src);
            }
        });

        return iconField;        
    }

    self.render = function() {
        var dispatch,
            i,
            lat_key,
            lon_key,
            sb_latitude,
            sb_longitude,
            sb_hemisphere,
            fb_fieldList,
            latitude_default,
            longitude_default,
            icon_default;

        fb_fieldList = new FormBuilder("field-list");

        lat_key = "latitude_" + userSettings['default_gps_format'];
        lon_key = "longitude_" + userSettings['default_gps_format'];

        latitude_default  = Util.getSubObjByPropAndValue(formData["position_properties"], "name", "core_latitude");
        latitude_default  = latitude_default ? parseFloat(latitude_default["value"], 10) : null;
        longitude_default = Util.getSubObjByPropAndValue(formData["position_properties"], "name", "core_longitude");
        longitude_default = longitude_default ? parseFloat(longitude_default["value"], 10) : null;

        dispatch = {
            "DEGREE": function() {
                sb_latitude = new SelectBuilder(lat_key + "_direction", false)
                    .addOption("N", sMap.get("label_N"), latitude_default > 1)
                    .addOption("S", sMap.get("label_S"), !(latitude_default > 1));

                sb_longitude = new SelectBuilder(lon_key + "_direction", false)
                    .addOption("W", sMap.get("label_W"), !(longitude_default > 1))
                    .addOption("E", sMap.get("label_E"), longitude_default > 1);

                fb_fieldList.addDmsLatitudeField(lat_key, sMap.get(lat_key), latitude_default, false, sb_latitude.build())
                    .addDmsLongitudeField(lon_key, sMap.get(lon_key), longitude_default, false, sb_longitude.build());
            },
            "DECIMAL": function() {
                fb_fieldList.addTextField(lat_key, sMap.get(lat_key), latitude_default, false, null, latitudeValidator)
                    .addTextField(lon_key, sMap.get(lon_key), longitude_default, false, null, longitudeValidator);
            },
            "UTMWGS84": function() {
                fb_fieldList.addUtmField("utm", sMap.get("label_UTMWGS84"), {
                    "core_latitude": latitude_default,
                    "core_longitude": longitude_default
                }, true);
            }
        };

        dispatch[userSettings.default_gps_format]();

        fb_fieldList.addCustomPositionField(createIconField(), true);

        _modal.setTitle(sMap.get("title_add_position"));
        _modal.setContents(fb_fieldList.build());
        _modal.setButtons(self.makeLeftButtonForWizard(_controller), self.makeRightButtonForWizard(_controller));

        self.getData = function() {
            var tempData,
                dispatch,
                latitudeDD,
                longitudeDD;

            if (fb_fieldList) {
                tempData = fb_fieldList.getData();

                dispatch = {
                    "DEGREE": {
                        "core_latitude": function() {
                            return Util.convertDMStoDD(tempData["latitude_DEGREE_direction"], parseInt(tempData["latitude_DEGREE_degree"], 10), parseInt(tempData["latitude_DEGREE_minute"], 10), parseFloat(tempData["latitude_DEGREE_second"]));
                        },
                        "core_longitude": function() {
                            return Util.convertDMStoDD(tempData["longitude_DEGREE_direction"], parseInt(tempData["longitude_DEGREE_degree"], 10), parseInt(tempData["longitude_DEGREE_minute"], 10), parseFloat(tempData["longitude_DEGREE_second"]));
                        }
                    },
                    "DECIMAL": {
                        "core_latitude": function() {
                            return tempData["latitude_DECIMAL"];
                        },
                        "core_longitude": function() {
                            return tempData["longitude_DECIMAL"];
                        }
                    },
                    "UTMWGS84": {
                        "core_latitude": function() {
                            var ll;

                            ll = new LL(parseFloat(tempData.utm_x), parseFloat(tempData.utm_y), tempData.utm_lonZone, tempData.utm_hemisphere);
                            return ll.latitude;
                        },
                        "core_longitude": function() {
                            var ll;

                            ll = new LL(parseFloat(tempData.utm_x), parseFloat(tempData.utm_y), tempData.utm_lonZone, tempData.utm_hemisphere);
                            return ll.longitude;
                        }
                    }
                };

                formData =  {
                    "position_properties": [
                        {
                            "name": "core_latitude",
                            "value": dispatch[userSettings["default_gps_format"]]["core_latitude"]().toString()
                        },
                        {
                            "name": "core_longitude",
                            "value": dispatch[userSettings["default_gps_format"]]["core_longitude"]().toString()
                        },
                        {
                            "name": "core_icon",
                            "value": tempData["core_icon"]
                        }
                    ]
                };
            }
            
            return formData;
        };

        self.destroy = function() {
            formData     = self.getData();
            sb_latitude  = null;
            sb_longitude = null;
            fb_fieldList = null;
        };

        self.isValid = function() {
            return fb_fieldList.isValid();
        };

        function longitudeValidator(o) {
            var isValid,
                result;

            isValid = true;

            result = Validate.isValidLongitude(o.value);
            if (!result.valid) {
                isValid = false;
                Util.callOut(o.el, result.messages);
            }

            return isValid;
        }

        function latitudeValidator(o) {
            var isValid,
                result;

            isValid = true;

            result = Validate.isValidLatitude(o.value);
            if (!result.valid) {
                isValid = false;
                Util.callOut(o.el, result.messages);
            }

            return isValid;
        }
    };

    return self;
};

var AddUpdatePositionCustomFieldsModalView = function(_modal, _controller) {
    var self,
        projectId,
        customPositionFields,
        position,
        formData;

    self = new BaseWizardView();
    formData = {};

    self.setCustomPositionFields = function(o) {
        customPositionFields = o;
    };

    self.setProjectId = function(n) {
        projectId = n;
    };

    self.setPosition = function(o) {
        position = o;
        formData = o || formData;
    };

    self.render = function() {
        var fb_fieldList,
            default_value,
            dispatch;

        fb_fieldList = new FormBuilder("field-list");

        dispatch = {
            "STRING": fb_fieldList.addTextField,
            "IMAGE": fb_fieldList.addSingleImageField,
            "IMAGE_LIST": fb_fieldList.addMultiImageField
        };

        for (var i = 0; i < customPositionFields.length; i++) {
            default_value = Util.getSubObjByPropAndValue(formData["position_properties"], "name", customPositionFields[i].name);
            default_value = default_value ? default_value["value"] : null;
            dispatch[customPositionFields[i]['field_type']](customPositionFields[i].name, customPositionFields[i].name, default_value, false);
        }

        _modal.setTitle(sMap.get("title_add_position"));
        _modal.setContents(fb_fieldList.build());
        _modal.setButtons(self.makeLeftButtonForWizard(_controller), self.makeRightButtonForWizard(_controller));

        self.getData = function() {
            var key,
                i,
                len,
                o;

            if (fb_fieldList) {
                o = fb_fieldList.getData();

                formData = {
                    "position_properties": []
                };

                for (key in o) {
                    if (o.hasOwnProperty(key)) {
                        if (o[key]) {
                            formData["position_properties"].push({
                                name: key,
                                value: o[key]
                            });
                        }
                    }
                }    
            }
            
            return formData;
        };

        self.destroy = function() {
            formData = self.getData();
            fb_fieldList = null;
        };
    };

    return self;
};

////////////////////
// CONTROLLERS

var BasePageController = function() {
    var self;

    self = {};

    self.start = function() {
        Util.handleError("Error: whomever extends BasePageController must implement self.start method");
    };

    self.end = function() {
        self.view.destroy();
    };

    self.restart = function() {
        self.end();
        self.start();
    };

    return self;
};

var BaseSingleViewModalController = function(_modal) {
    var self;

    self = {};

    self.startWorkflow = function() {
        _modal.displayView(self.view);
        _modal.open();
    };

    self.endWorkflow = function() {
        _modal.destroyContents();
        _modal.close();
    };

    self.handleLeftButtonClicked = function(view) {
        self.endWorkflow();
    };

    self.getLeftButtonKey = function() {
        return "close";
    };

    self.getRightButtonKey = function() {
        return "save";
    };

    return self;
};

var BaseWizard = function(_modal) {
    var self,
        workflowOffset,
        workflow;

    self           = {};
    workflowOffset = 0;
    workflow       = null;

    self.startWorkflow = function() {
        var i;

        workflowOffset = 0;
        workflow = self.getWorkflowDefinition(); // defined in the controller
        displayWorkflowView();
        _modal.open();
    };

    self.getLeftButtonKey = function(view) {
        if (!!workflow[workflowOffset].leftButtonKey.call) {
            return workflow[workflowOffset].leftButtonKey();
        }
        else {
            return workflow[workflowOffset].leftButtonKey;
        }
    };

    self.getRightButtonKey = function(view) {
        if (!!workflow[workflowOffset].rightButtonKey.call) {
            return workflow[workflowOffset].rightButtonKey();
        }
        else {
            return workflow[workflowOffset].rightButtonKey;
        }
    };

    self.endWorkflow = function() {
        _modal.destroyContents();
        _modal.close();
    };

    self.handleLeftButtonClicked = function(view) {
        if (workflowOffset === 0) {
            self.endWorkflow();
        }
        else {
            workflowOffset--;
            displayWorkflowView();
        }
    };

    self.handleRightButtonClicked = function(view) {
        workflow[workflowOffset].onRightButtonClicked(view);
    };

    self.showErrors = function(json) {
        workflow[workflowOffset].view.showErrors(json);
    };

    self.showNextView = function() {
        if (workflowOffset < (workflow.length - 1)) {
            workflowOffset++;
            displayWorkflowView();
        }
        else {
            Util.handleError('showNextView() - cannot advance past offset ' + workflowOffset);
        }
    };

    self.getWorkflow = function(offset) {
        return workflow[offset];
    };

    self.getWorkflowPosForView = function(view) {
        for (var i = 0; i < workflow.length; i++) {
            if (workflow[i].view === view) {
                return i;
            }
        }

        return -1;
    };

    function displayWorkflowView() {
        _modal.displayView(workflow[workflowOffset].view);
    }

    return self;
};

var LoginModalController = function(_modal) {
    var self;

    self = new BaseSingleViewModalController(_modal);
    self.view = new LoginModalView(_modal, self);

    self.cancelLogin = function() {
        self.endWorkflow();
    };

    self.redirectToLogin = function() {
        window.location.href = "/login";
    };

    return self;
};

var ManagePositionFieldsModalController = function(_service, _modal) {
    var self;

    self                    = new BaseSingleViewModalController(_modal);
    self.view               = new ManagePositionFieldsModalView(_modal, self);
    self.projectId          = null;

    self.startWorkflow = function() {
        _modal.displayView(self.view);
        _modal.open();
    };

    self.addCustomPositionField = function(data) {
        function onSuccess(o) {
            self.view.addRow(o.position_field);
        }

        function onFailure(o) {
            alert(JSON.stringify(o));
        }

        data["project_id"] = self.projectId;
        _service.addCustomPositionProperty(data, onSuccess, onFailure);
    };

    self.deleteCustomPositionField = function(position_field_id) {
        var data;

        function onSuccess(o) {
            self.view.deleteRow(position_field_id);
        }

        function onFailure(o) {
            alert(JSON.stringify(o));
        }

        data = {
            "position_field_id": position_field_id
        };

        _service.deleteCustomPositionField(data, onSuccess, onFailure);
    };

    self.updatePositionFields = function(position_fields) {
        var data;

        function onSuccess(o) {
            self.view.redrawTable();
        }

        function onFailure(o) {
            alert(JSON.stringify(o));
        }

        data = {
            "position_fields": position_fields
        };

        _service.updatePositionFields(data, onSuccess, onFailure);
    };

    return self;
};

var UpdateUserSettingsModalController = function(_service, _modal) {
    var self;

    self              = new BaseSingleViewModalController(_modal);
    self.view         = new UpdateUserSettingsModalView(_modal, self);
    self.userSettings = null;

    self.startWorkflow = function() {
        _service.getDefaultLanguages({}, function(o) {
            self.view.defaultLanguages = o.default_languages;
            _service.getDefaultMeasurementSystems({}, function(o) {
                self.view.defaultMeasurementSystems = o.default_measurement_systems;
                _service.getDefaultGpsFormats({}, function(o) {
                    self.view.defaultGpsFormats = o.default_gps_formats;
                    _service.getDefaultGoogleMapTypes({}, function(o) {
                        self.view.defaultGoogleMapTypes = o.default_google_map_types;
                        self.view.userSettings = self.userSettings;
                        _modal.displayView(self.view);
                        _modal.open();
                    });
                });
            });
        });
    };

    self.saveUserSettings = function(data) {
        function onSuccess() {
            self.endWorkflow();
        }

        function onFailure(o) {
            throw(o);
        }

        _service.updateUserSettings(data, onSuccess, onFailure);
    };

    return self;
};

var AddPositionsFromGarminController = function(_service, _modal) {
    var self;

    self                = new BaseSingleViewModalController(_modal);
    self.view           = new AddPositionsFromGarminModalView(_modal, self);

    self.startWorkflow = function() {
        _service.getWaypointsFromGarminDevice(null, function(o) {
            self.view.waypoints = o.waypoints;
            _modal.displayView(self.view);
            _modal.open();
        }, function(o) {
            alert(o);
        });
    };

    self.addPositions = function(data) {
        _service.addPositions(data, function() {
            self.endWorkflow();
            self.onAddPositionsSuccessCallback();
        }, function(o) {            
            alert(JSON.stringify(o));
        });
    };

    return self;
};

var AddUpdatePositionController = function(_service, _modal) {
    var self,
        workflowDef,
        super_startWorkflow;

    self                          = new BaseWizard(_modal);
    self.coreFieldsView           = new AddUpdatePositionCoreFieldsModalView(_modal, self);
    self.customFieldsView         = new AddUpdatePositionCustomFieldsModalView(_modal, self);
    self.customPositionFields     = null;
    self.position                 = null;
    self.projectId                = null;
    self.userSettings             = null;
    super_startWorkflow           = self.startWorkflow;

    function setUpDataAndPersist(formattedUserInputData) {
//        var i,
//            j,
//            len,
//            len2;

        formattedUserInputData.project_id = self.projectId;
        if (self.position) {
            formattedUserInputData.position_id = self.position.position_id;
//            NOTE: For now, we just delete the position and add it again on the server
//            len  = self["position"]["position_properties"].length;
//            len2 = formattedUserInputData["position_properties"].length;
//            for (i = 0; i < len; i++) {
//                for (j = 0; j < len2; j++) {
//                    if (self["position"]["position_properties"][i]["name"] === formattedUserInputData["position_properties"][j]["name"]) {
//                        delete formattedUserInputData["position_properties"][j]["name"];
//                        formattedUserInputData["position_properties"][j]["property_id"] = self["position"]["position_properties"][i]["property_id"]
//                    }
//                }
//            }
            updatePosition(formattedUserInputData);
        }
        else {
            addPosition(formattedUserInputData);
        }
    }

    workflowDef = [
        {
            'leftButtonKey'        : 'close',
            'rightButtonKey'       : function() {
                return self.customPositionFields && self.customPositionFields.length > 0 ? 'next' : 'done';
            },
            'view'                 : self.coreFieldsView,
            'onRightButtonClicked' : function(coreFieldData) {
                if (self.coreFieldsView.isValid()) {
                    if (self.customPositionFields && self.customPositionFields.length > 0) {
                        self.showNextView();
                    }
                    else {
                        setUpDataAndPersist(coreFieldData);
                    }
                }
            }
        },
        {
            'leftButtonKey'        : 'back',
            'rightButtonKey'       : 'done',
            'view'                 : self.customFieldsView,
            'onRightButtonClicked' : function(customFieldData) {
                var o;

                o = self.coreFieldsView.getData();
                o["position_properties"] = jQuery.merge(o["position_properties"], customFieldData["position_properties"]);
                setUpDataAndPersist(o);
            }
        }
    ];

    function updatePosition(position) {
        _service.updatePosition(position, function(o) {
            self.endWorkflow();
            self.onUpdatePositionSuccessCallback(o);
        }, function(o) {
            alert(JSON.stringify(o));
        });
    }

    function addPosition(coreAndCustomFieldData) {
        function onSuccess(o) {
            self.endWorkflow();
            self.onAddPositionSuccessCallback(o);
        }

        function onFailure(o) {
            throw(o);
        }

        coreAndCustomFieldData.project_id = self.projectId;

        _service.addPosition(coreAndCustomFieldData, onSuccess, onFailure);
    }

    self.getWorkflowDefinition = function() {
        return workflowDef;
    };

    self.startWorkflow = function() {
        // get user config so that we show AddPositionCoreFieldsModalView in the right
        // format, or set the position object so that we know what stuff to show in
        // each view, then start the wizard
        if (!self.projectId) {
            Util.handleError("self.projectId must be assigned before you can use this controller");
        }
        self.coreFieldsView.setUserSettings(self.userSettings);
        self.coreFieldsView.setPosition(self.position);
        self.customFieldsView.setProjectId(self.projectId);
        self.customFieldsView.setCustomPositionFields(self.customPositionFields);
        self.customFieldsView.setPosition(self.position);
        super_startWorkflow();
    };

    return self;
};

var AddUpdateProjectPermissionsController = function(_service, _modal) {
    var self;

    self               = new BaseSingleViewModalController(_modal);
    self.view          = new AddUpdateProjectPermissionsModalView(_modal, self);
    self.projectId     = null;
    self.projectAccess = null;

    self.startWorkflow = function() {
        self.view.projectAccess = self.projectAccess;
        self.view.projectId = self.projectId;

        _service.getDefaultLanguages({}, function(o) {
            self.view.defaultLanguages = o.default_languages;
            _service.getDefaultMeasurementSystems({}, function(o) {
                self.view.defaultMeasurementSystems = o.default_measurement_systems;
                _service.getDefaultGpsFormats({}, function(o) {
                    self.view.defaultGpsFormats = o.default_gps_formats;
                    _service.getDefaultGoogleMapTypes({}, function(o) {
                        self.view.defaultGoogleMapTypes = o.default_google_map_types;
                        _modal.displayView(self.view);
                        _modal.open();
                    });
                });
            });
        });
    };

    self.removeProjectAccess = function(projectAccessId) {
        _service.deleteProjectAccess({
            project_access_id: projectAccessId
        }, function(o) {
            Util.deleteSubObjByPropAndValue(self.projectAccess, "project_access_id", projectAccessId);
            self.view.projectAccess = self.projectAccess;
            self.view.redrawPermissionsControl();
        }, function(o) {

        });
    };

    self.addProjectAccess = function(userInput) {
        _service.addProjectAccess(userInput, function(o) {
            self.projectAccess = jQuery.merge(self.projectAccess, o.project_access);
            self.view.projectAccess = self.projectAccess;
            self.view.redrawPermissionsControl();
        },
        function(o) {
            alert(JSON.stringify(o));
        });
    };

    return self;
};

var LandingPageBaseController = function(_service, _modal, _container) {
    var self,
        searchKeyword;

    self      = new BasePageController();
    self.view = new LandingPagePublicView(_container, self);

    self.setSearchKeyword = function(keyword) {
        searchKeyword = keyword;
    };

    self.start = function() {
        self.view.projectId = self.projectId;
        self.view.userSettings = self.userSettings;
        self.view.render();
        searchKeyword = null;
        self.searchPositions();
    };

    self.searchPositions = function() {
        _service.searchPositions({
            "project_id" : self.projectId,
            "keyword": searchKeyword || ""
        }, function(o) {
            self.view.resetMap();
            self.view.drawPositions(o.positions);
        }, function(o) {
            alert(JSON.stringify(o));
        });
    };

    return self;
};

var LandingPageController = function(_service, _modal, _container) {
    var self,
        mc;

    self = new LandingPageBaseController(_service, _modal, _container);
    self.view = new LandingPagePrivateView(_container, self);

    self.start = function() {
        self.view.userId = self.userId;

        if (!self.userId) {
            mc = new LoginModalController(_modal);
            mc.startWorkflow();
            self.view.render();
        }
        else {
            _service.getProjects({}, function(projects) {
                self.view.projects = projects;
                _service.userMustEnterSettings({}, function(o) {
                    self.userSettings      = o;
                    self.view.userSettings = o;
                    self.view.render();
                    if (o && o["needs_to_update_settings"] === true) {
                        mc                   = new UpdateUserSettingsModalController(_service, _modal);
                        mc.userSettings      = o;
                        mc.saveUserSettings  = getOnUpdateUserSettingsFunction(mc);
                        mc.startWorkflow();
                    }
                });
            });
        }
    };

    self.showUpdateSettings = function() {
        _service.getUserSettings({"user_id": self.userId}, function(o) {
            mc                = new UpdateUserSettingsModalController(_service, _modal);
            mc.userSettings   = o;
            self.userSettings = o;

            mc.saveUserSettings = getOnUpdateUserSettingsFunction(mc);
            mc.startWorkflow();
        });
    };

    self.showManagePositionFields = function() {
        var d;

        d = {
            "user_id": self.userId,
            "project_id": self.projectId
        };

        _service.getPositionFields(d, function(o) {
            var superEndWorkflow;

            mc                     = new ManagePositionFieldsModalController(_service, _modal);
            mc.view.positionFields = o["position_fields"];
            mc.projectId           = self.projectId;
            superEndWorkflow       = mc.endWorkflow;
            mc.endWorkflow         = function() {
                superEndWorkflow();
                self.searchPositions();
            };
            mc.startWorkflow();
        });
    };

    self.showAddUpdatePosition = function(position) {
        var d;

        d = {
            "user_id": self.userId,
            "project_id": self.projectId
        };

        _service.getCustomPositionFields(d, function(o) {
            mc                          = new AddUpdatePositionController(_service, _modal);
            mc.projectId                = self.projectId;
            mc.userSettings             = self.userSettings;
            mc.position                 = position;
            mc.customPositionFields = o["position_fields"];
            mc.startWorkflow();
            mc.onAddPositionSuccessCallback = function(position) {
                self.view.drawSinglePosition(position, true);
            };
            mc.onUpdatePositionSuccessCallback = function(position) {
                self.view.removePositionById(position.position_id);
                self.view.drawSinglePosition(position, true);
            };
        });
    };

    self.showAddPositionsFromGarmin = function() {
        var d;

        d = {
            "user_id": self.userId,
            "project_id": self.projectId,
            "suppress_field_types": ["NUMBER", "IMAGE", "IMAGE_LIST"]
        };

        _service.getCustomPositionFields(d, function(o) {
            mc                           = new AddPositionsFromGarminController(_service, _modal);
            mc.view.projectId            = self.projectId;
            mc.view.customPositionFields = o["position_fields"];
            mc.startWorkflow();
            mc.onAddPositionsSuccessCallback = function(position) {
                self.setSearchKeyword(null);
                self.searchPositions();
            };
        });
    };

    self.showShareProject = function() {
        mc                          = new AddUpdateProjectPermissionsController(_service, _modal);
        mc.projectId                = self.projectId;
        _service.getProjectAccess({ project_id: self.projectId }, function(o) {
            mc.projectAccess = o["project_access"];
            mc.startWorkflow();
        });
    };

    self.logOut = function() {
        window.location.href = "/logout";
    };

    self.addProject = function(projectName) {
        _service.addProject({"name": projectName}, function(o) {
            self.view.projects.push({
                project_id: o.project.project_id,
                access_type: "OWNER"
            });
            self.view.addNewProjectToSelectAndHideInput(o.project.project_id, projectName);
            self.selectProject(o.project.project_id, "OWNER");
        }, function(o) {

        });
    };

    self.selectProject = function(projectId, access_type) {
        var fullControl;

        fullControl    = access_type === "OWNER";
        self.projectId = projectId;

        self.setSearchKeyword(null);
        self.searchPositions();
        self.view.setButtonActivatedState("search_button", true);
        self.view.setButtonActivatedState("share_button", fullControl);
        self.view.setButtonActivatedState("add_positions_button", fullControl);
        self.view.setButtonActivatedState("manage_custom_fields", fullControl);
        self.view.setMouseControlsActivatedState(fullControl);
        self.view.setInfowindowControlsActivatedState(fullControl);
    };

    self.updatePositionByDragAndDrop = function(position) {
        _service.updatePosition(position, function(o) {
            // deliberately blank - we are only editing the lat and lon
        }, function(o) {
            alert(JSON.stringify(o));
        });
    };

    self.deletePosition = function(positionId) {
        _service.deletePosition({
            position_id: positionId
        }, function(o) {
            self.view.removePositionById(positionId);
        }, function(o) {
            alert(JSON.stringify(o));
        });
    };

    function getOnUpdateUserSettingsFunction(controller) {
        return function(o) {
            _service.updateUserSettings(o, function() {
                controller.endWorkflow();
                jQuery.cookie("default_language", o.default_language);
                window.location.reload(true);
            }, function() {
                throw(o);
            });
        };
    }

    return self;
};

////////////////////////////////////////////////////////
//  Service  //
///////////////

var Service = function(userId, proxy) {
    var self;

    self = {};

    self.garminDomain = null;
    self.garminKey    = null;

    function ajax(method, url, data, successCallback, failureCallback) {
        jQuery.ajax({
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json",
            error: function(jqXHR, textStatus, errorThrown) {
                Util.handleError(errorThrown);
            },
            success: function(data, textStatus, jqXHR) {
                var status,
                    func;

                status = {
                    "success": successCallback,
                    "failure": failureCallback
                };

                func = status[data["status"]] ? status[data["status"]] : status["failure"];
                func(data);
            },
            type: method,
            url: url
        });
    }

    function dispenseHandler(success, failure) {
        return function() {
            var args = Array.prototype.slice.call(arguments),
                err  = args[0];

            if (err === null) {
                success.apply(null, args.slice(1, args.length));
            }
            else {
                failure.call(null, err);
            }
        }
    };

    function ajaxPost(url, data, successCallback, failureCallback) {
        ajax("POST", url, data, successCallback, failureCallback);
    }

    self.getPositionFields = function(data, s, f) {
        ajaxPost("/api/get_position_fields", data, s, f);
    };

    self.getCustomPositionFields = function(data, s, f) {
        data["suppress_core_fields"] = true;
        ajaxPost("/api/get_position_fields", data, s, f);
    };

    self.deletePosition = function(data, s, f) {
        ajaxPost("/api/delete_position", data, s, f);
    };

    self.updatePosition = function(data, s, f) {
        ajaxPost("/api/update_position", data, s, f);
    };

    self.searchPositions = function(data, s, f) {
        ajaxPost("/api/search_positions", data, s, f);
    };

    self.addProject = function(data, s, f) {
        ajaxPost("/api/add_project", data, s, f);
    };

    self.userMustEnterSettings = function(data, s, f) {
        ajaxPost("/api/get_user_settings", data, s, f);
    };

    self.getUserSettings = function(data, s, f) {
        ajaxPost("/api/get_user_settings", data, s, f);
    };

    self.updateUserSettings = function(data, s, f) {
        proxy.update_user_settings(userId, data["default_language"], data["default_gps_format"], data["default_measurement_system"], data["default_google_map_type"], dispenseHandler(s, f));
    };

    self.addPosition = function(data, s, f) {
        ajaxPost("/api/add_position", data, s, f);
    };

    self.getProjects = function(data, s, f) {
        proxy.get_projects(userId, dispenseHandler(s, f));
    };

    self.updatePositionFields = function(data, s, f) {
        ajaxPost("/api/update_position_fields", data, s, f);
    };

    self.addCustomPositionProperty = function(data, s, f) {
        ajaxPost("/api/add_position_field", data, s, f);
    };

    self.deleteCustomPositionField = function(data, s, f) {
        ajaxPost("/api/delete_position_field", data, s, f);
    };

    self.getProjectAccess = function(data, s, f) {
        ajaxPost("/api/get_project_access", data, s, f);
    };

    self.deleteProjectAccess = function(data, s, f) {
        ajaxPost("/api/delete_project_access", data, s, f);
    };

    self.addProjectAccess = function(data, s, f) {
        ajaxPost("/api/add_project_access", data, s, f);
    };

    self.addPositions = function(data, s, f) {
        ajaxPost("/api/add_positions", data, s, f);
    };

    self.getDefaultLanguages = function(data, s, f) {
        s({
            status: "success",
            default_languages: [
                {
                    label: sMap.get("EN_US"),
                    value: "EN_US"
                },
                {
                    label: sMap.get("ES_LA"),
                    value: "ES_LA"
                },
                {
                    label: sMap.get("FR_FR"),
                    value: "FR_FR"
                }
            ]
        });
    };

    self.getDefaultGpsFormats = function(data, s, f) {
        s({
            status: "success",
            default_gps_formats: [
                {
                    label: sMap.get("label_DD"),
                    value: "DECIMAL"
                },
                {
                    label: sMap.get("label_DMS"),
                    value: "DEGREE"
                },
                {
                    label: sMap.get("label_UTMWGS84"),
                    value: "UTMWGS84"
                }
            ]
        });
    };

    self.getDefaultMeasurementSystems = function(data, s, f) {
        s({
            status: "success",
            default_measurement_systems: [
                {
                    label: "Metric System",
                    value: "METRIC"
                },
                {
                    label: "Imperial",
                    value: "IMPERIAL"
                }
            ]
        });
    };

    self.getDefaultGoogleMapTypes = function(data, s, f) {
        s({
            status: "success",
            default_google_map_types: [
                {
                    label: "ROADMAP",
                    value: "ROADMAP"
                },
                {
                    label: "SATELLITE",
                    value: "SATELLITE"
                },
                {
                    label: "HYBRID",
                    value: "HYBRID"
                },
                {
                    label: "TERRAIN",
                    value: "TERRAIN"
                }
            ]
        });
    };

    self.getWaypointsFromGarminDevice = function(data, s, f) {
        var control,
            listener;

        Util.ajaxCounterInc();

        try {
            listener = Class.create();
            listener.prototype = {
                initialize: function() { },
                onFinishFindDevices: function(o) {
                    var devices;

                    devices = o.controller.getDevices();

                    if (devices.length > 0) {
                        o.controller.getDevices();
                        o.controller.readFromDevice();
                    }
                    else {
                        Util.ajaxCounterDec();
                        throw(sMap.get("no_garmin_devices_connected"));
                    }
                },
                onFinishReadFromDevice: function(o) {
                    var data,
                        factory;

                    data    = o.controller.gpsData;
                    factory = new Garmin.GpsDataFactory;
                    factory.initialize();
                    factory.parseGpxDocument(data);

                    Util.ajaxCounterDec();

                    s({
                        status: "success",
                        waypoints: factory.getWaypoints()
                    });
                }
            };

            try {
                control = new Garmin.DeviceControl();
                control.register(new listener());
                control.unlock([self.garminDomain, self.garminKey]);
                control.findDevices();
            }
            catch (e) {
                Util.ajaxCounterDec();
                if (confirm(sMap.get("no_garmin_communicator_plugin_installed"))) {
                    window.location.href = "http://www.google.com/search?q=garmin+communicator+download";
                }
            }
        }
        catch (e) {
            f(e);
        }
    };

    return self;
};

var App = function(cfg) {

    this.start = function() {
        Util.loadLanguageFile(function() {
            var el,
                controller,
                service,
                modal,
                mask,
                httpClient;

            httpClient = Barrister.httpClient("/api-new");

            httpClient.loadContract(function(err) {
                var proxy;

                if (err) {
                    alert("Unable to load contract: " + err);
                }
                else {
                    proxy = httpClient.proxy("SimpleMappingSystem");
                    mask = new Mask(function() {
                        modal = new Modal(function(modal) {
                            el         = document.getElementById("page");
                            service    = new Service(cfg.userId, proxy);
                            controller = new LandingPageController(service, modal, el);

                            service.garminDomain = cfg.garminDomain;
                            service.garminKey = cfg.garminKey;
                            controller.userId = cfg.userId;
                            controller.start();
                        }, null, null);
                    });
                }
            });
        }, cfg.defaultLanguage || jQuery.cookie("default_language"));
    }
};