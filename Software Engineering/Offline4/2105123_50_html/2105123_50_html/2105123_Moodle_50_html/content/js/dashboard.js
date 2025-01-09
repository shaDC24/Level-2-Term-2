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

    var data = {"OkPercent": 98.07407407407408, "KoPercent": 1.9259259259259258};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9807407407407407, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/moodle/course/view.php-201"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/-184"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/pluginfile.php/5/user/icon/classic/f1-209"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/index.php-186"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-179"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-178"], "isController": false}, {"data": [0.96, 500, 1500, "/complete/search-177"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/view.php-216"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/index.php-205"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-201-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/my/courses.php-206"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-201-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-201-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/my/courses.php-204"], "isController": false}, {"data": [1.0, 500, 1500, "/public/img/program/pg-ds.jpg-182"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/user/view.php-199"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/calendar/view.php-203"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/discuss.php-215"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/view.php-207"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/discuss.php-213"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-188"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/pageload/1/7056d988-e775-4a21-a4d0-627003d73994-198"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/discuss.php-210"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-196-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-196-1"], "isController": false}, {"data": [0.0, 500, 1500, "/safebrowsing/clientreport/download?key=AIzaSyC7jsptDS3am4tPx4r3nxis7IMjBc5Dovo-214"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/theme/image.php/classic/core/1731384351/f/pdf-128-211"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-190-0"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-183"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-190-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-192-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-190-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-192-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-194-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-192-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-194-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-196-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-194-1"], "isController": false}, {"data": [1.0, 500, 1500, "/-180"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/-217"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/my/courses.php-185"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/theme/image.php/classic/core/1731384351/u/f1-208"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-196"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-194"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-192"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-190"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-188-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/user/view.php-199-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-188-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/user/view.php-199-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/calendar/view.php-187"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-188-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/pluginfile.php/69/mod_forum/attachment/331/%E0%A6%AA%E0%A6%B0%E0%A7%80%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A6%BE%E0%A6%B0%20%E0%A6%AB%E0%A6%BF%20%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4%20%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A7%8D%E0%A6%9E%E0%A6%AA%E0%A7%8D%E0%A6%A4%E0%A6%BF_20241130_0001.pdf-212"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/newtab/1/4c825728-fb4c-4f22-895c-bd1fe3ca2115-181"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 52, 1.9259259259259258, 84.2707407407407, 5, 853, 50.0, 194.0, 346.0, 455.0, 26.489806330082608, 624.5717347174666, 20.147122667425386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/moodle/course/view.php-201", 50, 0, 0.0, 80.74000000000001, 63, 151, 77.5, 93.8, 133.89999999999992, 151.0, 0.5127363714672464, 5.407015339149472, 0.7841261305836991], "isController": false}, {"data": ["/moodle/-184", 50, 0, 0.0, 138.12000000000003, 125, 153, 138.0, 150.0, 151.0, 153.0, 0.5128310324314346, 6.049583228630331, 0.22786925757451434], "isController": false}, {"data": ["/moodle/pluginfile.php/5/user/icon/classic/f1-209", 50, 0, 0.0, 17.779999999999998, 12, 31, 16.0, 25.799999999999997, 28.449999999999996, 31.0, 0.513257439666588, 2.3998795128160384, 0.26264345545438683], "isController": false}, {"data": ["/moodle/course/index.php-186", 50, 0, 0.0, 49.13999999999999, 40, 76, 48.0, 57.9, 63.89999999999999, 76.0, 0.5133364817970884, 4.0716907282448, 0.26017737700457894], "isController": false}, {"data": ["/complete/search-179", 50, 0, 0.0, 184.26, 171, 252, 182.0, 191.9, 200.49999999999994, 252.0, 0.5123790785374651, 0.7383662729033448, 0.14710883700196753], "isController": false}, {"data": ["/complete/search-178", 50, 0, 0.0, 189.01999999999998, 173, 254, 186.0, 201.8, 228.99999999999983, 254.0, 0.5123528266505447, 0.992853718784904, 0.1466009552818453], "isController": false}, {"data": ["/complete/search-177", 50, 2, 4.0, 445.86, 379, 853, 430.0, 487.6, 517.9499999999998, 853.0, 0.5088178126939868, 5.969983247173517, 0.1445956870058107], "isController": false}, {"data": ["/moodle/mod/forum/view.php-216", 50, 0, 0.0, 106.16000000000003, 89, 266, 101.0, 115.9, 125.64999999999992, 266.0, 0.5136581707605223, 8.066560146803505, 0.2778970962903607], "isController": false}, {"data": ["/moodle/course/index.php-205", 50, 0, 0.0, 47.379999999999995, 38, 61, 46.0, 59.0, 61.0, 61.0, 0.5129941416069028, 4.0688050186216875, 0.26701745847312425], "isController": false}, {"data": ["/moodle/course/view.php-201-2", 50, 0, 0.0, 31.040000000000003, 25, 50, 29.5, 40.0, 44.34999999999999, 50.0, 0.5129994049206903, 3.3512788273603107, 0.2595055583485523], "isController": false}, {"data": ["/moodle/my/courses.php-206", 50, 0, 0.0, 53.16000000000001, 46, 71, 51.0, 60.9, 62.89999999999999, 71.0, 0.513015195510091, 4.416189108302638, 0.2670284171942173], "isController": false}, {"data": ["/moodle/course/view.php-201-1", 50, 0, 0.0, 19.319999999999997, 12, 52, 18.0, 26.599999999999994, 40.29999999999994, 52.0, 0.513136288998358, 1.0072304110221675, 0.2625814603858785], "isController": false}, {"data": ["/moodle/course/view.php-201-0", 50, 0, 0.0, 29.9, 23, 53, 28.0, 35.9, 46.14999999999997, 53.0, 0.5131099594643133, 1.0517752001128842, 0.262567987069629], "isController": false}, {"data": ["/moodle/my/courses.php-204", 50, 0, 0.0, 52.720000000000006, 41, 69, 51.0, 63.0, 65.0, 69.0, 0.5129046817939354, 4.415317914350047, 0.27448414611628574], "isController": false}, {"data": ["/public/img/program/pg-ds.jpg-182", 50, 0, 0.0, 42.82000000000001, 27, 107, 38.0, 61.9, 77.09999999999992, 107.0, 0.5135368308615094, 58.15553859100899, 0.2352038805410624], "isController": false}, {"data": ["/moodle/user/view.php-199", 50, 0, 0.0, 63.379999999999995, 51, 91, 62.5, 76.8, 84.89999999999999, 91.0, 0.5129362522825663, 4.432179969454647, 0.5289655101663966], "isController": false}, {"data": ["/moodle/calendar/view.php-203", 50, 0, 0.0, 51.620000000000005, 42, 73, 50.5, 55.9, 71.44999999999999, 73.0, 0.5128783760219101, 4.179708335684026, 0.2674580593708008], "isController": false}, {"data": ["/moodle/mod/forum/discuss.php-215", 50, 0, 0.0, 66.00000000000001, 59, 90, 65.0, 72.8, 74.89999999999999, 90.0, 0.513816526394755, 5.039887817795521, 0.2794880910174595], "isController": false}, {"data": ["/moodle/mod/forum/view.php-207", 50, 0, 0.0, 100.56000000000002, 91, 124, 98.0, 111.0, 121.35, 124.0, 0.5127942156812471, 8.05290233513666, 0.27091960027690887], "isController": false}, {"data": ["/moodle/mod/forum/discuss.php-213", 50, 0, 0.0, 68.05999999999999, 56, 112, 65.5, 78.69999999999999, 83.04999999999995, 112.0, 0.5129362522825663, 5.031233409718091, 0.2775065271138103], "isController": false}, {"data": ["/moodle/course/view.php-188", 50, 0, 0.0, 82.63999999999999, 65, 121, 79.5, 101.99999999999999, 118.79999999999998, 121.0, 0.5131889561736632, 5.411808076952684, 0.784818266960895], "isController": false}, {"data": ["/submit/firefox-desktop/pageload/1/7056d988-e775-4a21-a4d0-627003d73994-198", 50, 0, 0.0, 284.0, 236, 318, 285.0, 308.9, 312.45, 318.0, 0.5117550126403488, 0.4062155364983675, 2.2969004278271905], "isController": false}, {"data": ["/moodle/mod/forum/discuss.php-210", 50, 0, 0.0, 65.61999999999996, 54, 83, 64.0, 75.69999999999999, 77.0, 83.0, 0.5130046683424819, 5.119826668547684, 0.27754354127122555], "isController": false}, {"data": ["/moodle/course/view.php-196-2", 50, 0, 0.0, 29.639999999999993, 24, 43, 29.0, 37.8, 41.34999999999999, 43.0, 0.5131836889696297, 3.3525127718590593, 0.2595987801623713], "isController": false}, {"data": ["/moodle/course/view.php-196-1", 50, 0, 0.0, 17.58, 12, 31, 16.5, 22.0, 28.89999999999999, 31.0, 0.5133154015153071, 1.0075819893025069, 0.262673115619161], "isController": false}, {"data": ["/safebrowsing/clientreport/download?key=AIzaSyC7jsptDS3am4tPx4r3nxis7IMjBc5Dovo-214", 50, 50, 100.0, 367.76000000000005, 328, 669, 351.0, 420.69999999999993, 571.5499999999994, 669.0, 0.5114670922072874, 0.32408233213650034, 0.7632048016530617], "isController": false}, {"data": ["/moodle/theme/image.php/classic/core/1731384351/f/pdf-128-211", 50, 0, 0.0, 10.140000000000006, 6, 18, 9.5, 14.899999999999999, 16.0, 18.0, 0.5132995924401236, 5.496416046001909, 0.26617390975166566], "isController": false}, {"data": ["/moodle/course/view.php-190-0", 50, 0, 0.0, 29.779999999999998, 20, 75, 28.0, 35.8, 41.24999999999998, 75.0, 0.5132890535976429, 1.0521423081068872, 0.26265963289566885], "isController": false}, {"data": ["/complete/search-183", 50, 0, 0.0, 190.46000000000004, 160, 287, 188.0, 214.9, 224.14999999999998, 287.0, 0.5124473460351949, 5.424415297578174, 0.14562712665648606], "isController": false}, {"data": ["/moodle/course/view.php-190-2", 50, 0, 0.0, 29.680000000000007, 24, 45, 29.0, 36.8, 38.449999999999996, 45.0, 0.5132521710566835, 3.3531706634040934, 0.25963342246812704], "isController": false}, {"data": ["/moodle/course/view.php-192-0", 50, 0, 0.0, 27.92, 20, 43, 27.0, 35.9, 37.79999999999998, 43.0, 0.5132627083846596, 1.0520883055658208, 0.2626461515562125], "isController": false}, {"data": ["/moodle/course/view.php-190-1", 50, 0, 0.0, 18.999999999999996, 12, 85, 16.0, 24.0, 27.449999999999996, 85.0, 0.5133364817970884, 1.007623367589988, 0.2626839027946038], "isController": false}, {"data": ["/moodle/course/view.php-192-2", 50, 0, 0.0, 29.42, 22, 41, 29.0, 34.0, 39.0, 41.0, 0.5133364817970884, 3.3536914026406026, 0.259676071846574], "isController": false}, {"data": ["/moodle/course/view.php-194-0", 50, 0, 0.0, 32.29999999999998, 23, 289, 26.0, 33.0, 37.449999999999996, 289.0, 0.5133628345842274, 1.0522935447190365, 0.2626973880098976], "isController": false}, {"data": ["/moodle/course/view.php-192-1", 50, 0, 0.0, 17.919999999999998, 12, 30, 16.5, 24.9, 27.89999999999999, 30.0, 0.5133417521380683, 1.0076337126928883, 0.2626865997269022], "isController": false}, {"data": ["/moodle/course/view.php-194-2", 50, 0, 0.0, 29.3, 23, 37, 29.0, 34.9, 36.449999999999996, 37.0, 0.5133417521380683, 3.353425048254125, 0.2596787378979682], "isController": false}, {"data": ["/moodle/course/view.php-196-0", 50, 0, 0.0, 27.24, 23, 45, 26.0, 33.0, 36.89999999999999, 45.0, 0.5133206714234383, 1.052207118474411, 0.2626758123299625], "isController": false}, {"data": ["/moodle/course/view.php-194-1", 50, 0, 0.0, 16.639999999999997, 11, 28, 16.0, 20.0, 22.89999999999999, 28.0, 0.5134366367846545, 1.0078199608761282, 0.26273515397964736], "isController": false}, {"data": ["/-180", 50, 0, 0.0, 54.9, 39, 107, 51.0, 72.0, 83.24999999999997, 107.0, 0.5134471816884197, 3.7590952354668774, 0.22463314198868362], "isController": false}, {"data": ["/moodle/-217", 50, 0, 0.0, 135.85999999999993, 123, 151, 134.5, 146.9, 148.45, 151.0, 0.5134840922628217, 6.057467534968267, 0.26426378576416704], "isController": false}, {"data": ["/moodle/my/courses.php-185", 50, 0, 0.0, 59.68, 44, 299, 53.0, 64.9, 75.24999999999997, 299.0, 0.5132995924401236, 4.41881773950559, 0.25915614188627334], "isController": false}, {"data": ["/moodle/theme/image.php/classic/core/1731384351/u/f1-208", 50, 0, 0.0, 9.379999999999999, 5, 22, 8.0, 16.9, 19.449999999999996, 22.0, 0.5133206714234383, 0.8010609696627483, 0.2621745226117756], "isController": false}, {"data": ["/moodle/course/view.php-196", 50, 0, 0.0, 74.83999999999997, 62, 118, 72.0, 86.6, 106.24999999999997, 118.0, 0.5129415144085271, 5.4092087107727975, 0.784439855042728], "isController": false}, {"data": ["/moodle/course/view.php-194", 50, 0, 0.0, 78.55999999999999, 60, 328, 72.0, 84.9, 95.39999999999995, 328.0, 0.5130941630408012, 5.410698205709712, 0.7846733001190379], "isController": false}, {"data": ["/moodle/course/view.php-192", 50, 0, 0.0, 75.53999999999999, 61, 108, 74.0, 96.29999999999998, 100.24999999999997, 108.0, 0.5130573085013596, 5.410610185470217, 0.7846169385870402], "isController": false}, {"data": ["/moodle/course/view.php-190", 50, 0, 0.0, 78.78, 61, 131, 74.0, 98.5, 112.4499999999999, 131.0, 0.5130309870716191, 5.410362664811205, 0.7845766853067926], "isController": false}, {"data": ["/moodle/course/view.php-188-1", 50, 0, 0.0, 18.94, 12, 35, 17.5, 25.0, 31.449999999999996, 35.0, 0.5136001314816336, 1.0081408830840661, 0.2628188172816172], "isController": false}, {"data": ["/moodle/user/view.php-199-0", 50, 0, 0.0, 20.480000000000008, 15, 31, 20.0, 25.9, 28.89999999999999, 31.0, 0.51316788800624, 1.014308403637334, 0.26610561380011083], "isController": false}, {"data": ["/moodle/course/view.php-188-0", 50, 0, 0.0, 31.26, 23, 72, 29.0, 36.9, 46.449999999999996, 72.0, 0.513457727025334, 1.052488055689625, 0.26274594625124514], "isController": false}, {"data": ["/moodle/user/view.php-199-1", 50, 0, 0.0, 42.81999999999999, 33, 60, 42.0, 51.8, 55.449999999999996, 60.0, 0.5130573085013596, 3.4191361557898516, 0.2630420771125135], "isController": false}, {"data": ["/moodle/calendar/view.php-187", 50, 0, 0.0, 52.260000000000005, 43, 77, 50.0, 61.0, 65.89999999999999, 77.0, 0.5133417521380683, 4.183524729597233, 0.2676997027751255], "isController": false}, {"data": ["/moodle/course/view.php-188-2", 50, 0, 0.0, 32.13999999999999, 25, 45, 31.0, 38.9, 42.34999999999999, 45.0, 0.5135157341220935, 3.354671918006943, 0.2597667483156684], "isController": false}, {"data": ["/moodle/pluginfile.php/69/mod_forum/attachment/331/%E0%A6%AA%E0%A6%B0%E0%A7%80%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A6%BE%E0%A6%B0%20%E0%A6%AB%E0%A6%BF%20%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4%20%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A7%8D%E0%A6%9E%E0%A6%AA%E0%A7%8D%E0%A6%A4%E0%A6%BF_20241130_0001.pdf-212", 50, 0, 0.0, 216.02000000000004, 158, 360, 210.0, 261.29999999999995, 295.9499999999999, 360.0, 0.5121901249743904, 420.693661487144, 0.4341611606228232], "isController": false}, {"data": ["/submit/firefox-desktop/newtab/1/4c825728-fb4c-4f22-895c-bd1fe3ca2115-181", 50, 0, 0.0, 425.08, 387, 459, 428.5, 451.8, 455.45, 459.0, 0.5113677040612824, 0.4037208072961944, 1.5161253413379425], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 50, 96.15384615384616, 1.8518518518518519], "isController": false}, {"data": ["The operation lasted too long: It took 853 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.9230769230769231, 0.037037037037037035], "isController": false}, {"data": ["The operation lasted too long: It took 546 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 1.9230769230769231, 0.037037037037037035], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 52, "400/Bad Request", 50, "The operation lasted too long: It took 853 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 546 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/complete/search-177", 50, 2, "The operation lasted too long: It took 853 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 546 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/safebrowsing/clientreport/download?key=AIzaSyC7jsptDS3am4tPx4r3nxis7IMjBc5Dovo-214", 50, 50, "400/Bad Request", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
