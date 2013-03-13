function unify(objects, selector) {
    var i, j, children;

    if(selector.indexOf('.') == 0) {
        children = objects.getElementsByClassName(selector.substr(1, selector.length));
    }
    else if(selector.indexOf('.') < 0) {
        children = objects.getElementsByTagName(selector);
    }

    for(i = 0; i < children.length; i++) {
        var cHeight = children[i].offsetHeight;

        for(j = i+1; j < children.length; j++) {
            var tHeight = children[j].offsetHeight;
            if(cHeight > tHeight) {
                children[j].style.height = cHeight;
            }
            else if(tHeight > cHeight) {
                children[i].style.height = tHeight;
            }
        }
    }
}

function hasClass(elem, klass) {
    return elem.className.indexOf(klass) > 0;
}

function removeClass(elem, klass) {
    var tmp = hasClass(elem, ' ' + klass) ? ' ' + klass : klass;
    return elem.className.replace(tmp, '');
}

function addClass(elem, klass) {
    console.log(hasClass(elem, klass))
    if(hasClass(elem, klass)) return;
    return elem.className += ' ' + klass;
}

function disableChoice(choice) {
    removeClass(choice, GameSettings.activeChoice);
    addClass(choice, GameSettings.disabledChoice);
}

function handleChoice(event) {
    var chosen = event.target, i;

    if( !hasClass(chosen, GameSettings.choices) ) {
        chosen = chosen.parentNode;
    }

    if( hasClass(chosen, GameSettings.disabledChoice) || hasClass(chosen, GameSettings.activeChoice) ) {
        return;
    }

    for(i = 0; i < GameSettings.choicesElements.length; i++) {
        disableChoice(GameSettings.choicesElements[i]);
    }

    removeClass(chosen, GameSettings.disabledChoice);
    addClass(chosen, GameSettings.activeChoice);
}