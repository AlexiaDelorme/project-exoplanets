# Exoplanets Dashboard

This is a single page dashboard presenting data on the most recent (and confirmed) exoplanets published by the [NASA Exoplanet Science Institue](https://exoplanetarchive.ipac.caltech.edu/index.html).The data were thouroughly selected and displayed to allow users without background in Astrophysics to easily understand and analyse it.

The dashboard was built using DC.js, D3.js and crossfilter.js libraries to present the data through different chart types : pie charts, bar/row charts, scatter plot and finally a recap table. 

The interface enables the user to collect diverse information related to the detection of the exoplanets, the years they were discovered, and get some simple features as well as correlations regarding the planets and their hosting stellar. The user has the option to filter exoplanets thanks to a modal form so that he/she can isolate specific planets based on chosen criteria. A recap data table is presented at the bottom of the page to provide the user with additional relevant information on individual planets in the sample (such as the hosting stellar name, distance...). 

The current deployed version can be found at [here](https://alexiadelorme.github.io/project-exoplanets/).

## UX

This dashboard is built for users who have an interest in Astrophysics and specifically exoplanets and would like to quickly analyze and collect information on the most recent and confirmed exoplanets published by the NASA Exoplanet Science Institute. 

It allows users to refine a large sample of more than 3900 exoplanets thanks to a simple modal form. They can decide what type of charts they want to display and/or filter on specific criteria to analyse data in a simple and flexible manner. Based on their selection, users can visualize aggregated charts and can also have access - through a data table - to specific features for each individual planets in the sample .
 
### User Stories
 
 * As a user, I want to have access to a clear and simple dashboard for a large sample of exoplanets without having to go through a spreadsheet with equivocal column fields and without any hierarchy in the data. This way I have a glimpse of the general information and trends on exoplanets in an aggregated format. 
 * As a user, I want to easily identify information related to the exoplanet discovery: when was it discovered, how (method of detection), where (from space or from earth), from what entity it was discovered - and also to acess some of their features such as their orbital period and other information related to their planetary system.
 * As a user, I want to be able to access scatter plots on some features of the exoplanets so that I can identify correlations and be able to confirm/infirm some hypothesis on planets.
 * As a user, I want to be able to filter according to some features related to either the discovery of the exoplanets (years of discovery, detection method or facility), or analyse data for exoplanets inside/outside the Kepler scope (ie. exoplanets detected during the Kepler mission), choose the type of data, and be able to keep only correlations that are relevant to my analysis. This will enable me to refine my analysis according to some chosen criteria.
 * As a user, I want to have access to information for individual planets either for the whole sample or for a sample based on some specific criteria.
 * As a user, I want to be able to reset the entire dashboard without having to manually reload the page, reclick on any chart, or re-enter the modal form. 

### Wireframes

<img src="..." align=top width=250>
 
## Features

### Current Features
###### Feature 1 - Navigation bar with "Reset Filters" button 
- The navigation bar contains (from left to right):
    * The name of the website that when clicks redirect to the data dashboard.
    * Each navigation item in the nav menu returns to a specific section in the data dashboard.
    * The "Reset Filters' button enables the user to reset filters for the entire dashboard as well as setting back to the default parametres for the modal form. 
- The navigation bar is fixed to the top which enables the user to access any section of the dashboard without scrolling up or down.This is very useful as the dashboard is quite long especially if the user is checking at data on a particular planet in the table and working on a large sample. 

###### Feature 2 - Home page and modal form
- On the home page, when the button "Start Here" is clicked, a modal form window popped up. 
- The modal form enables the user to refine its sample by adding filters on various criteria (regarding the detection of the planet).
- The modal form also enables the user to select if he/she wants to display the data table (gathering individual information on the planets), the type of data to plot (cumulative or non-cumulative), what correlations graph to display. 
- The "Reset Filters" button on modal form achieves the same goal as the one on the navigation bar (they share the same class). It enables the user to reset filters directly when the modal form is opened. It prevents the user from having to exit the modal form, clicks the reset button, and then reopens the form. 
- The "Save & Close' button on modal form enables the user to exit the modal and be directly redirected to the dashboard section.

###### Feature 3 - Introduction box
- The introduction jumbotron box provides the user with information regarding exoplanets and definition. 
- The user can click the "Learn More" button and to read more information on the NASA website.
- The user is also provided with the link of my data source "NASA Exoplanet Archive" to investigate further on available data. 

###### Feature 4 - Stat on the sample
- The user is provided with general figures on the sample in an aggregated format which enables him to understand the scope of its sample.
- Here is a list of what information are given: 
    * the total number of planets in the sample,
    * the average stellar age, (TO BE FIXED),
    * the percentage of planets that were (or were not) discovered during the Kepler mission, 
    * the percentage of planets that were discovered from space or ground. 

###### Feature 5 - Discovery section
- xxx

###### Feature 6 - Features section
- xxx

###### Feature 7 - Correlations section
- xxx

###### Feature 8 - Data Table
- xxx

###### Feature 9 - Footer
- xxx

### Future Features

###### xxxx
- xxx

###### xxx
- xxx 

## Technologies Used

##### [Balsamiq](https://balsamiq.com/) 
- I used Balsamiq to design my wireframes after drawing them manually.

##### [Cloud9](https://c9.io)
- I used Cloud9 as my code editor for HTML, JS and CSS.

##### [HTML5](https://www.w3.org/TR/html/)
- I used HTML for creating the static content of my webpage.
- The following code validator was used to test my HTML code: [HTML](https://validator.w3.org/)

##### [CSS3](https://www.w3.org/Style/CSS/) & [SASS](https://sass-lang.com/)
- I used SASS/SCSS to structure the styling of my webpage and personalize it. My SCSS stylesheets where then mapped to a CSS file using the CLI. 
- The following code validator was used to test my CSS code:  [CSS](https://jigsaw.w3.org/css-validator/)

##### [Bootswatch](https://bootswatch.com/lux/)
- I used Bootswatch Theme Lux to have an elegant template for my website. 

##### [Bootstrap 4](https://getbootstrap.com/)
- I used Boostrap version 4 mostly for the grid system to easily create a responsive website.

##### [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- I used the following JS libraries combined with some core JS to create data-visualization elements:
    * [D3.js](https://d3js.org/)
    * [DC.js](https://dc-js.github.io/dc.js/)
    * [Crossfilter.js](http://square.github.io/crossfilter/)
* [D3-queue.js](https://github.com/d3/d3-queue) to load the data field in CSV format.
* [jQuery](https://jquery.com/) to simplify the DOM manipulation based on the user input via the modal form or when the reset button is clicked.
* [JSHint](https://jshint.com/) ??????? IS FOR CHECKING ERROS AND CODE QUALITY ??????? TBD

##### Picasa
- I used Picasa to resize and change the orientation of my background image.

##### [ImageOptim](https://imageoptim.com/mac)
- I used ImageOptim to optimize the size my background image. 

##### [Font Awesome](https://origin.fontawesome.com/)
- I used Font Awesome to display icons for the footer of my page.

##### [Git & GitHub](https://github.com/)
- I used Git for version control. 
- I used GitHub to store my code in a remote repository, deploy and host my website.

## Testing ####

#### Known Issues
* xxx
* xxx

## Deployment

This site is hosted using GitHub and directly deployed using the master branch with a unique contributor being myself. 
You can access to my deployed website through the following link. 
You can also access to my source code directly through the repository I have created through the following link.

## Credits

### Content
- The structure of the project and the selection of the data as well as the way they are displayed were entitely done by myself (ie. choice of data, choice of graphs etc...).
- The content in the introduction section and specifically the definition of exoplanet is excerpted from this [NASA Webpage](https://solarsystem.nasa.gov/planets/in-depth/).
- The data on which this project was built were obtained thanks to the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=planets).
- *Comment regarding building my dataset* :
    - Before building my own dataset, I analysed each data field provided in the auto-populated "confirmed planets" file directly downloadable on the NASA Exoplanet Archive website. I was able to identify what data were relevant for my project thanks to the very detailed information on table data columns provided [here](https://exoplanetarchive.ipac.caltech.edu/docs/API_exoplanet_columns.html).
    - I was then able to select what data I wanted to use for my project by reviewing all the possible information available from their database. To be honest, this part took me very long and I deeply thank my dad, who is a Physicist, for his patience in going through all the information with me!
    - I received inspiration for the choice of correlation graphs thanks to the pre-generated plots available in the NASA Exoplanet Archive website [here](https://exoplanetarchive.ipac.caltech.edu/exoplanetplots/).
    - I decided to upload my dataset in a CSV format simply because it was easier for me to analyse the data on a separate excel spreadsheet while building my project. But it was also possible to download the data using JSON format. 

### Media
- The webpage was built by myself but I used this [Bootswatch theme](https://bootswatch.com/lux/) to speed up the designing process.
- The background image used in the home section was obtained from [Pexels](https://www.pexels.com).
- I used [Picasa](https://picasa.google.com/) to flip the image vertically so that it would render better on my website.
- I used [Font Awesome](https://fontawesome.com/v4.7.0/icons/) for the email and git icons used in the footer.

### Acknowledgements ####
- I would like to thank my mentor at Code Institute, Kaushik Barodiya, for his guidance and ideas as well as his patience (especially during the data selection stage!). 
- Thanks to the Tutor team for their patience and for helping me identify the "known" bug in the DC.js library, where it is not possible to display legends in classical scatter plot graphs. I was therefore able to implement a composite chart and solve this issue thanks to this [example](https://github.com/dc-js/dc.js/blob/master/web/examples/multi-scatter.html) they provided me with. 
- I would like to also thank the slack community at Code Institute for their support along the way and a special thanks to "Dave L _lead" who held a slack call on data vizualisation (such a good timing as I was working on my milestone project). This session was very helpful for me to overcome some issues I encountered at the end of my project. He also shared his code for his [second milestone project](https://github.com/steview-d/superhero-dashboard) which was also very useful to me and many other students!
- I deeply thanks the contributors and authors of the [dc.js library](https://dc-js.github.io/dc.js/docs/html/index.html) and this very useful [FAQ page](https://github.com/dc-js/dc.js/wiki/FAQ). These two wepages were basically my encyclopedias while buidling my project!





