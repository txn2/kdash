
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
            setTimeout(function() { getMetric(); }, 2000);
        });
}

getMetric();