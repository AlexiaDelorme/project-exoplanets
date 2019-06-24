queue()
    .defer(d3.csv, "data/static-exo.csv")
    .await(makeGraphs);

function makeGraphs(error, data) {

    var ndx = crossfilter(data);

    /* Code provided by tutor team to fix decimal values 
    not recognised as numbers */
    for (let d of data) {
        d.pl_orbper = Number(d.pl_orbper);
        d.st_dist = Number(d.st_dist);
        d.st_age = Number(d.st_age);
        d.pl_masse = Number(d.pl_masse);
        d.pl_rade = Number(d.pl_rade);
        d.st_mass = Number(d.st_mass);
        d.st_rad = Number(d.st_rad);

    }

    // Sample stats
    display_total_planets_sample(ndx);
    display_average_stellar_age_sample(ndx);
    display_kepler_percent(ndx, "1", "#kepler-flagged");
    display_kepler_percent(ndx, "0", "#not-kepler-flagged");
    display_location_percent(ndx, "Space", "#location-space");
    display_location_percent(ndx, "Ground", "#location-ground");

    // Selectors
    show_kepler_selector(ndx);
    show_location_selector(ndx);
    show_facility_selector(ndx);
    show_discovery_selector(ndx);
    show_discovery_year_selector(ndx);

    // Discovery charts
    show_discovery_location(ndx);
    show_discovery_facility(ndx);
    show_discovery_method(ndx);
    show_year_of_discovery(ndx);
    show_cumulative_year_of_discovery(ndx);

    // Exoplanets features charts
    show_orbital_period(ndx);
    show_planetary_system(ndx);
    show_stellar_distance(ndx);
    show_stellar_age(ndx);

    // Correlation charts
    show_mass_radius_correlation(ndx);
    show_mass_correlation(ndx);
    show_radius_correlation(ndx);

    // Data table
    showTable(ndx);

    dc.renderAll();

}

/*----------------------------------------------------- Helper functions -----*/

// This function was taken in the code from a Code Institute student (Git: steview-d / Project: superhero-dashboard)
function remove_blanks(group, value_to_remove) {
    // Filter out specified values from passed group
    return {
        all: function() {
            return group.all().filter(function(d) {
                return d.key !== value_to_remove;
            });
        }
    };
}

// This function was taken in the code from another Code Institute student (Git: steview-d / Project: superhero-dashboard)
// I adapted it to my pie Chart to exclude the display of percent below 5%
function show_slice_percent(key, endAngle, startAngle) {
    // Return the % of each pie slice as a string to be displayed on the slice itself
    var percent = dc.utils.printSingleValue((endAngle - startAngle) / (2 * Math.PI) * 100);
    if (percent >= 5) {
        return key + ': ' + Math.round(percent) + '%';
    }
    else if (percent > 0) {
        return "";
    }
}

// Accumalate data to plot cumulative charts
function accumulate_group(group) {
    return {
        all: function() {
            var cumulate = 0;
            return group.all().map(function(d) {
                cumulate += d.value;
                return { key: d.key, value: cumulate };
            });
        }
    };
}

// Helper function to round data numbers for table
function convert_string_to_float(d) {
    var number = parseFloat(d);
    return number.toFixed(2);
}

/*-------------- Create selector fonctions to filter chart on user input -----*/

function show_kepler_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_kepflag'));
    var group = dim.group();

    dc.selectMenu("#kepler-selector")
        .title(function(d) {
            if (d.key == "0") {
                return 'Exclude Kepler scope';
            }
            else if (d.key == "1") {
                return 'Only Kepler scope';
            }
        })
        .dimension(dim)
        .group(group);

}

function show_location_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_locale'));
    var group = dim.group();

    dc.selectMenu("#location-selector")
        .title(function(d) {
            return d.key;
        })
        .order(function(a, b) {
            return a.value < b.value ? 1 : b.value < a.value ? -1 : 0;
        })
        .dimension(dim)
        .group(group);

}

function show_facility_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_facility'));
    var group = remove_blanks(dim.group(), "");

    dc.selectMenu("#facility-selector")
        .multiple(true)
        .title(function(d) {
            return d.key;
        })
        .promptText('Select all')
        .dimension(dim)
        .group(group);

}

