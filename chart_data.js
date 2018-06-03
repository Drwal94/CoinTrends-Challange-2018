var myChart;

$(function() {
    chart();
})


function currencyButton(currency){
    switch(currency){
        case 'BTCUSD':
            document.getElementById('ethButton').classList.remove('active');
            document.getElementById('ltcButton').classList.remove('active');
            document.getElementById('btcButton').classList.add('active');
            break;
        case 'ETHUSD':
            document.getElementById('btcButton').classList.remove('active');
            document.getElementById('ltcButton').classList.remove('active');
            document.getElementById('ethButton').classList.add('active');
            break;
        case 'LTCUSD':
            document.getElementById('btcButton').classList.remove('active');
            document.getElementById('ethButton').classList.remove('active');
            document.getElementById('ltcButton').classList.add('active');
            break;
        default:
            alert('Something goes wrong!!!');
    }
    update();
}

function rangeButton(range){
    switch(range){
        case 'daily':
            document.getElementById('monthlyButton').classList.remove('active');
            document.getElementById('alltimeButton').classList.remove('active');
            document.getElementById('dailyButton').classList.add('active');
            break;
        case 'monthly':
            document.getElementById('dailyButton').classList.remove('active');
            document.getElementById('alltimeButton').classList.remove('active');
            document.getElementById('monthlyButton').classList.add('active');
            break;
        case 'alltime':
            document.getElementById('monthlyButton').classList.remove('active');
            document.getElementById('dailyButton').classList.remove('active');
            document.getElementById('alltimeButton').classList.add('active');
            break;
        default:
            alert('Something goes wrong!!!');
    }
    update();
}




function chart(){
    var type = checkType();
    var range = checkRange();
    var ctx = document.getElementById("trendChart").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                lineTension: 0,
                borderColor: "#0200dc",
                borderWidth: 1,
                pointRadius: 0,
                yAxisID: 'first',
            }]
        },
        options: {
            title: {
                display: true,
                text: 'BTCUSD',
            },
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    id: 'first',
                    type: 'logarithmic',
                }]
            },
        }
    });
    update(); 
}


function update(){
    var type = checkType();
    var range = checkRange();
    var i;
    $.ajax({
        type: 'GET',
        url: 'https://apiv2.bitcoinaverage.com/indices/global/history/'+type+'?period='+range+'&?format=json',
        success: function(data){
            var x = [];
            var y;
            var averageData = [];
            var labels = [];
            var i = 1;
            for (y in data){
                averageData.push(data[y].average);
                labels.push(data[y].time);
                x.push(i);
                i = i + 1;
            }
            averageData = averageData.reverse();
            labels = labels.reverse();
            
            myChart.data.datasets.splice(1,((myChart.data.datasets).length));
            var class_el = document.getElementById('trendButton').className;
            removeChilds("boxes");
            if(class_el.search('active')>=0){
                switch(range){
                    case 'daily':
                        alert('trend line is avaialabe only for weeks')
                        document.getElementById('trendButton').classList.remove('active');
                        break;
                    case 'monthly':
                        drawTrend(x,averageData,labels,168,type);
                        break;
                    case 'alltime':
                        drawTrend(x,averageData,labels,7,type);
                        break;
                    default:
                        alert('Something goes wrong!!!');

                }   
            }
            myChart.data.datasets[0].data = averageData;
            myChart.data.labels = labels;
            myChart.options.scales.yAxes[0].ticks.min = Math.min.apply(null,averageData);
            myChart.options.scales.yAxes[0].ticks.max = Math.max.apply(null,averageData);
            myChart.options.title.text = type;
            myChart.update();

        }
    });
}

function removeChilds(id){
    var list = document.getElementById(id);
    while(list.firstChild){
        list.removeChild(list.firstChild);
    }
}


function drawTrend(x,y,labels,quantity,type){
    var i;
    var slices = y.length/quantity;
    for (i = 0; i <= slices; i++){
        var j = i*quantity;
        var end = j+quantity;
        var x_n = x.slice(j,end);
        var y_n = y.slice(j,end);
        var labels_n = labels.slice(j,end);
        var trend = trendLine(x_n,y_n);
        var y_e = trend[0];
        var a = trend[1];
        var h1 = new Array(j);
        if(y.length-end>0){
            var h2 = new Array(y.length-end);
        }else{
            var h2 = [];
        }
        
        var y_w = h1.concat(y_e,h2);
        if(a>0){
            var color = 'green';
        }else{
            var color = 'red';
        }
        var newDataset = {
                label: false,
                lineTension: 0,
                borderColor: color,
                fill: false,
                borderWidth: 1,
                pointRadius: 0,
            }
        myChart.data.datasets.push(newDataset);
        myChart.data.datasets[i+1].data = y_w;
        myChart.data.labels = labels_n;
        
        drawBox(labels_n[labels_n.length-1],color,i,type);
        
    }
}

function drawBox(date,color,i,type){
    var para = document.createElement("div");
    para.setAttribute("id","box" + i);
    para.setAttribute("class","col-md-2 border rounded");
    date = date.slice(0,10);
    para.innerHTML = "<b>" + date + "</b><br>";
    
    var para2 = document.createElement("img");
    if(color == 'green'){
        para2.setAttribute("src","img/arrowupgreen.svg");
        var textnode = document.createTextNode(" " + type + " Growth");
    }else{
        para2.setAttribute("src","img/arrowdownred.svg");
        var textnode = document.createTextNode(" " + type + " Drop");
    }
    para.appendChild(para2);
    
    
    para.appendChild(textnode);
    
    
    var parent = document.getElementById("boxes");
    parent.insertBefore(para,parent.firstChild);
    
    
}

function checkType(){
    var class_el = document.getElementById('btcButton').className;
    if (class_el.search('active')>=0){
        return 'BTCUSD';
    }
    class_el = document.getElementById('ethButton').className;
    if (class_el.search('active')>=0){
        return 'ETHUSD';
    }
    class_el = document.getElementById('ltcButton').className;
    if (class_el.search('active')>=0){
        return 'LTCUSD';
    }
    alert('Cryptocurrency not choosen');
    return 0;
    
}

function checkRange(){
    var class_el = document.getElementById('dailyButton').className;
    if (class_el.search('active')>=0){
        return 'daily';
    }
    class_el = document.getElementById('monthlyButton').className;
    if (class_el.search('active')>=0){
        return 'monthly';
    }
    class_el = document.getElementById('alltimeButton').className;
    if (class_el.search('active')>=0){
        return 'alltime';
    }
    alert('Range not choosen');
    return 0;
    
}

function trendButton(){
    var class_el = document.getElementById('trendButton').className;
    if (class_el.search('active')>=0){
        document.getElementById('trendButton').classList.remove('active');
        update();
    } else {
        document.getElementById('trendButton').classList.add('active');
        update();
    }
}

function trendLine(x,y){
    var sum1 = 0;
    var i;
    var sum_x = 0;
    var sum_y = 0;
    var sum_x2 = 0;
    for (i in x){
        sum1 = sum1 + x[i]*y[i];
        sum_x = sum_x + x[i];
        sum_y = sum_y + y[i];
        sum_x2 = sum_x2 + x[i]*x[i];
    }
            
    var a = (x.length*sum1 - sum_x*sum_y)/(x.length*sum_x2-sum_x*sum_x);
    var avg_x = sum_x/x.length;
    var avg_y = sum_y/x.length;
    var b = avg_y-a*avg_x;
    var y2 = [];
    for (i in x){
        y2.push(a*x[i]+b);
    }
    return [y2,a];
}


