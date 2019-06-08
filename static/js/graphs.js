queue()
    .defer(d3.csv, "data/static-exo.csv")
    .await(makeGraphs);

function makeGraphs(error, Data) {

    var ndx = crossfilter(Data);

    //Stats
    display_kepler_percent(ndx, "1", "#kepler-flagged");
    display_kepler_percent(ndx, "0", "#not-kepler-flagged");
    display_total_planets_sample(ndx);

    // Selectors
    show_kepler_selector(ndx);
    show_facility_selector(ndx);
    show_discovery_selector(ndx);
    show_discovery_year_selector(ndx);

    //Discovery charts
    show_discovery_method(ndx);
    show_discovery_facility(ndx);
    show_year_of_discovery(ndx);
    show_cumulative_year_of_discovery(ndx);
    //show_composite_chart_test1(ndx);

    //Exoplanets features charts
    show_orbital_period(ndx);
    show_planetary_system(ndx);

    //Correlation charts
    show_mass_radius_correlation(ndx);
    show_mass_correlation(ndx);
    show_radius_correlation(ndx);

    //Data table
    showTable(ndx);

    dc.renderAll();
}

/*----------------------------------------------------- Helper functions -----*/

//This function was taken in the code from another Code Institute student (Git: steview-d / Project: superhero-dashboard)
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

//Accumalate data to plot cumulative charts
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

//Display total number of planets in the sample
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
        .formatNumber(d3.format('.2'))
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

//Display % of planets discovered during the Kepler mission
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
        .formatNumber(d3.format('.2%'))
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

/*--------------------- Charts related to the discovery of the exoplanets-----*/

//Create a variable to set detection method colors
var detectionColors = d3.scale.ordinal()
    .domain(["Transit", "Radial Velocity", "Microlensing", "Imaging", "Timing Variations", "Orbital Brightness Modulation", "Astrometry"])
    .range(["cornflowerBlue", "grey", "lightblue", "orange", "seaGreen", "paleVioletRed", "navy"]);

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
        .width(600)
        .height(300)
        .margins({ top: 10, right: 20, bottom: 40, left: 20 })
        .useViewBoxResizing(true)
        .title(function(d) {
            return d.value + " planets detected by " + d.key + " method";
        })
        .label(function(d) {
            return d.key + " | " + d.value;
        })
        .transitionDuration(500)
        .colors(detectionColors)
        .dimension(dim)
        .group(group);

}

function show_discovery_facility(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_facility'));
    var group = remove_blanks(dim.group(), "");

    dc.pieChart('#discovery-facility')
        .height(330)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(500)
        .legend(dc.legend().x(80).y(20).itemHeight(8).gap(5))
        .slicesCap(8)
        .title(function(d) {
            return d.value + " planets discovered by " + d.key;
        })
        .useViewBoxResizing(true)
        .dimension(dim)
        .group(group);

}

// Helper function to create custom reducer for grouping on detection method
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

    //Creating grouping for each detection type
    var transitByYear = detection_by_year(dim, "Transit");
    var radialVelocityByYear = detection_by_year(dim, "Radial Velocity");
    var microlensingByYear = detection_by_year(dim, "Microlensing");
    var imagingByYear = detection_by_year(dim, "Imaging");
    var orbitalBrightnessByYear = detection_by_year(dim, "Orbital Brightness Modulation");
    var astronomyByYear = detection_by_year(dim, "Astrometry");

    //Grouping timing detection types under the generic "Timing Variations" method
    var timingVariationsByYear = dim.group().reduce(
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
        .transitionDuration(500)
        .useViewBoxResizing(true)
        .title(function(d) {
            return d.value.match + " planets discovered in " + d.key;
        })
        .legend(dc.legend().x(80).y(20).itemHeight(8).gap(5))
        .dimension(dim)
        .group(transitByYear, "Transit")
        .stack(radialVelocityByYear, "Radial Velocity")
        .stack(microlensingByYear, "Microlensing")
        .stack(imagingByYear, "Imaging")
        .stack(timingVariationsByYear, "Timing Variations")
        .stack(orbitalBrightnessByYear, "Orbital Brightness Modulation")
        .stack(astronomyByYear, "Astrometry")
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

function accumulate_detection_by_year(dimension, detection_method) {

    return {
        all: function() {
            var cumulate = 0;
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
            ).all().map(function(d) {
                cumulate += d.value;
                return { key: d.key, value: cumulate };
            });
        }
    };
}

