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

    var data = {"OkPercent": 93.75, "KoPercent": 6.25};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9371875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/complete/search-223"], "isController": false}, {"data": [1.0, 500, 1500, "/admission/pg-246"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-222"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-221"], "isController": false}, {"data": [1.0, 500, 1500, "/home/download/1306-248"], "isController": false}, {"data": [0.0, 500, 1500, "/web/assets/img/faculty/saidurrahmansaidphoto.jpg-242"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/events/1/ccdb98f0-2813-49ec-970c-f56c64e83e18-219"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/news/PG_Seminar_(CSE-BUET):_Efficie.jpg-229"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/newtab/1/2a6a15cc-4273-4fdf-bc75-ea9c4996ab12-225"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/faculty/rezwana.jpg-239"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/faculty/rakinhaiderwebPic.jpg-240"], "isController": false}, {"data": [1.0, 500, 1500, "/home-231"], "isController": false}, {"data": [1.0, 500, 1500, "/home-230"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice-249"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice-247"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/faculty/wasifwasif_p.JPG-238"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/faculty/sadia.jpg-237"], "isController": false}, {"data": [1.0, 500, 1500, "/faculty-236"], "isController": false}, {"data": [1.0, 500, 1500, "/research/publication-235"], "isController": false}, {"data": [0.99, 500, 1500, "/submit/firefox-desktop/dau-reporting/1/25b58615-3540-4110-bdb6-e15e47f810e9-218"], "isController": false}, {"data": [1.0, 500, 1500, "/public/img/service/Training.jpg-228"], "isController": false}, {"data": [1.0, 500, 1500, "/home/ra-244"], "isController": false}, {"data": [1.0, 500, 1500, "/academics/academic_calendar-233"], "isController": false}, {"data": [1.0, 500, 1500, "/academics/ug_studies-234"], "isController": false}, {"data": [1.0, 500, 1500, "/academics/class_routine-232"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/baseline/1/b4958f5d-c063-4d64-b5a1-f7a6fc265754-220"], "isController": false}, {"data": [1.0, 500, 1500, "/admission/ug-245"], "isController": false}, {"data": [1.0, 500, 1500, "/home-224"], "isController": false}, {"data": [0.0, 500, 1500, "/web/assets/img/faculty/-241"], "isController": false}, {"data": [1.0, 500, 1500, "/-243"], "isController": false}, {"data": [1.0, 500, 1500, "/public/img/Arrow-r.png-226"], "isController": false}, {"data": [1.0, 500, 1500, "/public/img/service/Consultancy.jpg-227"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1600, 100, 6.25, 80.03937500000005, 4, 901, 27.0, 274.0, 302.0, 451.98, 15.927054092257462, 739.721295217902, 11.818430183509527], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/complete/search-223", 50, 0, 0.0, 120.12, 109, 208, 117.0, 132.39999999999998, 141.39999999999995, 208.0, 0.5131994909061051, 0.9997968050765694, 0.146843213706532], "isController": false}, {"data": ["/admission/pg-246", 50, 0, 0.0, 14.22, 10, 29, 13.0, 18.9, 22.89999999999999, 29.0, 0.513948564027712, 1.9132538340562877, 0.25747618490841434], "isController": false}, {"data": ["/complete/search-222", 50, 0, 0.0, 118.96000000000004, 108, 142, 117.0, 129.5, 141.0, 142.0, 0.5131573545712057, 0.9983416197555318, 0.14683115711851882], "isController": false}, {"data": ["/complete/search-221", 50, 0, 0.0, 248.23999999999998, 217, 300, 240.5, 279.0, 281.45, 300.0, 0.512321327936882, 5.2696451214201545, 0.14559131487268814], "isController": false}, {"data": ["/home/download/1306-248", 50, 0, 0.0, 159.97999999999996, 129, 205, 157.5, 193.1, 200.14999999999998, 205.0, 0.5131731548859216, 322.8741160592407, 0.2595934513973705], "isController": false}, {"data": ["/web/assets/img/faculty/saidurrahmansaidphoto.jpg-242", 50, 50, 100.0, 8.340000000000002, 5, 16, 7.5, 13.0, 14.0, 16.0, 0.5140331037318803, 0.6736644777423666, 0.24898478462012955], "isController": false}, {"data": ["/submit/firefox-desktop/events/1/ccdb98f0-2813-49ec-970c-f56c64e83e18-219", 50, 0, 0.0, 283.31999999999994, 239, 327, 286.0, 314.9, 320.45, 327.0, 0.5117759649535819, 0.40366329235713777, 1.6642714485306913], "isController": false}, {"data": ["/web/assets/img/news/PG_Seminar_(CSE-BUET):_Efficie.jpg-229", 50, 0, 0.0, 26.039999999999992, 19, 53, 23.5, 39.19999999999999, 45.449999999999996, 53.0, 0.5136054072377274, 33.1616553759078, 0.250282322472291], "isController": false}, {"data": ["/submit/firefox-desktop/newtab/1/2a6a15cc-4273-4fdf-bc75-ea9c4996ab12-225", 50, 0, 0.0, 284.3, 236, 324, 287.0, 311.7, 315.34999999999997, 324.0, 0.5124420940433732, 0.41170518629832326, 1.5093021051121223], "isController": false}, {"data": ["/web/assets/img/faculty/rezwana.jpg-239", 50, 0, 0.0, 13.16, 9, 27, 12.0, 17.9, 23.0, 27.0, 0.5139538469445444, 16.10823707406075, 0.24191968186256874], "isController": false}, {"data": ["/web/assets/img/faculty/rakinhaiderwebPic.jpg-240", 50, 0, 0.0, 28.260000000000005, 19, 51, 27.0, 37.0, 42.24999999999998, 51.0, 0.5138904591097362, 48.43016100188084, 0.24690830652538107], "isController": false}, {"data": ["/home-231", 50, 0, 0.0, 21.100000000000005, 17, 32, 20.0, 26.0, 29.799999999999983, 32.0, 0.513874614594039, 3.7617227646454268, 0.24940984712230216], "isController": false}, {"data": ["/home-230", 50, 0, 0.0, 28.78, 23, 81, 27.0, 34.0, 38.449999999999996, 81.0, 0.5138270869087135, 3.761374847136442, 0.24938677948596738], "isController": false}, {"data": ["/home/notice-249", 50, 0, 0.0, 27.200000000000003, 21, 42, 26.0, 31.9, 35.89999999999999, 42.0, 0.5140172504189241, 1.798558406495122, 0.25700862520946205], "isController": false}, {"data": ["/home/notice-247", 50, 0, 0.0, 21.02, 14, 32, 20.0, 25.0, 27.0, 32.0, 0.5138904591097362, 1.7981147607326022, 0.2569452295548681], "isController": false}, {"data": ["/web/assets/img/faculty/wasifwasif_p.JPG-238", 50, 0, 0.0, 10.299999999999999, 7, 27, 9.5, 13.899999999999999, 15.0, 27.0, 0.5140225347479234, 8.498940952946377, 0.24446188908421743], "isController": false}, {"data": ["/web/assets/img/faculty/sadia.jpg-237", 50, 0, 0.0, 26.52, 19, 39, 26.0, 34.8, 37.0, 39.0, 0.5138851774959403, 42.32125467635512, 0.240883676951222], "isController": false}, {"data": ["/faculty-236", 50, 0, 0.0, 33.68000000000001, 24, 57, 32.0, 41.8, 45.449999999999996, 57.0, 0.5139010226630351, 2.634244597615499, 0.258957937201295], "isController": false}, {"data": ["/research/publication-235", 50, 0, 0.0, 85.27999999999999, 65, 114, 83.0, 98.69999999999999, 105.59999999999997, 114.0, 0.5136054072377274, 70.63528896082218, 0.26532935588745876], "isController": false}, {"data": ["/submit/firefox-desktop/dau-reporting/1/25b58615-3540-4110-bdb6-e15e47f810e9-218", 50, 0, 0.0, 446.07999999999987, 380, 901, 439.0, 466.0, 485.49999999999994, 901.0, 0.5085228428461006, 0.4176243846873602, 1.0955091712094707], "isController": false}, {"data": ["/public/img/service/Training.jpg-228", 50, 0, 0.0, 51.66000000000001, 39, 69, 50.5, 64.9, 67.35, 69.0, 0.5136159590750804, 99.9564870979671, 0.2387511684763069], "isController": false}, {"data": ["/home/ra-244", 50, 0, 0.0, 25.179999999999996, 19, 34, 25.0, 29.0, 32.89999999999999, 34.0, 0.5138957408321, 2.512267654888176, 0.2489182494655484], "isController": false}, {"data": ["/academics/academic_calendar-233", 50, 0, 0.0, 15.259999999999998, 11, 33, 14.0, 20.0, 26.24999999999998, 33.0, 0.513948564027712, 1.5875188554879427, 0.27052566016693047], "isController": false}, {"data": ["/academics/ug_studies-234", 50, 0, 0.0, 17.539999999999996, 10, 108, 15.0, 22.799999999999997, 28.499999999999957, 108.0, 0.5139274334463974, 1.6145552279268167, 0.2690088909445986], "isController": false}, {"data": ["/academics/class_routine-232", 50, 0, 0.0, 14.859999999999998, 10, 37, 14.0, 20.0, 29.29999999999994, 37.0, 0.5139379985198586, 1.4198540994264452, 0.2589765695666475], "isController": false}, {"data": ["/submit/firefox-desktop/baseline/1/b4958f5d-c063-4d64-b5a1-f7a6fc265754-220", 50, 0, 0.0, 283.4200000000001, 240, 316, 289.0, 303.0, 309.4, 316.0, 0.5119226791985338, 0.4237160019350677, 1.20981726919966], "isController": false}, {"data": ["/admission/ug-245", 50, 0, 0.0, 16.42, 12, 27, 15.0, 21.799999999999997, 26.449999999999996, 27.0, 0.513948564027712, 1.5057086836749378, 0.2549666704356228], "isController": false}, {"data": ["/home-224", 50, 0, 0.0, 49.52000000000001, 37, 72, 48.0, 59.699999999999996, 65.35, 72.0, 0.513557929334429, 3.7599060509963023, 0.22668767974527526], "isController": false}, {"data": ["/web/assets/img/faculty/-241", 50, 50, 100.0, 6.9, 5, 14, 6.0, 9.0, 11.449999999999996, 14.0, 0.5140331037318803, 0.20832396293821323, 0.23643514829855045], "isController": false}, {"data": ["/-243", 50, 0, 0.0, 26.319999999999997, 22, 40, 25.0, 30.9, 38.89999999999999, 40.0, 0.5139010226630351, 3.761916079962999, 0.2489208078524076], "isController": false}, {"data": ["/public/img/Arrow-r.png-226", 50, 0, 0.0, 6.9799999999999995, 4, 20, 6.0, 10.899999999999999, 15.449999999999996, 20.0, 0.513816526394755, 0.47668525397950895, 0.23432843537729545], "isController": false}, {"data": ["/public/img/service/Consultancy.jpg-227", 50, 0, 0.0, 42.29999999999999, 32, 75, 41.0, 56.699999999999996, 61.449999999999996, 75.0, 0.5135315565141478, 79.01214582370461, 0.24021642145534844], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 50, 50.0, 3.125], "isController": false}, {"data": ["404/Not Found", 50, 50.0, 3.125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1600, 100, "403/Forbidden", 50, "404/Not Found", 50, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/assets/img/faculty/saidurrahmansaidphoto.jpg-242", 50, 50, "404/Not Found", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/assets/img/faculty/-241", 50, 50, "403/Forbidden", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
