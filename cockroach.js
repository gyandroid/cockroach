function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

function drawTable(data, tableid, dimensions, valueFunc, textFunc) {
	
    var sortValueAscending = function (a, b) { return valueFunc(a) - valueFunc(b); };
    var sortValueDescending = function (a, b) { return valueFunc(b) - valueFunc(a); };
    var sortNameAscending = function (a, b) { return textFunc(a).localeCompare(textFunc(b)); };
    var sortNameDescending = function (a, b) { return textFunc(b).localeCompare(textFunc(a)); };
    var metricAscending = true;
    var nameAscending = true;

    var width = dimensions.width + "px";
    var height = dimensions.height + "px";
    var twidth = (dimensions.width - 25) + "px";
    var divHeight = (dimensions.height - 60) + "px";

    var outerTable = d3.select(tableid).append("table").attr("width", width);
    var columns = getKeys(data);
    alert(columns);
    outerTable
		.append("tr")
		.append("td")
        .append("table").attr("class", "headerTable").attr("width", twidth)
        .append("tr").selectAll("th").data(columns).enter()
		.append("th")
		.text(function (column) { return column; })
        .on("click", function (d) {
            var sort;
			
            // Choose appropriate sorting function.
            if (d === columns[1]) {
                if (metricAscending) sort = sortValueAscending;
                else sort = sortValueDescending;
                metricAscending = !metricAscending;
            } else if(d === columns[0]) {
                if (nameAscending) sort = sortNameAscending;
                else sort = sortNameDescending;
                nameAscending = !nameAscending;
            }
			
            var rows = tbody.selectAll("tr").sort(sort);
        });

    var inner = outerTable
		.append("tr")
		.append("td")
		.append("div").attr("class", "scroll").attr("width", width).attr("style", "height:" + divHeight + ";")
		.append("table").attr("class", "bodyTable").attr("border", 1).attr("width", twidth).attr("height", height).attr("style", "table-layout:fixed");

    var tbody = inner.append("tbody");
    // Create a row for each object in the data and perform an intial sort.
    var rows = tbody.selectAll("tr").data(data).enter().append("tr").sort(sortValueDescending);

    // Create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function (d) {
            return columns.map(function (column) {
                return { column: column, text: textFunc(d), value: valueFunc(d)};
            });
        }).enter()
        .append("td")
		.text(function (d) {
			if (d.column === columns[0]) return d.text;
			else if (d.column === columns[1]) return d.value;
		});
}

function getKeys(jsonArray) {
	var L = jsonArray.length;
	var keys = [];
	for (var i = 0; i < L; i++) {
	    var obj = jsonArray[i];
	    for (var j in obj) {
	        keys.push(caseFormat(j));
	    }
	}
	return keys;
}

function caseFormat(input) {
	if (typeof String.prototype.startsWith != 'function') {
		  String.prototype.startsWith = function (str){
		    return this.slice(0, str.length) == str;
		  };
	}
	if(input.startsWith("m_")) {
		return fixStr(input.substring(2));
	} else {
		return fixStr(input);
	}
}

function fixStr(str) {
    var out = str.replace(/^[a-z]|[^\s][A-Z]/g, function(str, offset) {
        if (offset == 0) {
            return(str.toUpperCase());
        } else {
            return(str.substr(0,1) + " " + str.substr(1).toUpperCase());
        }
    });
    return(out);
}
