// Set variables

const metric = document.getElementById('metric');
const defaultEndpoint = '/test_metric.txt';
const ruleForm = document.getElementById('form-rules-container');
const rulesContainer = document.getElementById('rules-list');
const addRuleBtn = document.getElementById('add-rule');
const saveRulesBtn = document.getElementById('save-rules');
const closeRulesFormBtn = document.getElementById('rules-close');
let totalRules = 0;

/**
 * Compare values for array sorting
 *
 * @param key
 * @param order
 * @return {Function}
 */
function compareValues(key, order = 'asc') {
    return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }

        const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

/**
 * Get endpoint value or reset it
 *
 * @return {string}
 */
function getEndpoint() {
    let endpoint = localStorage.getItem('endpoint');
    if (!endpoint) {
        endpoint = defaultEndpoint;
    }
    return endpoint;
}

/**
 * Validate endpoint value to be relative or external source
 *
 * @param endpoint
 * @return {boolean}
 */
function validateEndpoint(endpoint) {
    return (endpoint && (endpoint.indexOf('/') === 0 || endpoint.indexOf('http') !== -1));
}

/**
 * Validate the hex value
 *
 * @param hex
 * @return {boolean}
 */
function isHex(hex) {
    const re = /[0-9A-Fa-f]{6}/g;
    return re.test(hex);
}

/**
 * Get Metric from stored endpoint
 */
