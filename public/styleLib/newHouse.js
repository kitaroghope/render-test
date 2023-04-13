// Add facility
var facilityCount = 0;
$("#add-facility").click(function() {
    facilityCount++;
    var facilityHtml = `
        <div class="mb-3" id="facility-${facilityCount}">
                                    <label>Facility ${facilityCount}</label>
            <div class="row">
                <div class="col-md-4">
                    <input type="text" class="form-control fac-name-${facilityCount}" name="facilities[fac ${facilityCount}][name]" placeholder="Facility ${facilityCount} Name" required>
                </div>
                <div class="col-md-4">
                    <textarea class="form-control fac-des-${facilityCount}" id="propSDes" name="facilities[fac ${facilityCount}][description]" placeholder="Facility ${facilityCount} Description"  rows="2" required></textarea>
                </div>
                <div class="col-md-4">
                    <input type="file" class="form-control fac-img-${facilityCount}" id="fac-img-${facilityCount}" name="image" onchange="upLoad(this)" placeholder="Facility ${facilityCount} Image" required>
                    <div class="form-control" style="height: 200px; width: 200px; display: flex; justify-content: center; align-items: center;">
                        <img class="fac-img-${facilityCount}" style="max-width: 100%; max-height: 100%;" src="">
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-danger mt-3" onclick="removeFacility(${facilityCount})">Remove Facility</button>
        </div>
    `;
    $("#facilities-container").append(facilityHtml);
});

// Remove facility
window.removeFacility = function(facilityNumber) {
    $("#facility-" + facilityNumber).remove();
}

$('#property-form').on('submit', (e) => {
    e.preventDefault();
    const result = {
      "location": $('#tbName').val(),
      "name": $('#propName').val(),
      "image": $('#propPic').val().split('\\').pop(),
      "simple-description": $('#propSDes').val(),
      "description": $('#propDes').val(),
      "tbName":$('#tbName').val()
    };

    let fac = [];
    if (facilityCount > 0) {
      for (let i = 0; i < facilityCount; i++) {
        if ($(`input.fac-name-${i+1}`).val()) {
          const m = {
            "name": $(`input.fac-name-${i+1}`).val(),
            "description": $(`textarea.fac-des-${i+1}`).val(),
            "image": $(`input.fac-img-${i+1}`).val().split('\\').pop()
          };
          fac.push(m);
        }
      }
    }
    result["facilities"] = fac;
    console.log(result);
    
    var sys_det = {
      "tbName" : $('#tbName').val(),
      "dbName" : "houses",
      "obj" : "properties",
      "key" : $('#tbName').val(),
      "keys": "arr"
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify(result));
    formData.append('data1', JSON.stringify(sys_det));
    
    customAlert2("wait while data is being uploaded")
    fetch('/addData/houses', {
        method: 'POST',
        body: formData
      }).then(response => {
          return response.json();
      }).then(async (data) => {
        if(data.url){
          var con = await customConfirm2("Page is going to be redirected")
            if(con){
                window.location.href = data.url;
            }
        }
        else{
          customAlert(data.err);
        }
      }).catch(error => {
        console.error(error);
      });
  });
  
  
  
function addLocation(x){
    var location1 = prompt("Type name of location and press ok","");
    console.log(location1)
    if(!(location1 == "" || location1 == null)){
        var newLacation = `<option value="${location1}">${location1}</option>`
        customAlert2("Wait while location is being added");
        var sys_det = {
          "tbName" : location1,
          "dbName" : "houses",
          "arr" : "locations",
        }
        var res = {"d":location1}
        const formData = new FormData();
        formData.append('data', JSON.stringify(res));
        formData.append('data1', JSON.stringify(sys_det));

        fetch(`/addData1/${location1}`, {
          method: 'POST',
          body: formData
        }).then(response => {
          if (response.ok) {
            $('#tbName').append(newLacation);
            return response.json();
          } else {
            return response.json();
          }
        }).then(data => {
          if (data) {
            customAlert(data.status);
          }
        }).catch(error => {
          console.error(error.message);
          customAlert(`Error: ${error.message}`);
        });
    }
    else{
        customAlert("nothing was added");
    }
}