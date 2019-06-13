//Helper function to reset button to "checked"
function resetButtonChecked(element) {
    if ($(element).checked != true) {
        $(element).click();
    }
}

//Helper function to reset entire modal form
function resetModalForm() {
    resetButtonChecked("#switchTable");
    resetButtonChecked("#switchDataType");
    resetButtonChecked("#switchCorr1");
    resetButtonChecked("#switchCorr2");
    resetButtonChecked("#switchCorr3");
}

//Clear all filters to chart to start over
$('#reset-filters').click(function() {

    dc.filterAll();
    dc.renderAll();

    //reset modal form to default settings
    resetButtonChecked("#switchTable");
});

// Automatically redirect user to "discovery" section when clicking modal button
$('#button-modal').click(function() {
    $('#myModal').modal('hide');
    $(document).scrollTop($('#discovery').offset().top);
});

$("#switchTable").change(function() {
    if (this.checked != true) {
        $("#recap-data").hide();
        $("#nav-item-table").hide();
        $("#checkboxLabelTable").text("Disable");
    }
    else {
        $("#recap-data").show();
        $("#nav-item-table").show();
        $("#checkboxLabelTable").text("Enable");
    }
});

$("#switchDataType").change(function() {
    if (this.checked != true) {
        $("#non-cumulative-chart").hide();
        $("#cumulative-chart").show();
        $("#checkboxLabelData").text("Cumulative");
    }
    else {
        $("#non-cumulative-chart").show();
        $("#cumulative-chart").hide();
        $("#checkboxLabelData").text("Non Cumulative");
    }
});

$("#switchCorr1").change(function() {
    if (this.checked != true) {
        $("#planet-corr-section").hide();
    }
    else {
        $("#planet-corr-section").show();
    }
});

$("#switchCorr2").change(function() {
    if (this.checked != true) {
        $("#mass-corr-section").hide();
    }
    else {
        $("#mass-corr-section").show();
    }
});

$("#switchCorr3").change(function() {
    if (this.checked != true) {
        $("#radius-corr-section").hide();
    }
    else {
        $("#radius-corr-section").show();
    }
});
