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
                    <input type="file" class="form-control fac-img-${facilityCount}" name="image" placeholder="Facility ${facilityCount} Image" required>

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
$('#property-form').on('submit',(e)=>{
    e.preventDefault();
    var result = {
        "name": $('#propName').val(),
        "image": $('#propPic').val().split('\\').pop(),
        "simple-description": $('#propSDes').val(),
        "description": $('#propDes').val(),
        "tbName":$('#tbName').val()
    }
    var fac = []
    if(facilityCount > 0){
        for(i=0; i<facilityCount; i++){
            if($(`input.fac-name-${i+1}`).val()){
                let m = {
                "name":$(`input.fac-name-${i+1}`).val(),
                "description":$(`input.fac-des-${i+1}`).val(),
                "image":$(`input.fac-img-${i+1}`).val()
                }
                fac.push(m)
            console.log(i);
            }

        }
    }
    else{
        fac = []
    }
    
    result["facilities"] = fac;
    console.log(result)
});
function addLocation(x){
    var location1 = prompt("Type name of location and press ok");
    if(location1){
        customAlert("hey")
        var newLacation = `<option value="${location1}">${location1}</option>`
        $('#tbName').append(newLacation);
    }
}