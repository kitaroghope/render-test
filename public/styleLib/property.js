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
                    <input type="file" class="form-control fac-img-${facilityCount}" id="image-${facilityCount}" name="image" placeholder="Facility ${facilityCount} Image" onchange="upLoad(this)  required>
                    <nav style="height:100px; width: 100px">
                      <img "image-${facilityCount}" src="#" alt="Image Preview" style="display:none; max-width:100%;">
                    </nav>
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
        "description": $('#propDes').val()
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

// function that uploads images
function upLoad(x){
    const file = x.files[0];
    const formData = new FormData();
    formData.append('image', file);

    customAlert('Wait Image is being uploaded')
    
    var imgPrev = $(`.${$(this).attr('id')}`)
    var reader = new FileReader()

    reader.addEventListener('load',()=>{
        imgPrev.src = reader.result
    });
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