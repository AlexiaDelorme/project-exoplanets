queue()
    .defer(d3.csv, "data/static-exo.csv")
    .await(makeGraphs);

function makeGraphs(error, Data) {

    var ndx = crossfilter(Data);

    show_discovery_method(ndx);
    show_discovery_facility(ndx);
    show_year_of_discovery(ndx);
    show_orbital_period(ndx);
    show_planetary_system(ndx);
    show_mass_correlation(ndx);
    show_radius_correlation(ndx);

    dc.renderAll();
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
    var dim = ndx.dimension(dc.pluck('pl_facility'));
    var group = dim.group();

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
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year of discovery");
}

function show_orbital_period(ndx) {

    var orbitalPeriod = ndx.dimension(function(d) {
        var days = d.pl_orbper;
        if (days <= 1) {
            return '< 1 day';
        }
        else if (days > 1 && days <= 5) {
            return ']1;5] days';
        }
        else {
            return '> 5 days';
        }
    });

    var orbitalPeriodGroup = orbitalPeriod.group();

    dc.barChart("#orbital-period")
        .width(700)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(orbitalPeriod)
        .group(orbitalPeriodGroup)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
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

function show_mass_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_massj"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        return [d.pl_massj, d.st_mass];
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
        .xAxisLabel("Planet Mass")
        .yAxisLabel("Stellar Mass")
        .title(function(d) {
            return " Planet Mass = " + d.key[0] + " - Stellar Mass = " + d.key[1];
        })
        .dimension(planetStellarMassDim)
        .group(planetStellarMassDimGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}

function show_radius_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("pl_rade"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        return [d.pl_rade, d.st_rad];
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
        .xAxisLabel("Planet Radius")
        .yAxisLabel("Stellar Radius")
        .title(function(d) {
            return " Planet Radius = " + d.key[0] + " - Stellar Radius = " + d.key[1];
        })
        .dimension(planetStellarMassDim)
        .group(planetStellarMassDimGroup)
        .margins({ top: 10, right: 50, bottom: 75, left: 75 });
}