function show_discovery_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_discmethod'));
    var group = dim.group();

    dc.selectMenu("#discovery-selector")
        .multiple(true)
        .title(function(d) {
            return d.key;
        })
        .promptText('Select all')
        .dimension(dim)
        .group(group);

}

function show_discovery_year_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_disc'));
    var group = dim.group();

    dc.selectMenu("#discovery-year-selector")
        .multiple(true)
        .title(function(d) {
            return d.key;
        })
        .promptText('Select all')
        .dimension(dim)
        .group(group);

}

/*------------------------------------------- Display stats on the sample ----*/

// Display total number of planets in the sample
function display_total_planets_sample(ndx) {

    var totalPlanets = ndx.groupAll().reduce(

        function(p) {
            p.total++;
            return p;
        },
        function(p) {
            p.total--;
            return p;
        },
        function() {
            return { total: 0 };
        }
    );

    dc.numberDisplay('#total-planets')
        .formatNumber(d3.format())
        .valueAccessor(function(d) {
            if (d.total == 0) {
                return 0;
            }
            else {
                return d.total;
            }
        })
        .group(totalPlanets);

}

// Display average stellar age of the sample
function display_average_stellar_age_sample(ndx) {

    var avStellarAge = ndx.groupAll().reduce(
        function(p, v) {
            /* If statement suggested by tutor team to prevents
             increasing count when there is a null value */
            if (v.st_age) {
                p.count++;
                p.total += v.st_age;
                p.average = p.total / p.count;
            }
            return p;
        },
        function(p, v) {
            if (v.st_age) {
                p.count--;
                p.total -= v.st_age;
                p.average = p.total / p.count;
            }
            return p;
        },
        function() {
            return { count: 0, total: 0, average: 0 };
        }
    );

    dc.numberDisplay('#average-stellar-age')
        .formatNumber(d3.format(".2s"))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return d.average;
            }
        })
        .group(avStellarAge);
}

// Display % of planets discovered during the Kepler mission
function display_kepler_percent(ndx, flag, element) {

    var keplerPercent = ndx.groupAll().reduce(

        function(p, v) {
            p.total++;
            if (v.pl_kepflag === flag) {
                p.count++;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if (v.pl_kepflag === flag) {
                p.count--;
            }
            return p;
        },
        function() {
            return { total: 0, count: 0 };
        }
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format('.1%'))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return (d.count / d.total);
            }
        })
        .group(keplerPercent);
}

// Display % of planets according to their detection location
function display_location_percent(ndx, flag, element) {

    var locationPercent = ndx.groupAll().reduce(

        function(p, v) {
            p.total++;
            if (v.pl_locale === flag) {
                p.count++;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if (v.pl_locale === flag) {
                p.count--;
            }
            return p;
        },
        function() {
            return { total: 0, count: 0 };
        }
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format('.1%'))
        .valueAccessor(function(d) {
            if (d.count == 0) {
                return 0;
            }
            else {
                return (d.count / d.total);
            }
        })
        .group(locationPercent);
}

/*--------------------- Charts related to the discovery of the exoplanets-----*/

// Create a variable colors to change default colors for charts
var pieChartColors = d3.scale.ordinal()
    .range(["lightgrey", "lightSteelBlue", "black"]);

function show_discovery_location(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_locale'));
    var group = remove_blanks(dim.group(), "");

    dc.pieChart('#discovery-location')
        .height(300)
        .radius(90)
        .innerRadius(40)
        .cx(260)
        .cy(120)
        .transitionDuration(1500)
        .legend(dc.legend().x(5).y(5).itemHeight(8).gap(5))
        .title(function(d) {
            return d.value + " planets discovered from " + d.key;
        })
        .useViewBoxResizing(true)
        .colors(pieChartColors)
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                return show_slice_percent(d.data.key, d.endAngle, d.startAngle);
            });
        })
        .dimension(dim)
        .group(group);

}

