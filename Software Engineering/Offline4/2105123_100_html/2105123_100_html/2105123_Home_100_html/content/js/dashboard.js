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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.935625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/complete/search-223"], "isController": false}, {"data": [1.0, 500, 1500, "/admission/pg-246"], "isController": false}, {"data": [1.0, 500, 1500, "/complete/search-222"], "isController": false}, {"data": [0.965, 500, 1500, "/complete/search-221"], "isController": false}, {"data": [1.0, 500, 1500, "/home/download/1306-248"], "isController": false}, {"data": [0.0, 500, 1500, "/web/assets/img/faculty/saidurrahmansaidphoto.jpg-242"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/events/1/ccdb98f0-2813-49ec-970c-f56c64e83e18-219"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/news/PG_Seminar_(CSE-BUET):_Efficie.jpg-229"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/newtab/1/2a6a15cc-4273-4fdf-bc75-ea9c4996ab12-225"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/faculty/rezwana.jpg-239"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/faculty/rakinhaiderwebPic.jpg-240"], "isController": false}, {"data": [1.0, 500, 1500, "/home-231"], "isController": false}, {"data": [1.0, 500, 1500, "/home-230"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice-249"], "isController": false}, {"data": [1.0, 500, 1500, "/home/notice-247"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/faculty/wasifwasif_p.JPG-238"], "isController": false}, {"data": [1.0, 500, 1500, "/web/assets/img/faculty/sadia.jpg-237"], "isController": false}, {"data": [1.0, 500, 1500, "/faculty-236"], "isController": false}, {"data": [1.0, 500, 1500, "/research/publication-235"], "isController": false}, {"data": [0.975, 500, 1500, "/submit/firefox-desktop/dau-reporting/1/25b58615-3540-4110-bdb6-e15e47f810e9-218"], "isController": false}, {"data": [1.0, 500, 1500, "/public/img/service/Training.jpg-228"], "isController": false}, {"data": [1.0, 500, 1500, "/home/ra-244"], "isController": false}, {"data": [1.0, 500, 1500, "/academics/academic_calendar-233"], "isController": false}, {"data": [1.0, 500, 1500, "/academics/ug_studies-234"], "isController": false}, {"data": [1.0, 500, 1500, "/academics/class_routine-232"], "isController": false}, {"data": [1.0, 500, 1500, "/submit/firefox-desktop/baseline/1/b4958f5d-c063-4d64-b5a1-f7a6fc265754-220"], "isController": false}, {"data": [1.0, 500, 1500, "/admission/ug-245"], "isController": false}, {"data": [1.0, 500, 1500, "/home-224"], "isController": false}, {"data": [0.0, 500, 1500, "/web/assets/img/faculty/-241"], "isController": false}, {"data": [1.0, 500, 1500, "/-243"], "isController": false}, {"data": [1.0, 500, 1500, "/public/img/Arrow-r.png-226"], "isController": false}, {"data": [1.0, 500, 1500, "/public/img/service/Consultancy.jpg-227"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3200, 200, 6.25, 92.99468749999997, 4, 869, 28.0, 295.0, 401.0, 461.9899999999998, 31.482119140144622, 1460.08513469059, 23.360831509174087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/complete/search-223", 100, 0, 0.0, 198.64999999999995, 176, 286, 197.0, 216.9, 228.79999999999995, 285.5899999999998, 1.0143016533116949, 1.9481228287605232, 0.2902249847854752], "isController": false}, {"data": ["/admission/pg-246", 100, 0, 0.0, 17.090000000000003, 10, 133, 13.0, 25.0, 27.94999999999999, 132.56999999999977, 1.0189732825205324, 3.7932872587580753, 0.5104817323564775], "isController": false}, {"data": ["/complete/search-222", 100, 0, 0.0, 193.86999999999998, 174, 291, 191.0, 210.8, 218.95, 290.4499999999997, 1.014630978713042, 1.9460800524817872, 0.2903192155887903], "isController": false}, {"data": ["/complete/search-221", 100, 0, 0.0, 429.93000000000006, 380, 633, 415.0, 489.20000000000005, 502.95, 632.2999999999996, 1.012248203259439, 8.35152216823565, 0.2876603780747039], "isController": false}, {"data": ["/home/download/1306-248", 100, 0, 0.0, 162.41999999999993, 114, 352, 154.0, 204.9, 236.4999999999999, 351.2399999999996, 1.0182055146010671, 640.6262727568933, 0.5150688052376492], "isController": false}, {"data": ["/web/assets/img/faculty/saidurrahmansaidphoto.jpg-242", 100, 100, 100.0, 10.430000000000003, 5, 137, 8.0, 14.0, 19.849999999999966, 136.0199999999995, 1.0189109879360938, 1.3353306111428105, 0.49353500978154546], "isController": false}, {"data": ["/submit/firefox-desktop/events/1/ccdb98f0-2813-49ec-970c-f56c64e83e18-219", 100, 0, 0.0, 287.9699999999999, 238, 421, 287.5, 322.9, 328.95, 420.6899999999998, 1.0133252267315194, 0.8151330622688352, 3.295286137710898], "isController": false}, {"data": ["/web/assets/img/news/PG_Seminar_(CSE-BUET):_Efficie.jpg-229", 100, 0, 0.0, 41.169999999999995, 16, 195, 26.0, 86.0, 118.59999999999991, 194.85999999999993, 1.0176356253879737, 65.70507520327271, 0.49589861041855354], "isController": false}, {"data": ["/submit/firefox-desktop/newtab/1/2a6a15cc-4273-4fdf-bc75-ea9c4996ab12-225", 100, 0, 0.0, 284.33000000000015, 239, 381, 288.5, 311.0, 312.0, 380.3499999999997, 1.0156305542295934, 0.8169775818598227, 2.9913493667543496], "isController": false}, {"data": ["/web/assets/img/faculty/rezwana.jpg-239", 100, 0, 0.0, 13.609999999999998, 8, 49, 12.0, 21.80000000000001, 24.0, 48.87999999999994, 1.0189421342761944, 31.93547739986346, 0.4796192467979743], "isController": false}, {"data": ["/web/assets/img/faculty/rakinhaiderwebPic.jpg-240", 100, 0, 0.0, 29.04, 19, 179, 25.0, 36.0, 43.849999999999966, 178.37999999999968, 1.0188383205469123, 96.01755203716722, 0.48951997432527433], "isController": false}, {"data": ["/home-231", 100, 0, 0.0, 22.75, 16, 63, 20.0, 30.700000000000017, 43.849999999999966, 62.949999999999974, 1.018402533785504, 7.4550247981016975, 0.49428326102675346], "isController": false}, {"data": ["/home-230", 100, 0, 0.0, 30.440000000000005, 20, 122, 27.0, 39.80000000000001, 49.799999999999955, 121.71999999999986, 1.018267722949718, 7.454037940655357, 0.4942178303769627], "isController": false}, {"data": ["/home/notice-249", 100, 0, 0.0, 29.429999999999996, 17, 49, 27.0, 38.0, 43.0, 48.989999999999995, 1.0200646721002111, 3.569230195444391, 0.5100323360501056], "isController": false}, {"data": ["/home/notice-247", 100, 0, 0.0, 22.81, 15, 57, 21.0, 30.0, 33.94999999999999, 56.87999999999994, 1.019025200493208, 3.5655930599288723, 0.5095126002466042], "isController": false}, {"data": ["/web/assets/img/faculty/wasifwasif_p.JPG-238", 100, 0, 0.0, 11.149999999999999, 7, 74, 9.0, 16.900000000000006, 21.0, 73.70999999999985, 1.018962899560827, 16.847715676234728, 0.48460442586535424], "isController": false}, {"data": ["/web/assets/img/faculty/sadia.jpg-237", 100, 0, 0.0, 25.08, 17, 74, 23.0, 32.0, 39.799999999999955, 73.89999999999995, 1.0188279403374358, 83.90605260208656, 0.47757559703317304], "isController": false}, {"data": ["/faculty-236", 100, 0, 0.0, 33.54000000000001, 23, 69, 32.0, 41.0, 46.89999999999998, 68.8099999999999, 1.0186411327289395, 5.221530571966996, 0.5132996332891923], "isController": false}, {"data": ["/research/publication-235", 100, 0, 0.0, 85.83000000000001, 63, 238, 82.5, 96.9, 105.0, 236.87999999999943, 1.017884225848152, 139.98790785348575, 0.5258405815172582], "isController": false}, {"data": ["/submit/firefox-desktop/dau-reporting/1/25b58615-3540-4110-bdb6-e15e47f810e9-218", 100, 0, 0.0, 436.89000000000004, 372, 869, 429.5, 461.8, 501.0999999999998, 866.5399999999987, 1.0074044225054146, 0.8096521149196595, 2.1702481992645946], "isController": false}, {"data": ["/public/img/service/Training.jpg-228", 100, 0, 0.0, 56.55, 35, 291, 48.0, 75.70000000000002, 110.79999999999995, 290.2399999999996, 1.017956757196954, 198.10790468870883, 0.4731908363532717], "isController": false}, {"data": ["/home/ra-244", 100, 0, 0.0, 26.970000000000013, 17, 94, 25.0, 33.900000000000006, 36.94999999999999, 93.64999999999982, 1.0188071805530086, 4.98061400961754, 0.49348472808036353], "isController": false}, {"data": ["/academics/academic_calendar-233", 100, 0, 0.0, 16.230000000000004, 10, 74, 13.0, 26.700000000000017, 35.0, 73.75999999999988, 1.0186100047874669, 3.146351020647225, 0.5361628833793406], "isController": false}, {"data": ["/academics/ug_studies-234", 100, 0, 0.0, 15.909999999999993, 10, 81, 14.0, 20.0, 27.94999999999999, 80.5999999999998, 1.0186722625729625, 3.200262371774629, 0.533211262440535], "isController": false}, {"data": ["/academics/class_routine-232", 100, 0, 0.0, 15.340000000000002, 10, 42, 13.0, 22.0, 34.74999999999994, 41.97999999999999, 1.0185270062435705, 2.8138797858037705, 0.5132421242399242], "isController": false}, {"data": ["/submit/firefox-desktop/baseline/1/b4958f5d-c063-4d64-b5a1-f7a6fc265754-220", 100, 0, 0.0, 291.46999999999997, 238, 404, 291.5, 327.0, 333.74999999999994, 403.4899999999997, 1.012945442758453, 0.8144318768866109, 2.3938749721440002], "isController": false}, {"data": ["/admission/ug-245", 100, 0, 0.0, 17.93, 10, 119, 14.5, 23.900000000000006, 32.0, 118.78999999999989, 1.0189109879360938, 2.985090784969025, 0.5054753729214215], "isController": false}, {"data": ["/home-224", 100, 0, 0.0, 69.05999999999997, 38, 223, 58.0, 110.70000000000002, 137.69999999999993, 222.87999999999994, 1.0158162591550441, 7.43708446766149, 0.44838764564265615], "isController": false}, {"data": ["/web/assets/img/faculty/-241", 100, 100, 100.0, 9.06, 4, 130, 6.0, 13.900000000000006, 17.899999999999977, 129.13999999999956, 1.018962899560827, 0.4129585969899836, 0.46868313055971633], "isController": false}, {"data": ["/-243", 100, 0, 0.0, 26.68999999999999, 21, 92, 24.0, 31.0, 36.849999999999966, 91.63999999999982, 1.0188279403374358, 7.458138907001386, 0.49349478360094545], "isController": false}, {"data": ["/public/img/Arrow-r.png-226", 100, 0, 0.0, 13.770000000000008, 4, 206, 7.0, 25.900000000000006, 39.399999999999864, 204.57999999999927, 1.0177599104371278, 0.9442108544094449, 0.46415417790443236], "isController": false}, {"data": ["/public/img/service/Consultancy.jpg-227", 100, 0, 0.0, 50.419999999999995, 27, 166, 41.0, 89.80000000000001, 105.84999999999997, 165.90999999999997, 1.017780627563535, 156.59608517042736, 0.476090742776302], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 100, 50.0, 3.125], "isController": false}, {"data": ["404/Not Found", 100, 50.0, 3.125], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3200, 200, "403/Forbidden", 100, "404/Not Found", 100, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/assets/img/faculty/saidurrahmansaidphoto.jpg-242", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/web/assets/img/faculty/-241", 100, 100, "403/Forbidden", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
