// Set variables

const ruleForm = document.getElementById('form-rules-container');
const addRuleBtn = document.getElementById('add-rule');

/**
 * Get Metric from stored endpoint
 */
function getMetric() {
    axios.get('/test_metric.txt')
        .then(function (response) {
            document.getElementById("metric").innerHTML = response.data;
        })
        .catch(function (error) {
            document.getElementById("metric").innerHTML = error;
            console.log(error);
        })
        .then(function () {
            setTimeout(function () {
                getMetric();
            }, 2000);
        });
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
    // console.log('window event: ', evt);
    // console.log('key/ctrl: ', key, ctrlIsDown);
    if (key === '1' && ctrlIsDown) {
        showForm = true;
    }
    if (showForm) {
        console.log('show form: ', key, ctrlIsDown);
        ruleForm.classList.add('active');
    }
};

/**
 * Add a new rule row
 *
 * @param evt
 */
function handleAddRule(evt) {
    console.log('add rule');

    /*
    <div class="rules">
                    <div class="rule">
                        <div class="field total">
                            <label for="rule-value-0">Value</label>
                            <input type="text" name="rule-value-0" id="rule-value-0" value="" placeholder="0">
                        </div>
                        <div class="field hex">
                            <label for="rule-hex-0">Hex Color</label>
                            <input type="text" name="rule-hex-0" id="rule-hex-0" value="" placeholder="999999">
                        </div>
                    </div>
                </div>
     */
}

/**
 * Store rules in LocalStorage
 */
function storeRules() {

}

// Functionality

addRuleBtn.addEventListener('click', handleAddRule, false);
getMetric();