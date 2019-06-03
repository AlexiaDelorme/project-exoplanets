queue()
    .defer(d3.csv, "data/static-exo.csv")
    .await(makeGraphs);

function makeGraphs(error, Data) {

    var ndx = crossfilter(Data);

    // Selectors
    show_kepler_selector(ndx);
    show_facility_selector(ndx);
    show_discovery_selector(ndx);
    show_discovery_year_selector(ndx);

    //Discovery charts
    show_discovery_method(ndx);
    show_discovery_facility(ndx);
    show_year_of_discovery(ndx);
    show_composite_chart_discovery_year(ndx);

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


/*--------------------- Charts related to the discovery of the exoplanets-----*/


function show_discovery_method(ndx) {

    //var dim = ndx.dimension(dc.pluck('pl_discmethod'));

    var dim = ndx.dimension(function(d) {

        if (d.pl_discmethod == "Eclipse Timing Variations" || d.pl_discmethod == "Transit Timing Variations" || d.pl_discmethod == "Pulsar Timing" || d.pl_discmethod == "Pulsation Timing Variations") {
            return 'Timing Varations';
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
        .legend(dc.legend())
        .slicesCap(8)
        .title(function(d) {
            return d.value + " planets discovered by " + d.key;
        })
        .useViewBoxResizing(true)
        .dimension(dim)
        .group(group);

}


function show_year_of_discovery(ndx) {

    function detectionByYear(dimension, detection_method) {

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

    var dim = ndx.dimension(dc.pluck('pl_disc'));

    //Creating grouping for each detection type
    var radialVelocityByYear = detectionByYear(dim, "Radial Velocity");
    var transitByYear = detectionByYear(dim, "Transit");
    var microlensingByYear = detectionByYear(dim, "Microlensing");
    var imagingByYear = detectionByYear(dim, "Imaging");
    var orbitalBrightnessByYear = detectionByYear(dim, "Orbital Brightness Modulation");
    var astronomyByYear = detectionByYear(dim, "Astrometry");

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
        .elasticY(true)
        .barPadding(0.2)
        .transitionDuration(500)
        .useViewBoxResizing(true)
        .legend(dc.legend().x(80).y(20).itemHeight(8).gap(5))
        .dimension(dim)
        .group(radialVelocityByYear)
        .stack(transitByYear)
        .stack(microlensingByYear)
        .stack(imagingByYear)
        .stack(timingVariationsByYear)
        .stack(orbitalBrightnessByYear)
        .stack(astronomyByYear)
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return d.value.match;
            }
            else {
                return 0;
            }
        });

}

/*
function show_range_year(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_disc'));

    var minYear = dim.bottom(1)[0].pl_disc;
    var maxYear = dim.top(1)[0].pl_disc;

    var infYear = 2011;
    var supYear = 2017;

    var domainArray = [infYear, supYear];

    //.x(d3.scale.ordinal().domain(domainArray))
    //.xUnits(dc.units.ordinal)

    var group = dim.group().reduce(
        function(p, v) {
            p.total++;
            if (v.pl_disc >= infYear && v.pl_disc <= supYear) {
                p.match++;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if (v.pl_disc >= infYear && v.pl_disc <= supYear) {
                p.match--;
            }
            return p;
        },
        function() {
            return { total: 0, match: 0 };
        }
    );

    dc.barChart("#range-year")
        .width(800)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .barPadding(0.2)
        .transitionDuration(500)
        .useViewBoxResizing(true)
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match)
            }
            else {
                return 0;
            }
        })
        .dimension(dim)
        .group(group);

}
*/

function show_composite_chart_discovery_year(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_disc'));

    function detectionByYear(dimension, detection_method) {

        return dimension.group().reduce(function(d) {
            if (d.pl_discmethod == detection_method) {
                return +1;
            }
            else {
                return 0;
            }
        })
    }

    //Creating grouping for each detection type
    var radialVelocityByYear = detectionByYear(dim, "Radial Velocity");
    var transitByYear = detectionByYear(dim, "Transit");
    var microlensingByYear = detectionByYear(dim, "Microlensing");
    var imagingByYear = detectionByYear(dim, "Imaging");
    var orbitalBrightnessByYear = detectionByYear(dim, "Orbital Brightness Modulation");
    var astronomyByYear = detectionByYear(dim, "Astrometry");

    //Grouping timing detection types under the generic "Timing Variations" method
    var timingVariationsByYear = dim.group().reduce();

    var compositeChart = dc.compositeChart('#range-year');

    compositeChart
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 30, bottom: 40, left: 40 })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year of discovery")
        .yAxisLabel("Planets by detection method")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .useViewBoxResizing(true)
        .brushOn(false)
        .dimension(dim)
        .compose([
            dc.lineChart(compositeChart)
            .colors('green')
            .group(radialVelocityByYear, 'Radial Velocity'),
            dc.lineChart(compositeChart)
            .colors('red')
            .group(transitByYear, 'Transit'),
            dc.lineChart(compositeChart)
            .colors('blue')
            .group(microlensingByYear, 'Microlensing')
        ]);

}

/*
var group = dim.group();

    dc.lineChart("#range-year")
        .width(800)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .useViewBoxResizing(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);
*/

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
        .renderLabel(true)
        .transitionDuration(500)
        .useViewBoxResizing(true)
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
        .renderLabel(true)
        .transitionDuration(500)
        .useViewBoxResizing(true)
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
    var planetMassRadDim = ndx.dimension(function(d) {
        //prevents drawing correlations when we are missing at least on of the two data
        if (d.pl_masse == "" || d.pl_rade == "") {
            return "";
        }
        else {
            return [d.pl_masse, d.pl_rade, d.pl_kepflag];
        }
    });
    var planetMassRadDimGroup = remove_blanks(planetMassRadDim.group(), "");

    var minPlanetMass = planetMassDim.bottom(1)[0].pl_masse;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_masse;

    dc.scatterPlot("#mass-radius-correlation")
        .width(700)
        .height(300)
        .x(d3.scale.linear().domain([minPlanetMass, maxPlanetMass]))
        .y(d3.scale.linear().domain([0, 6]))
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
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}


function show_mass_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_masse"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        //prevents drawing correlations when we are missing at least on of the two data
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
        //prevents drawing correlations when we are missing at least on of the two data
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