function getMetric() {
    let endpoint = getEndpoint();
    let endpointIsValid = validateEndpoint(endpoint);
    if (!endpointIsValid) {
        console.log('Invalid endpoint; resetting to default');
        endpoint = defaultEndpoint;
        localStorage.setItem(endpoint);
        return;
    }

    axios.get(endpoint)
        .then(function (response) {
            //console.log('response: ', response);
            formatMetric(response.data);
        })
        .catch(function (error) {
            if (error.response) {
                // Server response outside 2xx
                console.log(error.response.data);
            } else if (error.request) {
                // No response
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            metric.classList.add('error');
            metric.innerHTML = error;
        })
        .then(function () {
            setTimeout(function () {
                getMetric();
            }, 2000);
        });
}

/**
 * Retrieve rules and set metric color
 *
 * @param value
 */
function formatMetric(value) {
    // Retrieve rules
    const rules = JSON.parse(localStorage.getItem('rules'));
    let color = null;
    if (rules && rules.length) {
        rules.forEach(function (rule) {
            // Set the color based on the value
            if (value >= rule.num) {
                color = rule.hex;
            }
        });
    }
    // Set the metric
    metric.classList.remove('error');
    metric.style.color = '#' + color;
    metric.innerHTML = value;
}

/**
 * Display form upon control + 1 key combination
 *
 * @param evt
 */
document.onkeydown = function (evt) {
    evt = evt || window.event;
    let ctrlIsDown = evt.ctrlKey;
    let key = evt.key;
    let showForm = false;
    if (key === '1' && ctrlIsDown) {
        showForm = true;
    }
    if (showForm) {
        createRulesForm();
    }
};

/**
 * Generate the rules form
 */
function createRulesForm() {
    // Populate the form endpoint value if stored
    const storedEndpoint = localStorage.getItem('endpoint');
    if (storedEndpoint) {
        const endpointInput = document.getElementById('endpoint');
        endpointInput.value = storedEndpoint;
    }
    // Populate the form with existing rules
    rulesContainer.innerHTML = '';
    const rules = JSON.parse(localStorage.getItem('rules'));
    if (rules && rules.length) {
        rules.forEach(function (rule, idx) {
            handleAddRule(null);
            const ruleField = document.getElementById('rule-value-' + idx);
            const hexField = document.getElementById('rule-hex-' + idx);
            if (ruleField && hexField) {
                ruleField.value = rule.num;
                hexField.value = rule.hex;
                setHexColor('rule-hex-' + idx, rule.hex);
            }
        });
    } else {
        handleAddRule(null);
        const ruleField = document.getElementById('rule-value-0');
        const hexField = document.getElementById('rule-hex-0');
        if (ruleField && hexField) {
            ruleField.value = '0';
            hexField.value = '999999';
            setHexColor('rule-hex-0', '999999');
        }
    }

    // Display the form
    ruleForm.classList.add('active');
}

/**
 * Close the form modal
 *
 */
function closeRulesForm(evt) {
    evt.preventDefault();
    ruleForm.classList.remove('active');
}

/**
 * Add a new rule row
 *
 * @param evt
 */
function handleAddRule(evt) {
    if (evt) {
        evt.preventDefault();
    }

    let idx = document.querySelectorAll('#rules-list .rule').length;

    // Create a rule container
    let ruleDiv = document.createElement('div');
    ruleDiv.id = 'rule-' + idx;
    ruleDiv.classList.add('rule');

    // Create number value label & input
    const numDiv = document.createElement('div');
    numDiv.className = 'field-container total';
    const numLabel = document.createElement('label');
    numLabel.setAttribute('for', 'rule-value-' + idx);
    numLabel.innerHTML = 'Minimum Value';
    const numInput = document.createElement('input');
    numInput.setAttribute('type', 'text');
    numInput.setAttribute('id', 'rule-value-' + idx);
    numInput.setAttribute('name', 'rule-value-' + idx);
    numInput.setAttribute('value', '');
    numInput.setAttribute('placeholder', '0');
    numInput.className = 'field num';
    numDiv.appendChild(numLabel);
    numDiv.appendChild(numInput);

    // Create hex value label & input
    const hexDiv = document.createElement('div');
    hexDiv.className = 'field-container hex';
    const hexLabel = document.createElement('label');
    hexLabel.setAttribute('for', 'rule-hex-' + idx);
    hexLabel.innerHTML = 'Hex Color';
    const hexInput = document.createElement('input');
    hexInput.setAttribute('type', 'text');
    hexInput.setAttribute('id', 'rule-hex-' + idx);
    hexInput.setAttribute('name', 'rule-hex-' + idx);
    hexInput.setAttribute('value', '');
    hexInput.setAttribute('placeholder', '999999');
    hexInput.className = 'field hex';
    hexDiv.appendChild(hexLabel);
    hexDiv.appendChild(hexInput);
    hexInput.addEventListener('keyup', function(evt) {
        handleHexChange(this.id, this.value, evt);
    });

    // Create a color icon
    const colorDiv = document.createElement('div');
    colorDiv.className = 'icon-hex-color';

    // Create a remove button
    const removeBtn = document.createElement('a');
    removeBtn.setAttribute('id', 'rule-remove-' + idx);
    removeBtn.setAttribute('href', '');
    removeBtn.className = 'btn btn-remove-rule';
    removeBtn.innerText = 'X';
    removeBtn.addEventListener('click', function(evt) {
        handleRemoveRule(this.id, evt);
    });

    ruleDiv.appendChild(numDiv);
    ruleDiv.appendChild(hexDiv);
    ruleDiv.appendChild(colorDiv);
    ruleDiv.appendChild(removeBtn);
    rulesContainer.appendChild(ruleDiv);
    setHexColor('rule-hex-' + idx, '999999');
    totalRules++;
}

/**
 * Handle event for hex color icon changes
 *
 * @param id
 * @param hex
 * @param evt
 */
function handleHexChange(id, hex, evt = null) {
    if (evt && isHex(hex)) {
        setHexColor(id, hex);
    }
}

/**
 * Set hex color squares
 *
 * @param id
 * @param hex
 */
function setHexColor(id, hex) {
    const ruleDiv = document.getElementById(id).closest('.rule');
    const hexIcon = document.getElementById(ruleDiv.id).querySelectorAll('.icon-hex-color');
    hexIcon[0].style.backgroundColor = '#' + hex;
}

/**
 * Remove rule from form
 *
 * @param id
 * @param evt
 */
function handleRemoveRule(id, evt = null) {
    if (evt) {
        evt.preventDefault();
    }
    const ruleDiv = document.getElementById(id).closest('.rule');
    const hexInput = document.getElementById(ruleDiv.id).querySelectorAll('input.hex');
    if (hexInput) {
        hexInput[0].value = '';
        storeRules(false);
        createRulesForm();
    }
}

/**
 * Store rules in LocalStorage
 *
 * @param closeForm
 * @param evt
 */
function storeRules(closeForm, evt = null) {
    if (evt) {
        evt.preventDefault();
    }

    // Store the endpoint
    let endpoint = document.getElementById('endpoint').value;
    let endPointIsValid = validateEndpoint(endpoint);
    if (!endPointIsValid) {
        endpoint = defaultEndpoint;
    }
    localStorage.setItem('endpoint', endpoint);

    // Retrieve and store all valid input values
    const rulesArr = [];
    let rulesTotal = document.querySelectorAll('#rules-list .rule').length;
    if (rulesTotal) {
        for (let i = 0; i < rulesTotal; i++) {
            const ruleValue = document.getElementById('rule-value-' + i).value;
            const hexValue = document.getElementById('rule-hex-' + i).value;
            if (ruleValue && hexValue && isHex(hexValue)) {
                rulesArr.push({num: parseInt(ruleValue, 10), hex: hexValue});
            }
        }
    }
    // Sort the rules in order and store
    rulesArr.sort(compareValues('num'));
    localStorage.setItem('rules', JSON.stringify(rulesArr));
    formatMetric(metric.innerText);
    if (closeForm) {
        ruleForm.classList.remove('active');
    }
}

// Functionality

addRuleBtn.addEventListener('click', handleAddRule, false);
saveRulesBtn.addEventListener('click', function(evt) {
    storeRules(true, evt);
});
closeRulesFormBtn.addEventListener('click', closeRulesForm, false);
getMetric();