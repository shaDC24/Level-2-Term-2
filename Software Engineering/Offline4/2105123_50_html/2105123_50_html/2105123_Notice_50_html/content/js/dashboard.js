/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 90.375, "KoPercent": 9.625};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.90375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.92, 500, 1500, "/complete/search-2${usercount}"], "isController": false}, {"data": [0.9, 500, 1500, "/home/notice/-253"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-252"], "isController": false}, {"data": [0.96, 500, 1500, "/home/download/1306-257"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-251"], "isController": false}, {"data": [0.0, 500, 1500, "/home/download/1305-260"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice-262"], "isController": false}, {"data": [1.0, 500, 1500, "/home/download/1302-261"], "isController": false}, {"data": [0.68, 500, 1500, "/submit/firefox-desktop/newtab/1/49b411a0-a7fe-4f15-b120-420671927c63-256"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice-259"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice-258"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice/-253-1"], "isController": false}, {"data": [1.0, 500, 1500, "/home/download/1286-264"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice/-253-0"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice/-253-2"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/pageload/1/0d8f00bd-f92a-4bcf-895f-b7a96d8ff601-263"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 800, 77, 9.625, 227.21624999999997, 9, 1525, 149.0, 492.0, 787.6499999999995, 1083.6400000000003, 7.871536523929471, 2591.2121693493436, 6.774690949946867], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/complete/search-2${usercount}", 50, 4, 8.0, 400.8600000000001, 260, 1000, 375.5, 498.3, 692.8499999999997, 1000.0, 0.5084814709351991, 6.41782073422182, 0.14450010550990522], "isController": false}, {"data": ["/home/notice/-253", 50, 5, 10.0, 256.78000000000003, 66, 695, 251.0, 505.59999999999997, 564.9499999999997, 695.0, 0.5097827306002182, 2.3353425676226793, 0.5311896226078445], "isController": false}, {"data": ["/complete/search-252", 50, 0, 0.0, 141.26000000000002, 105, 236, 129.5, 194.89999999999998, 209.49999999999994, 236.0, 0.510965315674372, 0.7341134496290392, 0.14670293242994667], "isController": false}, {"data": ["/home/download/1306-257", 50, 2, 4.0, 244.45999999999995, 148, 595, 227.5, 351.6, 467.5499999999993, 595.0, 0.5088333469022225, 320.1436309329968, 0.25739811884311653], "isController": false}, {"data": ["/complete/search-251", 50, 0, 0.0, 149.74, 107, 247, 149.0, 182.7, 215.94999999999987, 247.0, 0.5111847217110376, 0.9830521497873472, 0.14626672213020897], "isController": false}, {"data": ["/home/download/1305-260", 50, 50, 100.0, 915.9599999999999, 709, 1525, 842.5, 1213.1, 1338.9, 1525.0, 0.5040576641967841, 1701.2694377236758, 0.2549822949745451], "isController": false}, {"data": ["/home/notice-262", 50, 0, 0.0, 34.72, 24, 82, 30.0, 51.8, 54.449999999999996, 82.0, 0.5080319856938192, 1.7776158249423384, 0.25351986786088054], "isController": false}, {"data": ["/home/download/1302-261", 50, 0, 0.0, 291.5, 208, 483, 270.5, 387.9, 431.0999999999997, 483.0, 0.5080423097635571, 516.0821785425791, 0.2569979652905494], "isController": false}, {"data": ["/submit/firefox-desktop/newtab/1/49b411a0-a7fe-4f15-b120-420671927c63-256", 50, 16, 32.0, 491.54, 396, 980, 449.0, 604.4, 717.9, 980.0, 0.5077998050048749, 0.4127757829003494, 1.4966209096725707], "isController": false}, {"data": ["/home/notice-259", 50, 0, 0.0, 29.959999999999994, 20, 56, 29.0, 38.9, 50.04999999999996, 56.0, 0.5096476296288746, 1.7832690009377516, 0.2543261120511279], "isController": false}, {"data": ["/home/notice-258", 50, 0, 0.0, 35.120000000000005, 25, 79, 34.0, 43.9, 55.04999999999996, 79.0, 0.5096216568819308, 1.7831781216874594, 0.22843392627813114], "isController": false}, {"data": ["/home/notice/-253-1", 50, 0, 0.0, 125.46, 30, 400, 83.0, 269.6, 285.74999999999994, 400.0, 0.5100583506753172, 0.25552727919574, 0.17732497347696574], "isController": false}, {"data": ["/home/download/1286-264", 50, 0, 0.0, 92.24000000000002, 52, 261, 80.0, 147.29999999999998, 178.7999999999999, 261.0, 0.5076554440969825, 106.4068615661678, 0.256802265666247], "isController": false}, {"data": ["/home/notice/-253-0", 50, 0, 0.0, 77.03999999999998, 9, 218, 78.5, 147.6, 193.59999999999997, 218.0, 0.5109235454006663, 0.2968745210091762, 0.1776257638307004], "isController": false}, {"data": ["/home/notice/-253-2", 50, 0, 0.0, 52.86, 23, 141, 41.5, 104.69999999999999, 113.24999999999997, 141.0, 0.5100947756093083, 1.7848335752032727, 0.1768394974036176], "isController": false}, {"data": ["/submit/firefox-desktop/pageload/1/0d8f00bd-f92a-4bcf-895f-b7a96d8ff601-263", 50, 0, 0.0, 295.95999999999987, 244, 354, 298.0, 329.7, 342.15, 354.0, 0.506642077637832, 0.4043538128616158, 2.2353602605153564], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1,106 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,329 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 809 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,225 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 581 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 571 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 607 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 566 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 567 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,034 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 808 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 747 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 774 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 980 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 976 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 533 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 771 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, 2.5974025974025974, 0.25], "isController": false}, {"data": ["The operation lasted too long: It took 781 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 722 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,007 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 844 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 799 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,338 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 709 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 507 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,525 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 793 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 790 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 658 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 523 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 973 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 970 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 899 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 595 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 604 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 719 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 821 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 755 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 806 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,340 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 775 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 563 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 805 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, 2.5974025974025974, 0.25], "isController": false}, {"data": ["The operation lasted too long: It took 516 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 733 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,084 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 842 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 792 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 547 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,032 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 717 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 788 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 502 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,000 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 929 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,025 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 551 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,042 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 537 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 763 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 695 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 862 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 766 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,048 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 534 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 1,099 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 724 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 933 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, 2.5974025974025974, 0.25], "isController": false}, {"data": ["The operation lasted too long: It took 814 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 557 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 843 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 515 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 872 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}, {"data": ["The operation lasted too long: It took 660 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.2987012987012987, 0.125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 800, 77, "The operation lasted too long: It took 771 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, "The operation lasted too long: It took 805 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, "The operation lasted too long: It took 933 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, "The operation lasted too long: It took 1,106 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,329 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/complete/search-2${usercount}", 50, 4, "The operation lasted too long: It took 733 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,000 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 523 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 660 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", ""], "isController": false}, {"data": ["/home/notice/-253", 50, 5, "The operation lasted too long: It took 695 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 604 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 516 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 507 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 533 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["/home/download/1306-257", 50, 2, "The operation lasted too long: It took 595 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 566 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/home/download/1305-260", 50, 50, "The operation lasted too long: It took 805 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, "The operation lasted too long: It took 771 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, "The operation lasted too long: It took 933 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, "The operation lasted too long: It took 1,106 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1,329 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/submit/firefox-desktop/newtab/1/49b411a0-a7fe-4f15-b120-420671927c63-256", 50, 16, "The operation lasted too long: It took 547 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 980 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 717 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 581 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 571 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
