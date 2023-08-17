var year = new Date().getFullYear();
var books = {}

$(document).ready(function() {
    // When the hamburger menu is clicked, toggle the visibility of the navigation links
    $('.navbar-toggler').click(function() {
      $('.navbar-collapse').toggleClass('show');
    });
  
    // When a navigation link is clicked, hide the navigation links
    $('.nav-link').click(function() {
      $('.navbar-collapse').removeClass('show');
    });
  });

// function that uploads images
function upLoad(x){
    const file = x.files[0];
    $('.display').css('display','')
    var text = $('#propName');
    // checking if house name is added
    if(text.val() ==""){
        customAlert("please first add house name");
        $(x).val('');
        return
    }
    const imageUrl = URL.createObjectURL(file)
    $(`.${$(x).attr('id')}`).attr('src',imageUrl)
    $('#propName').prop('disabled', true);
    // creatung form data
    const formData = new FormData();
    formData.append('image', file);
    customAlert2('Wait Image is being uploaded')

    fetch(`/upload/${text.val()}`, {
      method: 'POST',
      body: formData
    }).then(response => {
        customAlert(`image upload status is ${response.statusText}`)
      console.log(response);
    }).catch(error => {
        customAlert(`Err: ${error.message}`)
    });
}
// function addWorker(){
//     var key = prompt("Enter Password");
//     if(key == ""){
//         return;
//     }
//     fetch(`/about/${key}`,{
//         method:'POST'
//     }).then(response => {
//         return response.json();
//     }).then(data => {
//         if(data.url){
//             window.location.href = data.url;
//         }
//         else{
//             customAlert(data.err);
//         }
//     }).catch(err => {
//         customAlert("err: "+err.meassage);
//     })
// }
function addItem(url){
    var key = prompt("Enter Password");
    if(key == ""){
        return;
    }
    customAlert2("Wait while being approved")
    var auth = {
        "pass": key,
        "url": url
    }
      const formData = new FormData();
      formData.append('data', JSON.stringify(auth));
    fetch('/admin', {
        method: 'POST',
        body: formData
      }).then(response => {
          return response.json();
      }).then(async (data) => {
        if(data.url){
            if(data.url == url){
                customAlert('You have been granted permission.')
            }
            else{
                var con = await customConfirm2(`Page is going to be redirected to one time link: ${url}`)
                if(con){
                    window.location.href = data.url;
                }
            }
        }
        else{
            customAlert("You don't have user rights")
        }
      }).catch(error => {
        customAlert("err: "+error.meassage);
      });
}
// custom alert 
function customAlert(Message){
    if($('.Warn').html()){
        $('.Warn').remove()
    }
    var dialog = `
    <div class="Warn">
        <div>
            <nav class="WarnHead">Alert</nav>
            <nav class="WarnBody">${Message}</nav>
            <nav class="WarnButtons"><button class="btn btn-success">Ok</button></nav>
        </div>
    </div>`
    $('body').append(dialog)
}

