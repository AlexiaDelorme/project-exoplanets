queue()
    .defer(d3.csv, "data/static-exo.csv")
    .await(makeGraphs);

function makeGraphs(error, Data) {

    var ndx = crossfilter(Data);

    show_kepler_selector(ndx);
    show_discovery_method(ndx);
    show_discovery_facility(ndx);
    show_year_of_discovery(ndx);
    show_orbital_period(ndx);
    show_planetary_system(ndx);
    show_mass_radius_correlation(ndx);
    show_mass_correlation(ndx);
    show_radius_correlation(ndx);
    showTable(ndx);

    dc.renderAll();
}

function show_kepler_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('pl_kepflag'));
    var group = dim.group();

    dc.selectMenu("#kepler-selector")
        .dimension(dim)
        .group(group);
}

function show_discovery_method(ndx) {

    var dim = ndx.dimension(dc.pluck('pl_discmethod'));

    var group = dim.group();

    dc.pieChart('#discovery-method')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(dim)
        .group(group)
        .legend(dc.legend());
}

function show_discovery_facility(ndx) {

    //var dim = ndx.dimension(dc.pluck('pl_facility'));

    var dim = ndx.dimension(function(d) {

        var facility = d.pl_facility;

        if (facility == "Kepler")
            return "Kepler";
        else if (facility == "K2")
            return "K2";
        else if (facility == "La Silla Observatory")
            return "La Silla Observatory";
        else if (facility == "W. M. Keck Observatory")
            return "W. M. Keck Observatory";
        else if (facility == "Multiple Observatories")
            return "Multiple Observatories";
        else if (facility == "SuperWASP")
            return "SuperWASP";
        else if (facility == "HATNet")
            return "HATNet";
        else if (facility == "HATSouth")
            return "HATSouth";
        else if (facility == "OGLE")
            return "OGLE";
        else if (facility == "Haute-Provence Observatory")
            return "Haute-Provence Observatory";
        else if (facility == "Anglo-Australian Telescope")
            return "Anglo-Australian Telescope";
        else if (facility == "Lick Observatory")
            return "Lick Observatory";
        else
            return "Others*";
    });

    var group = dim.group();

    console.log(group.all());

    dc.pieChart('#discovery-facility')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(dim)
        .group(group)
        .legend(dc.legend());
}

function show_year_of_discovery(ndx) {
    var dim = ndx.dimension(dc.pluck('pl_disc'));
    var group = dim.group();

    var minYear = dim.bottom(1)[0].pl_disc;
    var maxYear = dim.top(1)[0].pl_disc;

    dc.barChart("#year-of-discovery")
        .width(800)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal);
}

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

    var orbitalPeriodGroup = orbitalPeriod.group();

    //Code taken from Stackoverflow but does not enable me to fix the problem of empty values
    var filteredGroup = {
        all: function() {
            return orbitalPeriodGroup.top(Infinity).filter(function(d) { return d.pl_orbper !== null; });
        }
    };

    var scale = d3.scale.ordinal()
        .domain(['<= 1 day', ']1;5] days', ']5;15] days', ']15;30] days', ']30;365] days', '> 1 year'])
        .range([0, 1, 2, 3, 4, 5]);

    dc.barChart("#orbital-period")
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(orbitalPeriod)
        .group(filteredGroup)
        .transitionDuration(500)
        .x(scale)
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Orbital Period in days");
}

function show_planetary_system(ndx) {
    var dim = ndx.dimension(dc.pluck('pl_pnum'));
    var group = dim.group();

    dc.barChart("#planetary-system")
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Number of planets in system");
}

var keplerFlagColors = d3.scale.ordinal()
    .domain(["0", "1"])
    .range(["black", "orange"]);

function show_mass_radius_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_masse"));
    var planetMassRadDim = ndx.dimension(function(d) {
        return [d.pl_masse, d.pl_rade, d.pl_kepflag];
    });
    var planetMassRadDimGroup = planetMassRadDim.group();

    var minPlanetMass = planetMassDim.bottom(1)[0].pl_masse;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_masse;

    dc.scatterPlot("#mass-radius-correlation")
        .width(800)
        .height(400)
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
        .dimension(planetMassRadDim)
        .group(planetMassRadDimGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}

function show_mass_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_massj"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        return [d.pl_massj, d.st_mass, d.pl_kepflag];
    });
    var planetStellarMassDimGroup = planetStellarMassDim.group();

    var minPlanetMass = planetMassDim.bottom(1)[0].pl_massj;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_massj;

    dc.scatterPlot("#mass-correlation")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minPlanetMass, maxPlanetMass]))
        .y(d3.scale.linear().domain([0, 4]))
        .brushOn(false)
        .symbolSize(2)
        .clipPadding(1)
        .xAxisLabel("Planet Mass (Jupiter Masses)")
        .yAxisLabel("Stellar Mass (Solar Masses)")
        .title(function(d) {
            return " Planet Mass = " + d.key[0] + " - Stellar Mass = " + d.key[1];
        })
        .colorAccessor(function(d) {
            return d.key[2];
        })
        .colors(keplerFlagColors)
        .dimension(planetStellarMassDim)
        .group(planetStellarMassDimGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}

function show_radius_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_rade"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        return [d.pl_rade, d.st_rad, d.pl_kepflag];
    });
    var planetStellarMassDimGroup = planetStellarMassDim.group();

    var minPlanetMass = planetMassDim.bottom(1)[0].pl_rade;
    var maxPlanetMass = planetMassDim.top(1)[0].pl_rade;

    dc.scatterPlot("#radius-correlation")
        .width(800)
        .height(400)
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
        .dimension(planetStellarMassDim)
        .group(planetStellarMassDimGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}

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
        .transitionDuration(500);
}
