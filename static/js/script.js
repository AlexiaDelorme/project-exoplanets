$(document).ready(function() {

    // Helper function to reset checkbox button to "checked"
    function resetButtonChecked(element) {
        if (!$(element).is(':checked')) {
            $(element).click();
        }
    }

    // Clear all filters on dashboard and modal form to start over
    $('.reset-filters').click(function() {

        dc.filterAll();
        dc.renderAll();

        // Reset modal form to default settings $("input:checkbox")
        resetButtonChecked("#switchTable");
        resetButtonChecked("#switchDataType");
        resetButtonChecked("#switchCorr1");
        resetButtonChecked("#switchCorr2");
        resetButtonChecked("#switchCorr3");

    });

    // Automatically redirect user to "discovery" section when clicking modal button
    $('#button-modal').click(function() {
        $('#myModal').modal('hide');
        $(document).scrollTop($('#discovery').offset().top);
    });

    // Display/hide "Data Table" section
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

    // Display cumulative or non-cumulative data type for years of discovery bar chart
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

    // Hide/show planet mass vs. planet radius correlation graph
    $("#switchCorr1").change(function() {
        if (this.checked != true) {
            $("#planet-corr-section").hide();
        }
        else {
            $("#planet-corr-section").show();
        }
    });

    // Hide/show planet mass vs. stellar mass correlation graph
    $("#switchCorr2").change(function() {
        if (this.checked != true) {
            $("#mass-corr-section").hide();
        }
        else {
            $("#mass-corr-section").show();
        }
    });

    // Hide/show planet radius vs. stellar radius correlation graph
    $("#switchCorr3").change(function() {
        if (this.checked != true) {
            $("#radius-corr-section").hide();
        }
        else {
            $("#radius-corr-section").show();
        }
    });

    //Hide Correlation menu item in navbar when the three checkboxes for correlation graphs have been unchecked
    $(".correlation-checkbox").change(function() {
        if (!$(".correlation-checkbox").is(':checked')) {
            $("#nav-item-correlation").hide();
            $("#correlation").hide();
        }
        else {
            $("#nav-item-correlation").show();
            $("#correlation").show();
        }
    });

});
