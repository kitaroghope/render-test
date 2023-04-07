var year = new Date().getFullYear();
const toggleButton = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    toggleButton.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
});

// function that uploads images
function upLoad(x){
    const file = x.files[0];
    const formData = new FormData();
    formData.append('image', file);

    customAlert('Wait Image is being uploaded')

    fetch('/upload', {
      method: 'POST',
      body: formData
    }).then(response => {
        customAlert(`image upload status is ${response.statusText}`)
      console.log(response);
    }).catch(error => {
      console.error(error);
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
            <nav class="WarnHead">Warning</nav>
            <nav class="WarnBody">${Message}</nav>
            <nav class="WarnButtons"><button>Ok</button></nav>
        </div>
    </div>`
    $('body').append(dialog)
    $('body').on('click','.Warn button',(e)=>{
        $(e.target).parent().parent().parent().remove();
        console.log('nyizze')
    })
}
// custom alert 2
function customAlert2(Message){
    var dialog = `
    <div class="Warn">
        <div>
            <nav class="WarnHead">Warning</nav>
            <nav class="WarnBody">${Message}</nav>
            <div class="text-center">
            <div class="spinner-border spinner-border-sm text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div>Loading...</div>
            </div>
        </div>
    </div>`
    $('.warn').html(dialog)
    $('.warn').on('click','.Warn button',(e)=>{
        $(e.target).parent().parent().parent().remove();
        console.log('nyizze')
    })
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
// createCalender(year)

// facility or house update section