function show_discovery_facility(ndx) {

    var pieChartColors = d3.scale.ordinal()
        .range(["lightSteelBlue", "steelBlue", "lightblue", "orange", "seaGreen", "paleVioletRed", "navy", "oldLace", "lightgrey"]);

    var dim = ndx.dimension(dc.pluck('pl_facility'));
    var group = remove_blanks(dim.group(), "");

    dc.pieChart('#discovery-facility')
        .height(300)
        .radius(90)
        .innerRadius(40)
        .cx(260)
        .cy(120)
        .transitionDuration(1500)
        .legend(dc.legend().x(5).y(5).itemHeight(8).gap(5))
        .slicesCap(8)
        .title(function(d) {
            return d.value + " planets discovered by " + d.key;
        })
        .useViewBoxResizing(true)
        .colors(pieChartColors)
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                return show_slice_percent(d.data.key, d.endAngle, d.startAngle);
            });
        })
        .dimension(dim)
        .group(group);

}

// Create a variable to set detection method colors
var detectionColors = d3.scale.ordinal()
    .domain(["Transit", "Radial Velocity", "Microlensing", "Imaging", "Timing Variations", "Orbital Brightness Modulation", "Astrometry"])
    .range(["steelBlue", "grey", "lightblue", "orange", "seaGreen", "paleVioletRed", "navy"]);

function show_discovery_method(ndx) {

    var dim = ndx.dimension(function(d) {

        if (d.pl_discmethod == "Eclipse Timing Variations" || d.pl_discmethod == "Transit Timing Variations" || d.pl_discmethod == "Pulsar Timing" || d.pl_discmethod == "Pulsation Timing Variations") {
            return "Timing Variations";
        }
        else {
            return d.pl_discmethod;
        }
    });

    var group = dim.group();

    dc.rowChart('#discovery-method')
        .width(500)
        .height(300)
        .margins({ top: 10, right: 20, bottom: 40, left: 20 })
        .useViewBoxResizing(true)
        .title(function(d) {
            return d.value + " planets detected by " + d.key + " method";
        })
        .label(function(d) {
            return d.key + " | " + d.value + " planets";
        })
        .transitionDuration(1500)
        .colors(detectionColors)
        .dimension(dim)
        .group(group);

}

// Helper function to create custom reducer based on detection method
function detection_by_year(dimension, detection_method) {

    return dimension.group().reduce(
        function(p, v) {
            p.total++;
            if (v.pl_discmethod == detection_method) {
                p.match++;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if (v.pl_discmethod == detection_method) {
                p.match--;
            }
            return p;
        },
        function() {
            return { total: 0, match: 0 };
        }
    );
}

function show_year_of_discovery(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_disc'));

    // Create groups for each detection method
    var transitGroup = detection_by_year(dim, "Transit");
    var radialVelocityGroup = detection_by_year(dim, "Radial Velocity");
    var microlensingGroup = detection_by_year(dim, "Microlensing");
    var imagingGroup = detection_by_year(dim, "Imaging");
    var orbitalBrightnessGroup = detection_by_year(dim, "Orbital Brightness Modulation");
    var astronomyGroup = detection_by_year(dim, "Astrometry");

    // Create one single group for "Timing Variations" methods
    var timingVariationsGroup = dim.group().reduce(
        function(p, v) {
            p.total++;
            if (v.pl_discmethod == "Eclipse Timing Variations" || v.pl_discmethod == "Transit Timing Variations" || v.pl_discmethod == "Pulsar Timing" || v.pl_discmethod == "Pulsation Timing Variations") {
                p.match++;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if (v.pl_discmethod == "Eclipse Timing Variations" || v.pl_discmethod == "Transit Timing Variations" || v.pl_discmethod == "Pulsar Timing" || v.pl_discmethod == "Pulsation Timing Variations") {
                p.match--;
            }
            return p;
        },
        function() {
            return { total: 0, match: 0 };
        }
    );

    dc.barChart("#year-of-discovery")
        .width(800)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .renderLabel(true)
        .elasticY(true)
        .barPadding(0.2)
        .clipPadding(15)
        .transitionDuration(1500)
        .useViewBoxResizing(true)
        .title(function(d) {
            return d.value.match + " planets discovered in " + d.key;
        })
        .legend(dc.legend().x(80).y(20).itemHeight(8).gap(5))
        .dimension(dim)
        .group(transitGroup, "Transit")
        .stack(radialVelocityGroup, "Radial Velocity")
        .stack(microlensingGroup, "Microlensing")
        .stack(imagingGroup, "Imaging")
        .stack(timingVariationsGroup, "Timing Variations")
        .stack(orbitalBrightnessGroup, "Orbital Brightness Modulation")
        .stack(astronomyGroup, "Astrometry")
        .colors(detectionColors)
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return d.value.match;
            }
            else {
                return 0;
            }
        });

}

