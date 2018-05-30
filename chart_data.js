$(function() {
    var ctx = document.getElementById("trendChart");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'BTCUSD',
                lineTension: 0.3,
                borderColor: "#0200dc",
                pointRadius: 5,
                pointHoverRadius: 5,
                pointHitRadius: 20,
                pointBorderWidth: 2,
            }],
        },
    });
    updateData()
    
    function updateData(){
        $.ajax({
            type: 'GET',
            url: 'https://apiv2.bitcoinaverage.com/indices/global/history/BTCUSD?period=daily&?format=json',
            success: function(data){
                myChart.data.datasets[0].data = data.data.averageq
                myChart.data.labels = data.data.time
                myChart.update()

            }
        });
    }
});

