GameSettings = {
    rows: 'choice-row',
    choices: 'game-choice',
    choicesElements: null,
    question: '',
    questionElement: null,
    activeChoice: 'choice-picked',
    disabledChoice: 'choice-disabled',
    timer: null,
    questionTimer: null,
    questionTimeLimit: 10,
    XHR: null,
    currentQuestion: 1
};

function startGame() {
    var i, rows = document.getElementsByClassName(GameSettings.rows);

    GameSettings.choicesElements = document.getElementsByClassName(GameSettings.choices);
    GameSettings.timer = document.getElementById('game-timer');
    GameSettings.questionElement = document.getElementById('game-question');
    GameSettings.questionElement = GameSettings.questionElement.getElementsByTagName('span')[0];

    for(i = 0; i < rows.length; i++) {
        unify(rows[i], '.' + GameSettings.choices);
    }

    for(i = 0; i < GameSettings.choicesElements.length; i++) {
        GameSettings.choicesElements[i].addEventListener('mouseup', handleChoice, false);
    }

    startTimer();
};

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
};

function hasClass(elem, klass) {
    return elem.className.indexOf(klass) >= 0;
};

function removeClass(elem, klass) {
    var tmp = hasClass(elem, ' ' + klass) ? ' ' + klass : klass;
    elem.className = elem.className.replace(tmp, '');
    return elem;
};

function addClass(elem, klass) {
    if(hasClass(elem, klass)) return;
    elem.className += ' ' + klass;
    return elem;
};

function disableChoice(choice) {
    removeClass(choice, GameSettings.activeChoice);
    addClass(choice, GameSettings.disabledChoice);
};

function enableChoice(choice) {
    removeClass(choice, GameSettings.disabledChoice);
};

function disableAllChoices() {
    for(var i = 0; i < GameSettings.choicesElements.length; i++) {
        disableChoice(GameSettings.choicesElements[i]);
    }
};

function enableAllChoices() {
    for(var i = 0; i < GameSettings.choicesElements.length; i++) {
        enableChoice(GameSettings.choicesElements[i]);
        if(hasClass(GameSettings.choicesElements[i], GameSettings.activeChoice)) {
            removeClass(GameSettings.choicesElements[i], GameSettings.activeChoice);
        }
    }
};

function reload() {
    GameSettings.reloadTimer = setTimeout(continueGame, 1000);
};

function continueGame() {
    if(++GameSettings.currentQuestion > 4) GameSettings.currentQuestion = 1; 
    requestQuestion('contents/q' + GameSettings.currentQuestion + '.json');
};

function startTimer() {
    GameSettings.timer.innerHTML = GameSettings.questionTimeLimit;
    GameSettings.questionTimer = setTimeout(decrementTimer, 1000);
};

function stopTimer() {
    clearTimeout(GameSettings.questionTimer);
};

function decrementTimer() {
    var cTime = parseInt(GameSettings.timer.innerHTML);
    cTime--;

    GameSettings.timer.innerHTML = cTime;

    if(cTime <= 0) {
        disableAllChoices();
        stopTimer();
        return;
    }
    GameSettings.questionTimer = setTimeout(decrementTimer, 1000)
};

function requestQuestion(url) {
    GameSettings.XHR = new XMLHttpRequest();
    GameSettings.XHR.open('GET', url);
    GameSettings.XHR.onreadystatechange = loadQuestion;

    GameSettings.XHR.send(null);
};

function loadQuestion() {
    if(GameSettings.XHR.readyState == 4) {
        var resp = JSON.parse(GameSettings.XHR.responseText);
        addQuestion(resp.question);
    }
};

function addQuestion(question) {
    GameSettings.questionElement.innerHTML = '';
    GameSettings.questionElement.innerHTML = question;

    enableAllChoices();
};

function handleChoice(event) {
    var chosen = event.target, i;

    if( !hasClass(chosen, GameSettings.choices) ) {
        chosen = chosen.parentNode;
    }

    if( hasClass(chosen, GameSettings.disabledChoice) || hasClass(chosen, GameSettings.activeChoice) ) {
        return;
    }

    disableAllChoices();
    
    stopTimer();

    removeClass(chosen, GameSettings.disabledChoice);
    addClass(chosen, GameSettings.activeChoice);

    reload();
};