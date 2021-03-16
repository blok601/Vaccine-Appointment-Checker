var cache = {}
var vdata = {}

function fetch() {
    $.get('http://localhost:8081/data', {}, function (data) {
        // console.log("Printing data from get:")
        // console.log("Type: "+ (typeof data))
        for (var k in data) {
            cache[k] = data[k]
        }
        // console.log(cache)
    });

    $.get('http://localhost:8081/vdata', {}, function (data) {
        console.log(data)
        vdata = data
        for (var k in data) {
            console.log("Loop: " + k)
        }

        var extra = data[0];
        for (var b in extra) {
            console.log("Loop2: " + b);
            console.log("Loop Value: " + data[0][b])
            vdata[b] = data[0][b]
        }


        console.log(vdata)
        document.getElementById('DosesD').innerHTML = numberWithCommas(vdata["Doses_Distributed"]);
        document.getElementById('DosesA').innerHTML = numberWithCommas(vdata["Doses_Administered"]);
        document.getElementById('FDR').innerHTML = numberWithCommas(vdata["Administered_Dose1_Recip"]);
        document.getElementById('SDR').innerHTML = numberWithCommas(vdata["Administered_Dose2_Recip"]);
        document.getElementById('LUD').innerHTML = vdata["Last_Updated"]
    });


}

function loadTable() {
    var zip = document.getElementById('searchForm').value;
    if (zip === undefined || zip === "") {
        console.log("Broke")
        clearTable()
        return;
    }
    clearTable();
    console.log(zip)
    var ids = findByZip(zip);
    console.log(ids)

    var table = document.getElementById('myTable');


    for (var i = 0; i < ids.length; i++) {
        var row = table.insertRow(i + 1);
        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        var nameCell = row.insertCell(0);
        var phoneCell = row.insertCell(1);
        var websiteCell = row.insertCell(2);
        var zipCell = row.insertCell(3);

        // Add some text to the new cells:
        var temp = ids[i]
        console.log(temp)
        websiteCell.innerHTML = cache[temp][3];
        zipCell.innerHTML = cache[temp][4]
        var ahref = "<a href=\"http://"
        var link = cache[temp][3]
        var g = "\" target=\"_blank\""
        var end = ">" + link
        var close = "</a>"

        var webStart = "<div><span><a href=\"http://" + link + "\" target=\"_blank\"><span class=\"badge badge-info badge-pill\" style=\"font-size: small\">Website <i class=\"fa fa-external-link\"></i></span></a></span></div>"
        websiteCell.innerHTML = webStart;

        var tdTag = "<td class=\"align-middle\"><span class=\"badge badge-success badge-pill\">";
        var num = cache[temp][2]
        var closeSpan = "</span>"
        phoneCell.innerHTML = tdTag + num + closeSpan;

        var nameDiv = "<div><strong>" + cache[temp][0] + "</strong>"
        var smallDiv = "<div class=\"small mb-2\">" + cache[temp][1] + "</div></div>"
        nameCell.innerHTML = nameDiv + smallDiv
    }
    document.getElementById('resultAmount').innerHTML = ids.length + 3 + "";

    var phoneTag = "<td class=\"align-middle\"><span class=\"badge badge-success badge-pill\">";
    var closePhoneTag = "</span>"
    var webStart = "<div><span><a href=\"http://"
    var webEnd = "\" target=\"_blank\"><span class=\"badge badge-info badge-pill\" style=\"font-size: small\">Website <i class=\"fa fa-external-link\"></i></span></a></span></div>"


    var CVSRow = table.insertRow(ids.length + 1);
    var CVSName = CVSRow.insertCell(0);
    var CVSPhone = CVSRow.insertCell(1);
    var CVSWebsite = CVSRow.insertCell(2);
    CVSName.innerHTML = "<strong>CVS Pharmacy<strong>";
    CVSPhone.innerHTML = phoneTag + "1-800-552-8159" + closePhoneTag
    CVSWebsite.innerHTML = webStart + "www.cvs.com/immunizations/covid-19-vaccine" + webEnd

    var ShopRiteRow = table.insertRow(ids.length + 2);
    var ShopRiteName = ShopRiteRow.insertCell(0);
    var ShopRitePhone = ShopRiteRow.insertCell(1);
    var ShopRiteWebsite = ShopRiteRow.insertCell(2);
    ShopRiteName.innerHTML = "<strong>ShopRite<strong>";
    ShopRitePhone.innerHTML = phoneTag + "1-800-746-7748" + closePhoneTag
    ShopRiteWebsite.innerHTML = webStart + "vaccines.shoprite.com" + webEnd

    var RiteAidRow = table.insertRow(ids.length + 3);
    var RiteAidName = RiteAidRow.insertCell(0);
    var RiteAidPhone = RiteAidRow.insertCell(1);
    var RiteAidWebsite = RiteAidRow.insertCell(2);
    RiteAidName.innerHTML = "<strong>RiteAid<strong>";
    RiteAidPhone.innerHTML = phoneTag + "1-800-748-3242" + closePhoneTag
    RiteAidWebsite.innerHTML = webStart + "www.riteaid.com" + webEnd



}

function findByZip(zip) {
    var ids = [];
    for (let k in cache) {
        if (cache[k].includes(zip)) {
            ids.push(k);
        }
    }

    return ids;
}

function clearTable() {
    var table = document.getElementById('myTable');
    try {
        for (var i = table.rows.length - 1; i > 0; i--) {
            table.deleteRow(i);
        }
    } catch (error) {
        alert(error)
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}