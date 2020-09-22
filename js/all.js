var data;
//ajax高市資料庫
window.onload = function () {
    function getcity() {
        let vm = this;
        const xhr = new XMLHttpRequest();
        let url = "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
        xhr.open('get', url, true);
        xhr.send();
        // console.log(xhr);
        xhr.onload = function () {
            if (xhr.readyState == 4) {
                // console.log(xhr.responseText);
                const getdata = JSON.parse(xhr.responseText);
                // console.log(getdata);
                vm.data = getdata;

                AdministrativeDistrict();
                filterAttractions();
            }
        }
    }
    getcity();
}



function gethtml(id) {
    return document.querySelector(id);
}
const Districtname = gethtml('#Districtname');
const cardAttractions = gethtml('#cardAttractions');
const selectElement = gethtml('#add-city');
const pagination = gethtml('#pagination');
const Popular = gethtml('#Popular');
const topwindo = gethtml('#top');


var District;
//解析行政區
function AdministrativeDistrict() {
    const vm = this;
    const getCounty = vm.data.result.records.map(Gcity);
    function Gcity(item) {
        // console.log(item.Zone);
        return item.Zone;
    }
    // console.log(getCounty);
    vm.District = getCounty.filter(function (element, index, getCounty) {
        // console.log(element);
        // console.log(index);
        // console.log(getCounty);
        // console.log(element + "index:" + index);
        // console.log(getCounty.indexOf(element) + "index:" + index);
        // console.log(getCounty.indexOf(element) === index);
        return getCounty.indexOf(element) === index;
    });
    ADshow();
}

//選單觸發行政區
var nowdistrict = 'all';
selectElement.addEventListener('change', function (e) {
    // console.log(e);
    e.stopPropagation;
    const val = e.target.value;
    // const val2 = selectElement.value;
    // console.log("取得行政區: " + val);
    // console.log(nowdistrict);
    // console.log(val2);
    nowdistrict = selectElement.value;
    // console.log("放入行政區: " + nowdistrict);
    filterAttractions();
});

//按鈕觸發行政區
Popular.addEventListener('click', function (e) {
    console.log(e);
    if (e.target.localName == 'button') {
        e.stopPropagation;
        console.log('是按鈕');
        nowdistrict = e.target.value;
    };
    console.log("放入行政區: " + nowdistrict);
    filterAttractions();
});



var newcity = [];
var pages = 0;//全部頁數
var currentPage = 0;//當前頁數


// 景點分頁
function filterAttractions() {
    const newData = [];
    const vm = this;
    let items = [];
    //行政區標題
    if (vm.nowdistrict == 'all') {
        vm.Districtname.textContent = "";
    } else {
        vm.Districtname.textContent = nowdistrict;
    }
    // console.log("帶入行政區: " + vm.nowdistrict);


    // 過濾行政區
    if (vm.nowdistrict !== 'all') {
        // console.log("行政區: " + vm.nowdistrict);
        items = vm.data.result.records.filter(function (item, index, array) {
            // console.log(item);
            return item.Zone === vm.nowdistrict;
        });
        // console.log(items);
        // console.log(vm.data);
    } else {
        // console.log("行政區: " + vm.nowdistrict);
        // console.log(vm.data.result.records);
        items = vm.data.result.records;
        // console.log(items);
    }
    // 建立分頁
    items.forEach(function (item, i) {
        if (i % 10 === 0) {
            newData.push([]);
        };
        const page = parseInt(i / 10);
        newData[page].push(item);
    });

    // 分頁數量
    vm.pages = newData.length;
    vm.currentPage = 0;
    // console.log(newData);
    // console.log(newData.length);
    vm.newcity = newData;
    AttractionsShow();
    PagesShow();
}


//渲染行政區
function ADshow() {
    const vm = this;
    var ADstr = '<option value="all" selected disabled="disabled">- -請選擇行政區- -</option><option value="all">全部</option>';
    vm.District.forEach(function (item, i) {
        // console.log(item);
        let sstr = "<option value='" + item + "'>" + item + "</option>";
        ADstr += sstr;
    });
    selectElement.innerHTML = ADstr;
}

//渲染景點
function AttractionsShow() {
    const vm = this;
    var Attrstr = '';
    vm.newcity[currentPage].forEach(function (item, i) {
        // console.log(item);
        let sstr = '<div class="card-out"><div class="card"><div class="card-img" style="background-image: url(' + item.Picture1 + ');"><h3 class="name">' + item.Name + '</h3><p class="Zone">' + item.Zone + '</p></div>';
        sstr += '<div class="card-news"><p class=""><span class="icon-clock te-po1"></span><span class="time">' + item.Opentime.substr(0, 25) + '</span></p><p class=""><span class="icon-Address te-orange1"></span><a class="address">' + item.Add.substr(0, 22) + '</a></p>';
        sstr += '<p class=""><span class=""><span class="icon-phone te-blue1"></span><a class="phone">' + item.Tel + '</a></span>';
        if (item.Ticketinfo) {
            sstr += '<span class="Ticketinfo"><span class="icon-ticket  te-yello1"></span><span class="">' + item.Ticketinfo.substr(0, 8) + '</span></span>';
        };
        sstr += '</p></div></div></div>';
        Attrstr += sstr;
    });
    // console.log(Attrstr);
    cardAttractions.innerHTML = Attrstr;
}

//渲染頁數
function PagesShow() {
    const vm = this;
    var pagesstr = '';
    if (vm.pages > 1) {
        console.log(vm.currentPage);
        console.log(vm.pages);
        if ((parseInt(vm.currentPage) + 1) > 1) {
            let bestr = '<li class="page-item"><a class="page-link" href="#0" data-value="' + (parseInt(vm.currentPage) - 1) + '"> &#60; prev </a></li > ';
            pagesstr += bestr;
        };
        for (let i = 0; i < vm.pages; i++) {
            // console.log(i);
            if (i == vm.currentPage) {
                let sstr = '<li class="page-item active"><a class="page-link" href="#0" data-value="' + i + '">' + (i + 1) + '</a></li>';
                pagesstr += sstr;
            } else {
                let sstr = '<li class="page-item"><a class="page-link" href="#0" data-value="' + i + '">' + (i + 1) + '</a></li>';
                pagesstr += sstr;
            }

        };
        if ((parseInt(vm.currentPage) + 1) != vm.pages) {
            let afstr = '<li class="page-item"><a class="page-link" href="#0" data-value="' + (parseInt(vm.currentPage) + 1) + '">next &#62;</a></li>';
            pagesstr += afstr;
        };
    } else {
        let sstr = '<li class="page-item"><a class="page-link" href="#0" data-value="0 ">1</a></li>';
        pagesstr += sstr;
    }
    // console.log(pagesstr);
    pagination.innerHTML = pagesstr;
}

//按鈕觸發頁數
pagination.addEventListener('click', function (e) {
    // console.log(e);
    if (e.target.localName == 'a') {
        e.stopPropagation;
        // console.log('是按鈕');
        currentPage = e.target.dataset.value;
        // console.log(currentPage);
    };
    AttractionsShow();
    PagesShow();
});



topwindo.addEventListener('click', function (e) {
    // console.log(e);
    e.stopPropagation;

});

