$('body').on('click','.Warn button',(e)=>{
    $(e.target).parent().parent().parent().remove();
    console.log('nyizze');
})
// custom alert 2
function customAlert2(Message){
    var dialog = `
    <div class="Warn">
        <div>
            <nav class="WarnHead">Wait</nav>
            <nav class="WarnBody">${Message}</nav>
            <nav class="text-center">
                <nav class="spinner-border spinner-border-sm text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                </nav>
                <nav>Loading...</nav>
            </nav>
        </div>
    </div>`
    $('.warn').html(dialog)
    $('.warn').on('click','.Warn button',(e)=>{
        $(e.target).parent().parent().parent().remove();
        console.log('nyizze')
    })
}
function customConfirm(Message, head = "Confirm"){
    if($('.Warn').html()){
        $('.Warn').remove()
    }
    var dialog = `
    <div class="Warn">
        <div>
            <nav class="WarnHead">${head}</nav>
            <nav class="WarnBody">${Message}</nav>
            <nav class="WarnButtons"><button class="btn btn-success">Ok</button><button class="btn btn-danger">Cancel</button></nav>
        </div>
    </div>`;
    $('body').append(dialog);

    return new Promise((resolve, reject) => {
        $('.btn-success').on('click', function() {
            $('.Warn').remove();
            resolve(true);
        });

        $('.btn-danger').on('click', function() {
            $('.Warn').remove();
            resolve(false);
        });
    });
}
function customConfirm2(Message, head = "Confirm"){
    if($('.Warn').html()){
        $('.Warn').remove()
    }
    var dialog = `
    <div class="Warn">
        <div>
            <nav class="WarnHead">${head}</nav>
            <nav class="WarnBody">${Message}</nav>
            <nav class="WarnButtons"><button class="btn btn-success mx-1">Ok</button></nav>
        </div>
    </div>`;
            // <button class="btn btn-danger">Cancel</button>
    $('body').append(dialog);

    return new Promise((resolve, reject) => {
        $('.btn-success').on('click', function() {
            $('.Warn').remove();
            resolve(true);
        });
        // $('.btn-danger').on('click', function() {
        //     $('.Warn').remove();
        //     resolve(false);
        // });
    });
}
// calender draw
function createCalender(year){
    if(year < new Date().getFullYear()){
        alert("You can't be checking history");
        return
    }
    $('#tableDate').html("")
    var headYear = document.getElementById('headYear');
    var date_show = document.getElementById('tableDate');
    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
    date_show.append(thead)
    thead.append(tr)
    // arrays with day and month names
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    const daysShort = ["S","M","T","W","Th","F","S"]
    // creating head callender
    for(j=0; j<6; j++){
        for(i = 0; i < days.length; i++){
            if(i==3 && j == 5){
                break
            }
            var th = document.createElement('th')
            th.innerText = daysShort[i];
            tr.append(th);
        }
    }
    // now writing days for every month
    date_show.append(tbody)
    for(i=0; i<12; i++){
        var tr = document.createElement('tr');
        tbody.append(tr);
        var start = true;
        var count = 0;
        for(j=0; j<35; j++){
            console.log(i)
            if(!doesDayExist(year,i+1,j+1)){
                for(m=0;m<(38-count);m++){
                    var td = document.createElement('td')
                    td.classList = "bg-light"
                    td.innerText = "";
                    tr.append(td);
                }
                count=0;
                break;
            }
            else if(j < ( start && new Date(year, i, 1).getDay())){
                for(m=0;m<new Date(year, i, 1).getDay();m++){
                    var td = document.createElement('td')
                    td.classList = "bg-light"
                    td.innerText = "";
                    tr.append(td);
                    count++
                }
                var td = document.createElement('td')
                td.innerText = 1;
                tr.append(td);
                count += 1;
                start = false
            }
            else{
                var td = document.createElement('td')
                td.innerText = j+1;
                tr.append(td);
                count++
            }
        }
    }
    // set year to display
    headYear.innerText = year
    $('.prev button').text(year - 1)
    $('.next button').text(year + 1)
    // get index of first day in month
    function doesDayExist(year, month, day) {
        const date = new Date(year, month - 1, day);
        return date.getMonth() + 1 === month && date.getDate() === day;
    }
}
function dateToArray(dateString){
    const [year, month, day] = dateString.split('-');
    return [eval(day), eval(month), eval(year)];
}

function arrayToDate(dateArray){
    const [day, month, year] = dateArray;
    return `${year}-${month}-${day}`;
}

// createCalender(year)
async function mark(year){
    if(booked.hasOwnProperty(year)){
        booked[year].forEach(dates => {
          const [startDateStr, endDateStr] = dates;
          const startDate = dateToArray(startDateStr);
          const endDate = dateToArray(endDateStr);
          console.log(endDate)
          markBooked(startDate, endDate);
        });
    } 
}
// facility or house update section
  