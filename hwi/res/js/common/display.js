function displayResult() {
    $("#no-result").html("Fetching your results...");
    $("#no-result").show();
    window.resultNum = window.result.length;
                        
    if (window.resultNum > 0) {
        calcPage();
        fillPage(0);
    } else {
        $("#no-result").html("Empty Set");
        $("#no-result").show();
    }
}

window.perPage = 30;
window.currPage = 0;
function calcPage() {
    window.totalPage = window.resultNum / window.perPage;
    $("#page").show(); 
}

function disClean() {
    $("#page").hide();
    pageClean();
    $("#no-result").html("");
    $("#no-result").hide();
    window.currPage = 0;
}

function prevPage() {
    if (window.currPage == 0) {
            return;
        }

    window.currPage--;
    fillPage();
}

function nextPage() {
    if (window.currPage >= window.totalPage - 1) {
            return;
        }

    window.currPage++;
    fillPage();
}

function fillHead() {
    schemaBody = "";
    for (i = 0; i < window.schema.length; i++) {
        schemaBody += "<td class='text-info'>" + schema[i] + "</td>";
    }
    thead = "<thead><tr>" + schemaBody + "</tr></thead>";
    $("#display").append(thead);
}

function fillPage() {
    page = window.currPage;
    $("#no-result").hide();
    pageClean();
    fillHead();
    for (i = 0; i < window.perPage; i++) {
            rowNum = page * perPage + i;
            if (rowNum >= window.resultNum) {
                        break;
                    } 
            row = window.result[rowNum];
            value = row.split("\t");
            tr = "";
            for (j = 0; j < value.length; j++) {
                        tr = tr + "<td>" + value[j] + "</td>";
                    }   
            $("#display").append("<tr>" + tr + "</tr>");
        }
}

function pageClean() {
    $("#display").empty();
}

function changePerPage(val) {
    window.perPage = val;
    disClean();
    calcPage();
    fillPage(0)
}