//Create a variable colors to change default colors for bar charts
var barChartColors = d3.scale.ordinal()
    .range(["grey", "black"]);

function show_cumulative_year_of_discovery(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_disc'));
    var group = accumulate_group(dim.group());

    //var radialVelocityCumulativeYear = accumulate_detection_by_year(dim, "Radial Velocity");
    //var transitByCumulativeYear = accumulate_detection_by_year(dim, "Transit");

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
        .transitionDuration(500)
        .useViewBoxResizing(true)
        .legend(dc.legend().x(80).y(20).itemHeight(8).gap(5))
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(barChartColors)
        .dimension(dim)
        .group(group, "Total");

}

function show_composite_chart_test1(ndx) {

}

/*---------------------- Charts related to the features of the exoplanets-----*/

function show_orbital_period(ndx) {

    var orbitalPeriod = ndx.dimension(function(d) {

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

    var orbitalPeriodGroup = remove_blanks(orbitalPeriod.group(), "N/A");

    var scale = d3.scale.ordinal()
        .domain(['<= 1 day', ']1;5] days', ']5;15] days', ']15;30] days', ']30;365] days', '> 1 year'])
        .range([0, 1, 2, 3, 4, 5]);
    
    //We need to create a different color variable as we rearraged the order dimension for orbital period
    var orbitalChartColors = d3.scale.ordinal()
        .domain(['<= 1 day', ']1;5] days', ']5;15] days', ']15;30] days', ']30;365] days', '> 1 year'])
        .range(["grey", "black"]);

    dc.barChart("#orbital-period")
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .title(function(d) {
            return d.value + " planets with orbital period " + d.key;
        })
        .x(scale)
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Orbital Period in days")
        .elasticY(true)
        .barPadding(0.2)
        .clipPadding(15)
        .renderLabel(true)
        .transitionDuration(500)
        .useViewBoxResizing(true)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(orbitalChartColors)
        .dimension(orbitalPeriod)
        .group(orbitalPeriodGroup)
        .yAxis().ticks(4);
}

function show_planetary_system(ndx) {
    var dim = ndx.dimension(dc.pluck('pl_pnum'));
    var group = dim.group();

    dc.barChart("#planetary-system")
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .title(function(d) {
            return d.value + " planets with " + d.key + " known planet(s) in system";
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Number of planets in system")
        .elasticY(true)
        .barPadding(0.2)
        .clipPadding(15)
        .renderLabel(true)
        .transitionDuration(500)
        .useViewBoxResizing(true)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(barChartColors)
        .dimension(dim)
        .group(group)
        .yAxis().ticks(4);
}

/*--------------------------------------------------------- Correlations -----*/

var keplerFlagColors = d3.scale.ordinal()
    .domain(["0", "1"])
    .range(["black", "orange"]);

function show_mass_radius_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_masse"));
    var planetRadDim = ndx.dimension(dc.pluck("pl_rade"));

    var planetMassRadDim = ndx.dimension(function(d) {
        //prevents from drawing correlations when we are missing at least one of the two data set
        if (d.pl_masse == "" || d.pl_rade == "") {
            return "";
        }
        else {
            return [d.pl_masse, d.pl_rade, d.pl_kepflag];
        }
    });
    var planetMassRadDimGroup = remove_blanks(planetMassRadDim.group(), "");

    //To set domain we need to determine Max/Min for Planet Mass
    var minPlanetMass = planetMassDim.bottom(1)[0].pl_masse;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_masse;

    dc.scatterPlot("#mass-radius-correlation")
        .width(700)
        .height(300)
        .x(d3.scale.linear().domain([minPlanetMass, maxPlanetMass]))
        //I intentionally decided to exclude data for Radius > 25.EarthRadius (it only removes 3 planets in the sample) so that the scale is smoother
        .y(d3.scale.linear().domain([0, 25]))
        .brushOn(false)
        .symbolSize(3)
        .clipPadding(1)
        .xAxisLabel("Planet Mass (Earth Masses)")
        .yAxisLabel("Planet Radius (Earth Radii)")
        .title(function(d) {
            return " Planet Mass = " + d.key[0] + " - Planet Radius = " + d.key[1];
        })
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(keplerFlagColors)
        .useViewBoxResizing(true)
        .dimension(planetMassRadDim)
        .group(planetMassRadDimGroup)
        .margins({ top: 50, right: 50, bottom: 75, left: 75 });
}

function show_mass_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_masse"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        //prevents from drawing correlations when we are missing at least one of the two data set
        if (d.pl_masse == "" || d.st_mass == "") {
            return "";
        }
        else {
            return [d.pl_masse, d.st_mass, d.pl_kepflag];
        }
    });
    var planetStellarMassDimGroup = remove_blanks(planetStellarMassDim.group(), "");

    var minPlanetMass = planetMassDim.bottom(1)[0].pl_masse;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_masse;

    dc.scatterPlot("#mass-correlation")
        .width(700)
        .height(300)
        .x(d3.scale.linear().domain([minPlanetMass, maxPlanetMass]))
        //I intentionally decided to exclude data for Stellar Mass > 4.SolarMass (only removes 3 planets in the sample) so that the scale is smoother
        .y(d3.scale.linear().domain([0, 4]))
        .brushOn(false)
        .symbolSize(2)
        .clipPadding(1)
        .xAxisLabel("Planet Mass (Earth Masses)")
        .yAxisLabel("Stellar Mass (Solar Masses)")
        .title(function(d) {
            return " Planet Mass = " + d.key[0] + " - Stellar Mass = " + d.key[1];
        })
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(keplerFlagColors)
        .useViewBoxResizing(true)
        .dimension(planetStellarMassDim)
        .group(planetStellarMassDimGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}

function show_radius_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_rade"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        //prevents from drawing correlations when we are missing at least one of the two data set
        if (d.pl_rade == "" || d.st_rad == "") {
            return "";
        }
        else {
            return [d.pl_rade, d.st_rad, d.pl_kepflag];
        }
    });
    var planetStellarMassDimGroup = remove_blanks(planetStellarMassDim.group(), "");

    var minPlanetMass = planetMassDim.bottom(1)[0].pl_rade;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_rade;

    dc.scatterPlot("#radius-correlation")
        .width(700)
        .height(300)
        .x(d3.scale.linear().domain([minPlanetMass, maxPlanetMass]))
        //I intentionally decided to exclude data for Stellar Radius > 4.SolarrRadius (only removes 4 planets in the sample) so that the scale is smoother
        .y(d3.scale.linear().domain([0, 6]))
        .brushOn(false)
        .symbolSize(2)
        .clipPadding(1)
        .xAxisLabel("Planet Radius (Earth Radii)")
        .yAxisLabel("Stellar Radius (Solar Radii)")
        .title(function(d) {
            return " Planet Radius = " + d.key[0] + " - Stellar Radius = " + d.key[1];
        })
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(keplerFlagColors)
        .useViewBoxResizing(true)
        .dimension(planetStellarMassDim)
        .group(planetStellarMassDimGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}

/*------------------------------------------------------------ Data Table-----*/

function showTable(ndx) {
    var dim = ndx.dimension(dc.pluck("pl_name"));
    dc.dataTable("#data-table")
        .dimension(dim)
        .group(function(d) {
            return "";
        })
        .columns([{
                label: "Planet Name",
                format: function(d) { return d.pl_name; }
            },
            {
                label: "Hosting Stellar Name",
                format: function(d) { return d.pl_hostname; }
            },
            {
                label: "Year of discovery",
                format: function(d) { return d.pl_disc; }
            },
            {
                label: "Discovery method",
                format: function(d) { return d.pl_discmethod; }
            },
            {
                label: "Orbital Period",
                format: function(d) { return d.pl_orbper; }
            },
            {
                label: "Stellar age",
                format: function(d) { return d.st_age; }
            }
        ])
        .size(Infinity)
        .sortBy(function(d) {
            return d.pl_name;
        })
        .order(d3.ascending)
        .transitionDuration(500)
        .useViewBoxResizing(true);
}
