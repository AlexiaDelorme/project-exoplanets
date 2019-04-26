queue()
    .defer(d3.csv, "data/static-exo.csv")
    .await(makeGraphs);

function makeGraphs(error, Data) {

    var ndx = crossfilter(Data);

    show_discovery_method(ndx);
    show_year_of_discovery(ndx);
    show_mass_correlation(ndx);
    show_radius_correlation(ndx);
    show_orbital_period(ndx);

    dc.renderAll();
}

function show_discovery_method(ndx) {

    var dim = ndx.dimension(dc.pluck('fpl_discmethod'));
    var group = dim.group();

    dc.pieChart('#discovery-method')
        .height(330)
        .radius(90)
        .transitionDuration(1500)
        .dimension(dim)
        .group(group);

}

function show_year_of_discovery(ndx) {
    var dim = ndx.dimension(dc.pluck('fpl_disc'));
    var group = dim.group();

    var minYear = dim.bottom(1)[0].fpl_disc;
    var maxYear = dim.top(1)[0].fpl_disc;

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
        var days = dc.fpl_orbper;
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
        .xAxisLabel("Orbital Period in days")
        .xUnits(dc.units.ordinal);
}

function show_mass_correlation(ndx) {

    var planetMassDim = ndx.dimension(dc.pluck("fpl_bmasse"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        return [d.fpl_bmasse, d.fst_mass];
    });
    var planetStellarMassDimGroup = planetStellarMassDim.group();

    var minPlanetMass = planetMassDim.bottom(1)[0].fpl_bmasse;
    var maxPlanetMass = planetMassDim.top(1)[0].fpl_bmasse;

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

    var planetMassDim = ndx.dimension(dc.pluck("fpl_rade"));
    var planetStellarMassDim = ndx.dimension(function(d) {
        return [d.fpl_rade, d.fst_rad];
    });
    var planetStellarMassDimGroup = planetStellarMassDim.group();

    var minPlanetMass = planetMassDim.bottom(1)[0].fpl_rade;
    var maxPlanetMass = planetMassDim.top(1)[0].fpl_rade;

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
