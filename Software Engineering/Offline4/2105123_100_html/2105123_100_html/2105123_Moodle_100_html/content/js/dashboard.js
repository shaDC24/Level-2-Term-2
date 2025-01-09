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

    var data = {"OkPercent": 97.5, "KoPercent": 2.5};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/moodle/course/view.php-201"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/-184"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/pluginfile.php/5/user/icon/classic/f1-209"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/index.php-186"], "isController": false}, {"data": [0.98, 500, 1500, "/complete/search-179"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-178"], "isController": false}, {"data": [0.81, 500, 1500, "/complete/search-177"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/view.php-216"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/index.php-205"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-201-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/my/courses.php-206"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-201-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-201-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/my/courses.php-204"], "isController": false}, {"data": [1.0, 500, 1500, "/public/img/program/pg-ds.jpg-182"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/user/view.php-199"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/calendar/view.php-203"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/discuss.php-215"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/view.php-207"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/discuss.php-213"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-188"], "isController": false}, {"data": [0.97, 500, 1500, "/submit/firefox-desktop/pageload/1/7056d988-e775-4a21-a4d0-627003d73994-198"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/mod/forum/discuss.php-210"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-196-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-196-1"], "isController": false}, {"data": [0.0, 500, 1500, "/safebrowsing/clientreport/download?key=AIzaSyC7jsptDS3am4tPx4r3nxis7IMjBc5Dovo-214"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/theme/image.php/classic/core/1731384351/f/pdf-128-211"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-190-0"], "isController": false}, {"data": [0.99, 500, 1500, "/complete/search-183"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-190-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-192-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-190-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-192-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-194-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-192-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-194-2"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-196-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-194-1"], "isController": false}, {"data": [1.0, 500, 1500, "/-180"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/-217"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/my/courses.php-185"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/theme/image.php/classic/core/1731384351/u/f1-208"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-196"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-194"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-192"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-190"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-188-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/user/view.php-199-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-188-0"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/user/view.php-199-1"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/calendar/view.php-187"], "isController": false}, {"data": [1.0, 500, 1500, "/moodle/course/view.php-188-2"], "isController": false}, {"data": [0.98, 500, 1500, "/moodle/pluginfile.php/69/mod_forum/attachment/331/%E0%A6%AA%E0%A6%B0%E0%A7%80%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A6%BE%E0%A6%B0%20%E0%A6%AB%E0%A6%BF%20%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4%20%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A7%8D%E0%A6%9E%E0%A6%AA%E0%A7%8D%E0%A6%A4%E0%A6%BF_20241130_0001.pdf-212"], "isController": false}, {"data": [0.92, 500, 1500, "/submit/firefox-desktop/newtab/1/4c825728-fb4c-4f22-895c-bd1fe3ca2115-181"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5400, 135, 2.5, 92.90425925925948, 5, 1433, 55.0, 204.0, 349.9499999999998, 476.0, 52.35906684507534, 1234.2781145160666, 39.8222821765858], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/moodle/course/view.php-201", 100, 0, 0.0, 92.25, 61, 277, 80.0, 128.8, 168.69999999999993, 276.2899999999996, 1.018143313852858, 10.738319748544054, 1.5570433881773198], "isController": false}, {"data": ["/moodle/-184", 100, 0, 0.0, 146.9699999999999, 126, 474, 142.0, 161.9, 171.74999999999994, 471.0899999999985, 1.019378383062009, 12.026305616647468, 0.4529464495050918], "isController": false}, {"data": ["/moodle/pluginfile.php/5/user/icon/classic/f1-209", 100, 0, 0.0, 22.9, 11, 77, 19.0, 35.900000000000006, 40.94999999999999, 76.82999999999991, 1.0185373803218578, 4.762457985333062, 0.5212046750865756], "isController": false}, {"data": ["/moodle/course/index.php-186", 100, 0, 0.0, 53.64, 38, 112, 50.5, 66.9, 73.89999999999998, 111.76999999999988, 1.0200854831634891, 8.092107024818679, 0.5170159821893074], "isController": false}, {"data": ["/complete/search-179", 100, 2, 2.0, 193.57999999999996, 168, 607, 182.0, 201.70000000000002, 217.74999999999994, 606.7699999999999, 1.019160211985324, 1.4655404415511617, 0.2926104514879739], "isController": false}, {"data": ["/complete/search-178", 100, 0, 0.0, 192.33999999999992, 172, 299, 186.0, 207.60000000000002, 254.79999999999973, 298.95, 1.019139438657997, 1.9702433577587086, 0.29160923391288396], "isController": false}, {"data": ["/complete/search-177", 100, 19, 19.0, 473.35000000000014, 382, 1433, 425.0, 540.0, 768.9999999999995, 1427.5499999999972, 1.0064918725781289, 10.712562827109858, 0.2860245458205425], "isController": false}, {"data": ["/moodle/mod/forum/view.php-216", 100, 0, 0.0, 108.06999999999996, 90, 160, 106.0, 119.9, 126.94999999999999, 159.95, 1.0164977586224424, 15.964682976584974, 0.5499411701922198], "isController": false}, {"data": ["/moodle/course/index.php-205", 100, 0, 0.0, 52.519999999999996, 37, 94, 48.5, 68.0, 74.84999999999997, 93.90999999999995, 1.0182780917468561, 8.07802794536938, 0.5300217020518304], "isController": false}, {"data": ["/moodle/course/view.php-201-2", 100, 0, 0.0, 35.370000000000005, 23, 108, 31.0, 47.900000000000006, 62.799999999999955, 107.67999999999984, 1.0185166323766066, 6.655260208719521, 0.515226187081135], "isController": false}, {"data": ["/moodle/my/courses.php-206", 100, 0, 0.0, 59.760000000000005, 45, 234, 55.0, 76.70000000000002, 85.79999999999995, 232.75999999999937, 1.0183403089644496, 8.76727359749081, 0.5300540865996599], "isController": false}, {"data": ["/moodle/course/view.php-201-1", 100, 0, 0.0, 22.820000000000007, 12, 78, 18.5, 35.900000000000006, 51.69999999999993, 77.78999999999989, 1.0186515091322108, 1.9995014974177185, 0.5212630769387485], "isController": false}, {"data": ["/moodle/course/view.php-201-0", 100, 0, 0.0, 33.77, 21, 91, 29.5, 49.900000000000006, 58.849999999999966, 90.82999999999991, 1.0185788787483703, 2.0878877602469035, 0.5212259106095176], "isController": false}, {"data": ["/moodle/my/courses.php-204", 100, 0, 0.0, 58.13999999999999, 40, 97, 54.0, 75.0, 85.84999999999997, 96.93999999999997, 1.0182262498727217, 8.766381112539456, 0.5449101415334487], "isController": false}, {"data": ["/public/img/program/pg-ds.jpg-182", 100, 0, 0.0, 55.89999999999999, 27, 210, 44.5, 105.60000000000002, 114.84999999999997, 209.88999999999993, 1.0210332856851134, 115.62703408974883, 0.4676412216663263], "isController": false}, {"data": ["/moodle/user/view.php-199", 100, 0, 0.0, 74.44000000000001, 49, 298, 66.0, 98.50000000000003, 124.5499999999999, 296.6399999999993, 1.0182884607551628, 8.800329304941755, 1.0501099751537617], "isController": false}, {"data": ["/moodle/calendar/view.php-203", 100, 0, 0.0, 57.12999999999999, 39, 116, 54.0, 69.9, 82.74999999999994, 115.81999999999991, 1.0182366178252502, 8.298290348898776, 0.5309944862487145], "isController": false}, {"data": ["/moodle/mod/forum/discuss.php-215", 100, 0, 0.0, 72.56000000000002, 55, 191, 68.5, 87.80000000000001, 101.69999999999993, 190.50999999999976, 1.0169939692257626, 9.976998853974921, 0.5531891024011228], "isController": false}, {"data": ["/moodle/mod/forum/view.php-207", 100, 0, 0.0, 108.14000000000006, 90, 160, 105.5, 118.9, 134.84999999999997, 159.92999999999995, 1.0176563374548415, 15.982700239785274, 0.5376485142217473], "isController": false}, {"data": ["/moodle/mod/forum/discuss.php-213", 100, 0, 0.0, 70.17, 56, 115, 67.0, 81.9, 94.79999999999995, 114.91999999999996, 1.0168388513788336, 9.975348013096886, 0.5501257067030018], "isController": false}, {"data": ["/moodle/course/view.php-188", 100, 0, 0.0, 97.18999999999997, 64, 397, 85.0, 125.0, 172.64999999999992, 394.979999999999, 1.0192329253004189, 10.749702352134783, 1.5587097275590391], "isController": false}, {"data": ["/submit/firefox-desktop/pageload/1/7056d988-e775-4a21-a4d0-627003d73994-198", 100, 3, 3.0, 295.58000000000015, 238, 574, 288.5, 319.0, 346.0, 573.8799999999999, 1.0160742953524762, 0.8093766034922473, 4.56042720843748], "isController": false}, {"data": ["/moodle/mod/forum/discuss.php-210", 100, 0, 0.0, 71.44, 54, 124, 68.5, 84.9, 92.84999999999997, 123.77999999999989, 1.017956757196954, 10.161256279520746, 0.5507305112178834], "isController": false}, {"data": ["/moodle/course/view.php-196-2", 100, 0, 0.0, 37.29, 23, 91, 35.0, 49.900000000000006, 57.74999999999994, 90.90999999999995, 1.01875528479304, 6.657137988493159, 0.5153469116433541], "isController": false}, {"data": ["/moodle/course/view.php-196-1", 100, 0, 0.0, 25.469999999999995, 11, 161, 21.0, 38.900000000000006, 48.64999999999992, 160.1899999999996, 1.0188902247671836, 1.9999700700996474, 0.5213852322050823], "isController": false}, {"data": ["/safebrowsing/clientreport/download?key=AIzaSyC7jsptDS3am4tPx4r3nxis7IMjBc5Dovo-214", 100, 100, 100.0, 372.44, 331, 952, 349.0, 406.20000000000005, 543.8, 949.9499999999989, 1.01414735561077, 0.6418146423862887, 1.5132980072004463], "isController": false}, {"data": ["/moodle/theme/image.php/classic/core/1731384351/f/pdf-128-211", 100, 0, 0.0, 14.14, 6, 59, 11.0, 22.900000000000006, 36.94999999999999, 58.929999999999964, 1.0185270062435705, 10.90639514009839, 0.5281619534329453], "isController": false}, {"data": ["/moodle/course/view.php-190-0", 100, 0, 0.0, 35.02, 22, 77, 32.0, 52.0, 61.89999999999998, 76.92999999999996, 1.0195654612004363, 2.0899100615817536, 0.5217307633486608], "isController": false}, {"data": ["/complete/search-183", 100, 1, 1.0, 205.95, 159, 795, 192.0, 259.9, 272.84999999999997, 790.0099999999975, 1.019222537048739, 11.610387932022952, 0.2896423420714679], "isController": false}, {"data": ["/moodle/course/view.php-190-2", 100, 0, 0.0, 35.449999999999996, 23, 76, 31.0, 49.80000000000001, 70.19999999999982, 75.99, 1.0195758564437194, 6.6622511597675365, 0.5157620055057096], "isController": false}, {"data": ["/moodle/course/view.php-192-0", 100, 0, 0.0, 34.600000000000016, 21, 71, 30.0, 52.900000000000006, 60.94999999999999, 70.97999999999999, 1.019555066169124, 2.0898887537978426, 0.5217254440162313], "isController": false}, {"data": ["/moodle/course/view.php-190-1", 100, 0, 0.0, 23.349999999999994, 11, 67, 19.0, 38.900000000000006, 49.799999999999955, 66.94999999999997, 1.0197422091695219, 2.0016424222956437, 0.5218212085984664], "isController": false}, {"data": ["/moodle/course/view.php-192-2", 100, 0, 0.0, 34.970000000000006, 23, 94, 33.0, 45.900000000000006, 58.849999999999966, 93.75999999999988, 1.0194719135487815, 6.661711342899378, 0.5157094250178408], "isController": false}, {"data": ["/moodle/course/view.php-194-0", 100, 0, 0.0, 33.930000000000014, 20, 108, 29.0, 48.80000000000001, 55.0, 107.5999999999998, 1.0191913735642142, 2.0891432549914897, 0.5215393356910627], "isController": false}, {"data": ["/moodle/course/view.php-192-1", 100, 0, 0.0, 22.000000000000004, 13, 64, 19.0, 34.900000000000006, 43.849999999999966, 63.909999999999954, 1.0195862518989793, 2.001336295231395, 0.5217414023389308], "isController": false}, {"data": ["/moodle/course/view.php-194-2", 100, 0, 0.0, 36.85999999999999, 24, 86, 33.5, 54.900000000000006, 60.94999999999999, 85.84999999999992, 1.01870339431971, 6.65663973363453, 0.515320662360947], "isController": false}, {"data": ["/moodle/course/view.php-196-0", 100, 0, 0.0, 36.770000000000024, 21, 90, 33.0, 53.0, 59.799999999999955, 89.97999999999999, 1.0187137719914836, 2.0881642650489494, 0.521294938011267], "isController": false}, {"data": ["/moodle/course/view.php-194-1", 100, 0, 0.0, 23.390000000000004, 12, 85, 20.0, 38.0, 44.849999999999966, 84.71999999999986, 1.0189317519512544, 2.0000515834199426, 0.5214064824438059], "isController": false}, {"data": ["/-180", 100, 0, 0.0, 70.55, 35, 320, 59.5, 104.9, 137.5999999999999, 319.2499999999996, 1.0207831448287126, 7.473448473418807, 0.44659262586256177], "isController": false}, {"data": ["/moodle/-217", 100, 0, 0.0, 141.01, 121, 196, 138.0, 156.8, 162.84999999999997, 195.76999999999987, 1.0161775465409317, 11.988989716283228, 0.522974186549874], "isController": false}, {"data": ["/moodle/my/courses.php-185", 100, 0, 0.0, 58.749999999999986, 44, 111, 56.0, 71.80000000000001, 81.69999999999993, 110.87999999999994, 1.0201375145369596, 8.782776301057883, 0.5150498974761798], "isController": false}, {"data": ["/moodle/theme/image.php/classic/core/1731384351/u/f1-208", 100, 0, 0.0, 14.04, 5, 62, 10.5, 24.0, 33.89999999999998, 61.93999999999997, 1.0186826396104556, 1.589702009860848, 0.5202841997229183], "isController": false}, {"data": ["/moodle/course/view.php-196", 100, 0, 0.0, 99.84000000000003, 59, 267, 88.5, 140.60000000000002, 157.89999999999998, 266.91999999999996, 1.0182469859889216, 10.73973137689903, 1.5572019336510263], "isController": false}, {"data": ["/moodle/course/view.php-194", 100, 0, 0.0, 94.43000000000002, 59, 279, 84.0, 143.60000000000002, 152.74999999999994, 278.0899999999995, 1.0182158821313294, 10.739244219715713, 1.5571543666188106], "isController": false}, {"data": ["/moodle/course/view.php-192", 100, 0, 0.0, 91.79, 63, 229, 80.5, 130.70000000000002, 161.44999999999987, 228.63999999999982, 1.0190459691636689, 10.74804900464685, 1.5584238161233452], "isController": false}, {"data": ["/moodle/course/view.php-190", 100, 0, 0.0, 94.03, 62, 209, 83.0, 133.90000000000006, 165.44999999999987, 208.85999999999993, 1.0190978945437499, 10.748457340562133, 1.558503225444836], "isController": false}, {"data": ["/moodle/course/view.php-188-1", 100, 0, 0.0, 23.230000000000008, 12, 56, 20.0, 36.900000000000006, 43.94999999999999, 55.969999999999985, 1.0200022440049368, 2.002152842236253, 0.5219542732994013], "isController": false}, {"data": ["/moodle/user/view.php-199-0", 100, 0, 0.0, 26.330000000000002, 13, 255, 20.0, 37.0, 54.499999999999886, 253.089999999999, 1.0186722625729625, 2.013469393991871, 0.5282372767834405], "isController": false}, {"data": ["/moodle/course/view.php-188-0", 100, 0, 0.0, 35.280000000000015, 22, 78, 32.0, 47.900000000000006, 60.94999999999999, 77.87999999999994, 1.020075077525706, 2.090954675514118, 0.5219915435776074], "isController": false}, {"data": ["/moodle/user/view.php-199-1", 100, 0, 0.0, 47.96999999999999, 31, 98, 45.0, 61.80000000000001, 71.89999999999998, 97.95999999999998, 1.0184958852766235, 6.789001151536911, 0.5221780661818627], "isController": false}, {"data": ["/moodle/calendar/view.php-187", 100, 0, 0.0, 59.31999999999999, 43, 273, 54.0, 76.60000000000002, 84.0, 271.36999999999915, 1.0199710328226679, 8.312485019175455, 0.5318989565696334], "isController": false}, {"data": ["/moodle/course/view.php-188-2", 100, 0, 0.0, 38.45999999999999, 24, 351, 32.0, 50.80000000000001, 58.89999999999998, 348.2599999999986, 1.0196694231730072, 6.662683317443485, 0.515809337112908], "isController": false}, {"data": ["/moodle/pluginfile.php/69/mod_forum/attachment/331/%E0%A6%AA%E0%A6%B0%E0%A7%80%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A6%BE%E0%A6%B0%20%E0%A6%AB%E0%A6%BF%20%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4%20%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A7%8D%E0%A6%9E%E0%A6%AA%E0%A7%8D%E0%A6%A4%E0%A6%BF_20241130_0001.pdf-212", 100, 2, 2.0, 248.57999999999998, 159, 597, 224.0, 358.9, 434.9, 596.1099999999996, 1.0157749855252065, 834.3192831548955, 0.8610280150741008], "isController": false}, {"data": ["/submit/firefox-desktop/newtab/1/4c825728-fb4c-4f22-895c-bd1fe3ca2115-181", 100, 8, 8.0, 453.55999999999983, 375, 1158, 428.5, 468.9, 732.0499999999995, 1155.4399999999987, 1.0169215750081353, 0.8132790572628539, 3.0150135759030263], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 517 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 574 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 607 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 584 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 734 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 525 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 806 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["400/Bad Request", 100, 74.07407407407408, 1.8518518518518519], "isController": false}, {"data": ["The operation lasted too long: It took 1,158 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 522 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 731 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 506 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 509 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 508 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 670 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 750 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 795 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 505 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 562 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 771 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, 1.4814814814814814, 0.037037037037037035], "isController": false}, {"data": ["The operation lasted too long: It took 502 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 902 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 558 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 1,433 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 501 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 575 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 695 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 531 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 709 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 888 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 817 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 541 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 597 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 706 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}, {"data": ["The operation lasted too long: It took 687 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 0.7407407407407407, 0.018518518518518517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5400, 135, "400/Bad Request", 100, "The operation lasted too long: It took 771 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, "The operation lasted too long: It took 517 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 574 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 607 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/complete/search-179", 100, 2, "The operation lasted too long: It took 607 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 584 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/complete/search-177", 100, 19, "The operation lasted too long: It took 771 milliseconds, but should not have lasted longer than 500 milliseconds.", 2, "The operation lasted too long: It took 670 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 517 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 505 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 502 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/submit/firefox-desktop/pageload/1/7056d988-e775-4a21-a4d0-627003d73994-198", 100, 3, "The operation lasted too long: It took 574 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 562 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 558 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/safebrowsing/clientreport/download?key=AIzaSyC7jsptDS3am4tPx4r3nxis7IMjBc5Dovo-214", 100, 100, "400/Bad Request", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/complete/search-183", 100, 1, "The operation lasted too long: It took 795 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/moodle/pluginfile.php/69/mod_forum/attachment/331/%E0%A6%AA%E0%A6%B0%E0%A7%80%E0%A6%95%E0%A7%8D%E0%A6%B7%E0%A6%BE%E0%A6%B0%20%E0%A6%AB%E0%A6%BF%20%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4%20%E0%A6%AC%E0%A6%BF%E0%A6%9C%E0%A7%8D%E0%A6%9E%E0%A6%AA%E0%A7%8D%E0%A6%A4%E0%A6%BF_20241130_0001.pdf-212", 100, 2, "The operation lasted too long: It took 508 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 597 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/submit/firefox-desktop/newtab/1/4c825728-fb4c-4f22-895c-bd1fe3ca2115-181", 100, 8, "The operation lasted too long: It took 1,158 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 695 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 750 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 902 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 734 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