// Testing function to group cumulative data with a custom reducer

function accumulate_detection_by_year(dimension, detection_method) {

    return dimension.group().reduce(
        function(p, v) {
            p.total++;
            if (v.pl_discmethod == detection_method) {
                p.match++;
                p.sum += p.match;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if (v.pl_discmethod == detection_method) {
                p.match--;
                p.sum -= p.match;
            }
            return p;
        },
        function() {
            return { total: 0, match: 0, sum: 0 };
        }
    );
}


// Create a variable colors to change default colors for bar charts
var barChartColors = d3.scale.ordinal()
    .range(["lightgrey", "lightSteelBlue"]);

function show_cumulative_year_of_discovery(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_disc'));
    var group = accumulate_group(dim.group());

    dc.barChart("#cumulative-year-of-discovery")
        .width(800)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .renderLabel(true)
        .elasticY(true)
        .barPadding(0.2)
        .clipPadding(15)
        .transitionDuration(1500)
        .useViewBoxResizing(true)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(barChartColors)
        .dimension(dim)
        .group(group);

}

/*---------------------- Charts related to the features of the exoplanets-----*/

function show_orbital_period(ndx) {

    var orbitalPeriodDim = ndx.dimension(function(d) {

        var days = d.pl_orbper;

        if (days > 0 && days <= 1) {
            return '<= 1 day';
        }
        else if (days > 1 && days <= 5) {
            return ']1;5] days';
        }
        else if (days > 5 && days <= 15) {
            return ']5;15] days';
        }
        else if (days > 15 && days <= 30) {
            return ']15;30] days';
        }
        else if (days > 30 && days <= 365) {
            return ']30;365] days';
        }
        else if (days > 365) {
            return '> 1 year';
        }
        else {
            return 'N/A';
        }
    });

    var orbitalPeriodGroup = remove_blanks(orbitalPeriodDim.group(), "N/A");

    var scale = d3.scale.ordinal()
        .domain(['<= 1 day', ']1;5] days', ']5;15] days', ']15;30] days', ']30;365] days', '> 1 year'])
        .range([0, 1, 2, 3, 4, 5]);

    // Need to create a different color variable as we rearraged the order dimension for orbital period
    var orbitalChartColors = d3.scale.ordinal()
        .domain(['<= 1 day', ']1;5] days', ']5;15] days', ']15;30] days', ']30;365] days', '> 1 year'])
        .range(["lightgrey", "lightsteelBlue"]);

    dc.barChart("#orbital-period")
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .title(function(d) {
            return d.value + " planets with orbital period " + d.key;
        })
        .x(scale)
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .barPadding(0.2)
        .clipPadding(15)
        .renderLabel(true)
        .transitionDuration(1500)
        .useViewBoxResizing(true)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(orbitalChartColors)
        .dimension(orbitalPeriodDim)
        .group(orbitalPeriodGroup)
        .yAxis().ticks(4);
}

function show_planetary_system(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_pnum'));
    var group = dim.group();

    dc.lineChart("#planetary-system")
        .width(800)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .transitionDuration(1500)
        .useViewBoxResizing(true)
        .title(function(d) {
            return d.value + " planets with " + d.key + " known planet(s) in system";
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Number of planets in system")
        .elasticY(true)
        .clipPadding(15)
        .colors(d3.scale.ordinal().range(["black"]))
        .dimension(dim)
        .group(group);
}

function show_stellar_distance(ndx) {

    var stellarDistDim = ndx.dimension(function(d) {

        var stellarDistance = d.st_dist;

        if (stellarDistance > 0 && stellarDistance <= 250) {
            return '<= 250';
        }
        else if (stellarDistance > 250 && stellarDistance <= 500) {
            return ']250;500]';
        }
        else if (stellarDistance > 500 && stellarDistance <= 750) {
            return ']500;750]';
        }
        else if (stellarDistance > 750 && stellarDistance <= 1000) {
            return ']750;1000]';
        }
        else if (stellarDistance > 1000 && stellarDistance <= 1250) {
            return ']1000;1250]';
        }
        else if (stellarDistance > 1250 && stellarDistance <= 1500) {
            return ']1250;1500]';
        }
        else if (stellarDistance > 1500) {
            return '> 1500';
        }
        else {
            return 'N/A';
        }
    });

    var stellarDistGroup = remove_blanks(stellarDistDim.group(), "N/A");

    var scale = d3.scale.ordinal()
        .domain(['<= 250', ']250;500]', ']500;750]', ']750;1000]', ']1000;1250]', ']1250;1500]', '> 1500'])
        .range([0, 1, 2, 3, 4, 5, 6]);

    // Need to create a different color variable as we rearraged the order dimension for stellar distance
    var stellarDistChartColors = d3.scale.ordinal()
        .domain(['<= 250', ']250;500]', ']500;750]', ']750;1000]', ']1000;1250]', ']1250;1500]', '> 1500'])
        .range(["lightgrey", "lightsteelBlue"]);

    dc.barChart("#stellar-distance")
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .title(function(d) {
            return d.value + " planets with distance " + d.key;
        })
        .x(scale)
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .barPadding(0.2)
        .clipPadding(15)
        .renderLabel(true)
        .transitionDuration(1500)
        .useViewBoxResizing(true)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(stellarDistChartColors)
        .dimension(stellarDistDim)
        .group(stellarDistGroup)
        .yAxis().ticks(5);
}

function show_stellar_age(ndx) {

    var stellarAgeDim = ndx.dimension(function(d) {

        var stellarAge = d.st_age;

        if (stellarAge > 0 && stellarAge <= 2.5) {
            return '<= 2,5 Gyr';
        }
        else if (stellarAge > 2.5 && stellarAge <= 5) {
            return ']2,5;5] Gyr';
        }
        else if (stellarAge > 5 && stellarAge <= 10) {
            return ']5;10] Gyr';
        }
        else if (stellarAge > 10 && stellarAge <= 15) {
            return ']10;15] Gyr';
        }
        else {
            return 'N/A';
        }
    });

    var stellarAgeGroup = remove_blanks(stellarAgeDim.group(), "N/A");

    var scale = d3.scale.ordinal()
        .domain(['<= 2,5 Gyr', ']2,5;5] Gyr', ']5;10] Gyr', ']10;15] Gyr'])
        .range([0, 1, 2, 3]);

    // Need to create a different color variable as we rearraged the order dimension for stellar age
    var stellarAgeChartColors = d3.scale.ordinal()
        .domain(['<= 2,5 Gyr', ']2,5;5] Gyr', ']5;10] Gyr', ']10;15] Gyr'])
        .range(["lightgrey", "lightsteelBlue"]);

    dc.barChart("#stellar-age")
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .title(function(d) {
            return d.value + " planets with age " + d.key;
        })
        .x(scale)
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .barPadding(0.5)
        .clipPadding(15)
        .renderLabel(true)
        .transitionDuration(1500)
        .useViewBoxResizing(true)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(stellarAgeChartColors)
        .dimension(stellarAgeDim)
        .group(stellarAgeGroup)
        .yAxis().ticks(5);

}

/*--------------------------------------------------------- Correlations -----*/

function show_mass_radius_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_masse"));

    // To set domain we need to determine Max/Min
    var minPlanetMass = planetMassDim.bottom(1)[0].pl_masse;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_masse;

    var planetMassRadDim = ndx.dimension(function(d) {
        // Prevents from drawing correlations when we are missing at least one of the two data set
        if (d.pl_masse == "" || d.pl_rade == "") {
            return "";
        }
        else {
            return [d.pl_masse, d.pl_rade];
        }
    });

    // Helper function to create dimension sorted on the Kepler Flag
    function create_dimension_scatter_plot_kepler(flag) {
        return ndx.dimension(function(d) {
            if (d.pl_kepflag == flag) {
                if (d.pl_masse == "" || d.pl_rade == "") {
                    return "";
                }
                else {
                    return [d.pl_masse, d.pl_rade];
                }
            }
            else {
                return "";
            }
        });
    }

    // Create two distinct dimensions 
    var dim0 = create_dimension_scatter_plot_kepler("0");
    var dim1 = create_dimension_scatter_plot_kepler("1");

    // Group the two distinct dimensions
    var scatterGroup0 = remove_blanks(dim0.group(), "");
    var scatterGroup1 = remove_blanks(dim1.group(), "");

    var chart = dc.compositeChart("#mass-radius-correlation");

    chart
        .width(700)
        .height(300)
        .x(d3.scale.linear().domain([minPlanetMass, maxPlanetMass]))
        // I intentionally decided to exclude data for Radius > 25.EarthRadius (it only removes 3 planets in the sample) so that the scale is smoother
        .y(d3.scale.linear().domain([0, 25]))
        .xAxisLabel("Planet Mass (Earth Masses)")
        .yAxisLabel("Planet Radius (Earth Radii)")
        .title(function(d) {
            return " Planet Mass = " + d.key[0] + " - Planet Radius = " + d.key[1];
        })
        .brushOn(false)
        .clipPadding(1)
        .dimension(planetMassRadDim)
        .legend(dc.legend().x(550).y(15).itemHeight(8).gap(5))
        .transitionDuration(1500)
        .useViewBoxResizing(true)
        .compose([
            dc.scatterPlot(chart)
            .symbolSize(2)
            .group(scatterGroup1, "Kepler Scope")
            .colors("lightSteelBlue"),
            dc.scatterPlot(chart)
            .symbolSize(2)
            .group(scatterGroup0, "Outside Kepler Scope")
            .colors("black")
        ]);

}

function show_mass_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_masse"));

    var minPlanetMass = planetMassDim.bottom(1)[0].pl_masse;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_masse;

    var planetStellarMassDim = ndx.dimension(function(d) {
        // Prevents from drawing correlations when we are missing at least one of the two data set
        if (d.pl_masse == "" || d.st_mass == "") {
            return "";
        }
        else {
            return [d.pl_masse, d.st_mass];
        }
    });

    // Helper function to create dimension sorted on the Kepler Flag
    function create_dimension_scatter_plot_kepler(flag) {
        return ndx.dimension(function(d) {
            if (d.pl_kepflag == flag) {
                if (d.pl_masse == "" || d.st_mass == "") {
                    return "";
                }
                else {
                    return [d.pl_masse, d.st_mass];
                }
            }
            else {
                return "";
            }
        });
    }

    // Create two distinct dimensions 
    var dim0 = create_dimension_scatter_plot_kepler("0");
    var dim1 = create_dimension_scatter_plot_kepler("1");

    // Group the two distinct dimensions
    var scatterGroup0 = remove_blanks(dim0.group(), "");
    var scatterGroup1 = remove_blanks(dim1.group(), "");

    var chart = dc.compositeChart("#mass-correlation");

    chart
        .width(700)
        .height(300)
        .x(d3.scale.linear().domain([minPlanetMass, maxPlanetMass]))
        .y(d3.scale.linear().domain([0, 4.5]))
        .xAxisLabel("Planet Mass (Earth Masses)")
        .yAxisLabel("Stellar Mass (Solar Masses)")
        .title(function(d) {
            return " Planet Mass = " + d.key[0] + " - Stellar Mass = " + d.key[1];
        })
        .brushOn(false)
        .clipPadding(1)
        .dimension(planetStellarMassDim)
        .legend(dc.legend().x(550).y(15).itemHeight(8).gap(5))
        .transitionDuration(1500)
        .useViewBoxResizing(true)
        .compose([
            dc.scatterPlot(chart)
            .symbolSize(2)
            .group(scatterGroup1, "Kepler Scope")
            .colors("lightSteelBlue"),
            dc.scatterPlot(chart)
            .symbolSize(2)
            .group(scatterGroup0, "Outside Kepler Scope")
            .colors("black")
        ]);
}

function show_radius_correlation(ndx) {

    var planetRadiusDim = ndx.dimension(dc.pluck("pl_rade"));

    var minPlanetRadius = planetRadiusDim.bottom(1)[0].pl_rade;
    var maxPlanetRadius = planetRadiusDim.top(1)[0].pl_rade;

    var planetStellarRadiusDim = ndx.dimension(function(d) {
        // Prevents from drawing correlations when we are missing at least one of the two data set
        if (d.pl_rade == "" || d.st_rad == "") {
            return "";
        }
        else {
            return [d.pl_rade, d.st_rad];
        }
    });

    // Helper function to create dimension sorted on the Kepler Flag
    function create_dimension_scatter_plot_kepler(flag) {
        return ndx.dimension(function(d) {
            if (d.pl_kepflag == flag) {
                if (d.pl_rade == "" || d.st_rad == "") {
                    return "";
                }
                else {
                    return [d.pl_rade, d.st_rad];
                }
            }
            else {
                return "";
            }
        });
    }

    // Create two distinct dimensions 
    var dim0 = create_dimension_scatter_plot_kepler("0");
    var dim1 = create_dimension_scatter_plot_kepler("1");

    // Group the two distinct dimensions
    var scatterGroup0 = remove_blanks(dim0.group(), "");
    var scatterGroup1 = remove_blanks(dim1.group(), "");

    var chart = dc.compositeChart("#radius-correlation");

    chart
        .width(700)
        .height(300)
        .x(d3.scale.linear().domain([minPlanetRadius, 25]))
        .y(d3.scale.linear().domain([0, 7]))
        .xAxisLabel("Planet Radius (Earth Radii)")
        .yAxisLabel("Stellar Radius (Solar Radii)")
        .title(function(d) {
            return " Planet Radius = " + d.key[0] + " - Stellar Radius = " + d.key[1];
        })
        .brushOn(false)
        .clipPadding(1)
        .dimension(planetStellarRadiusDim)
        .legend(dc.legend().x(550).y(15).itemHeight(8).gap(5))
        .useViewBoxResizing(true)
        .transitionDuration(1500)
        .compose([
            dc.scatterPlot(chart)
            .symbolSize(2)
            .group(scatterGroup1, "Kepler Scope")
            .colors("lightSteelBlue"),
            dc.scatterPlot(chart)
            .symbolSize(2)
            .group(scatterGroup0, "Outside Kepler Scope")
            .colors("black")
        ]);

}

/*------------------------------------------------------------ Data Table-----*/

function showTable(ndx) {

    var dim = ndx.dimension(dc.pluck("pl_hostname"));

    dc.dataTable("#data-table")
        .dimension(dim)
        .group(function(d) {
            return "";
        })
        .columns([{
                label: "Hosting Stellar Name",
                format: function(d) { return d.pl_hostname; }
            },
            {
                label: "Year of discovery",
                format: function(d) {
                    if (d.pl_disc == "") {
                        return "N/A";
                    }
                    else {
                        return d.pl_disc;
                    }
                }
            },
            {
                label: "Discovery method",
                format: function(d) {
                    if (d.pl_discmethod == "") {
                        return "N/A";
                    }
                    else {
                        return d.pl_discmethod;
                    }
                }
            },
            {
                label: "Orbital Period [days]",
                format: function(d) {
                    if (d.pl_orbper == "") {
                        return "N/A";
                    }
                    else {
                        return convert_string_to_float(d.pl_orbper);
                    }
                }
            },
            {
                label: "Stellar distance [parsecs]",
                format: function(d) {
                    if (d.st_dist == "") {
                        return "N/A";
                    }
                    else {
                        return convert_string_to_float(d.st_dist);
                    }
                }
            },
            {
                label: "Stellar age [Gyr]",
                format: function(d) {
                    if (d.st_age == "") {
                        return "N/A";
                    }
                    else {
                        var stellarAge = convert_string_to_float(d.st_age);
                        if (stellarAge == "0.00") {
                            return "< 1Gyr";
                        }
                        else {
                            return stellarAge;
                        }
                    }
                }
            }
        ])
        .size(Infinity)
        .sortBy(function(d) {
            return d.pl_hostname;
        })
        .order(d3.ascending)
        .transitionDuration(1500)
        .useViewBoxResizing(true);
}
