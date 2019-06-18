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

###### Feature 1 - Home page and modal form
- On the home page, when the button "Start Here" is clicked, a modal form window popped up. 
- The modal form enables the user to refine its sample by adding filters on various criteria (regarding the detection of the planet).
- The modal form also enables the user to select if he/she wants to display the data table (gathering individual information on the planets), the type of data to plot (cumulative or non-cumulative), what correlations graph to display. 
- The "Reset Filters" button on modal form achieves the same goal as the one on the navigation bar (they share the same class). It enables the user to reset filters directly when the modal form is opened. It prevents the user from having to exit the modal form, clicks the reset button, and then reopens the form. 
- The "Save & Close' button on modal form enables the user to exit the modal and be directly redirected to the dashboard section.

###### Feature 2 - Navigation bar with "Reset Filters" button 
- The navigation bar contains (from left to right):
    * The name of the website that when clicks redirect to the data dashboard.
    * Each navigation item in the nav menu returns to a specific section in the data dashboard.
    * The "Reset Filters' button enables the user to reset filters for the entire dashboard as well as setting back to the default parametres for the modal form.
    * The "Restart Here" button enables the user to re-open the modal form when the user has scrolled down and the home page is no longer on screen. This prevents the user from having to click "home", or from scrolling back up to the home section to reopen the modal form. 
- The navigation bar is fixed to the top which enables the user to access any section of the dashboard without scrolling up or down. This is very useful especially if the user is working on a large sample and checking at particular data in the table.

###### Feature 3 - Introduction box
- The introduction jumbotron box provides the user with information regarding exoplanets and definition. 
- The user can click the "Learn More" button to read more information on the NASA website.
- The user is also provided with the link of my data source "NASA Exoplanet Archive" to investigate further on available data. 

###### Feature 4 - Stat on the sample
- The user is provided with general figures on the sample in an aggregated format which enables him/her to understand the scope of its sample.
- Here is a list of what information are given: 
    * the total number of planets in the sample,
    * the average stellar age, (TO BE FIXED),
    * the percentage of planets that were (or were not) discovered during the Kepler mission, 
    * the percentage of planets that were discovered from space or ground. 

###### Feature 5 - Discovery section
The discovery section groups all the charts related to the discovery of the planets.
- discovery location - pie chart: it provides the user with the proportion of planets that were detected from devices loacated on earth, on space, or both. 
- discovery facility - pie chart: it provides the user with the breakdown of planets (in %) by observatory. As the number of observatory entities is quite significant, the chart only shows the top 8 observatory facilities to improve readibility (the rest are flagged under "others"). 
- detection method - row chart: it provides the user with the number of planets that were detected by a specific method. There is a total of 7 distinct detection methods reprensented. 
- detection by year (cumulative or non-cumulative) - bar chart: this is a stacked bar chart that provides the number of planets discovered by year with a breakdown by detection method. To improve user experience, the same colour chart was used for the "detection method" row chart and this "detections by year" bar chart. The user can see the data on a cumulative or non-cumlative basis according to the data type he/she chose in the modal form. By default, it is set to non-cumulative. 

###### Feature 6 - Features section
The features section groups all the charts related to the features of the planets.
- orbital period - bar chart: it groups the number of planets according to their orbital period ranging from period < 1 day to > 1 year. 
- number of planets in system - line graph: this graph shows the number of planets for which we have identified (or not) other planet(s) in the same planetary system. 
- distance to the planetary system - bar chart: it groups the number of planets according to their distance (distance of the hosting stellar from the solar system). It is expressed in "parsecs" which is a unit of distance used in astronomy. 
- stellar age - bar chart: it displays the number of planets according to the age of their corresponding hosting stellar. 

###### Feature 7 - Correlations section
- This section is composed of three scatter plot charts that provide the user with two-dimensional representation between certain metrics of the planets and its stellar. This enables the user to establish (or not) correlations between some know metrics.
- For each scatter plot, the user has the possibility to identify planets that were (or not) discovered during the Kepler mission.
- As previously said, when the user set filters in the modal form, he/she had the possibility to select what correlations graph to display.
- Axes are labelled and the unit of measure is given to the user so it cannot get confusing. 
- The user has the possibility to point out to a specific plot and have information for the two dimensions for this specific planet. 
- The following metrics are represented:
   * Correlation 1: mass vs radius of the planet, with the mass of the planet reprensented in the x-axis and the radius in the y-axis. Please note that this graph only pertains to planet features. The domain of the x-axis is set using the max and min values but the y-axis was set manually after analysing the data to prevents to avoid the effect of outliers. This increases user readibility and is a process often used in statistical analysis.
   * Correlation 2: planet mass vs. stellar mass, with the planet mass reprensented in the x-axis and the stellar mass in the y-axis. As it was sone for the previous correlation, the x-axis domain was set using max and min values but the y-axis was set manually to avoir outliers effet. 
   * Correlation 3: planet radius vs. stellar radius, with the planet radius reprensented in the x-axis and the stellar radius in the y-axis. As it was sone for the previous correlations, the x-axis domain was set using max and min values but the y-axis was set manually to avoir outliers effet. 

###### Feature 8 - Data Table
- In the modal form, the user can select if he/she wants to display a table with individual information for each planet in the sample. For a better user experience, the data table is by default unchecked as the original sample contains almost 4000 exoplanets so would be a poor user experience to have an endless page. 
- The user therefore have the option to display this data table which might be useful to collect information on individual planets for a smaller sample after applying some specific filters. The user has access to the following data:hosting stellar name (there was no need to display the name of the planets has it is the hosting stellar name + a letter), year of discovery, discovery method, orbital period, stellar distance, and stellar age. 

###### Feature 9 - Footer
The footer section at the bottom of the page provides the user with my name, email address (automatically open an email application on click), a link to my Git account and the link to the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/index.html) from which I extracted my data. 

### Future Features

*DRAFT:*
- Link to the NASA API
- Add more data on exoplanets
- let the user choose the correlation they need
- add markers to provide a referentiel to the user (Ex: age of the sun, Earth is here, Gaz planets...)
- make it more interactive and fun to learn from, so that it can be used to a wide range of users  

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

##### [Picasa](https://picasa.google.com/)
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

I used the Cloud 9 IDE to develop my projecct and used git for version control. I used GitHub as a remote repository to store my code, deploy and host my website.
- This is where you can access my [deployed website](https://alexiadelorme.github.io/project-exoplanets/)
- This is where you can access my [repository](https://github.com/AlexiaDelorme/project-exoplanets)

**Steps to deploy my website using GitHub:**
1. I created a new repository for this project: ["project-exoplanets"](https://github.com/AlexiaDelorme/project-exoplanets).
2. I pushed my code from Cloud9 to this repository (after linking it to this new repository).
3. I click on the "Settings" tab (top right menu item of navigation bar).
4. I scrolled down to "GitHub Pages" section, in the "Source" sub-section, I selected "master branch" in the dropdown box.
5. Then waited just a minute and was able to access the deployed version of my project following this URL [https://alexiadelorme.github.io/project-exoplanets/](https://alexiadelorme.github.io/project-exoplanets/).


## Credits

### Content
- The structure of the project and the selection of the data as well as the way they are displayed were entitely done by myself (ie. choice of data, choice of graphs etc...).
- The content in the introduction section and specifically the definition of exoplanet is excerpted from this [NASA Webpage](https://solarsystem.nasa.gov/planets/in-depth/).
- The data on which this project was built were obtained thanks to the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=planets).
- *Coments on how I built my dataset:*
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
- I would like to thank my mentor at [Code Institute](https://codeinstitute.net/), Kaushik Barodiya, for his guidance and ideas as well as his patience (especially during the data selection stage!). 
- Many thanks to the Tutor team at [Code Institute](https://codeinstitute.net/) for their patience and for helping me identify the "known" bug in the DC.js library, where it is not possible to display legends in classical scatter plot graphs. I was therefore able to implement a composite chart and solve this issue thanks to this [example](https://github.com/dc-js/dc.js/blob/master/web/examples/multi-scatter.html) they provided me with. 
- I would like to also thank the slack students community at [Code Institute](https://codeinstitute.net/) for their support along the way and a special thanks to "Dave L _lead" who held a slack call on data vizualisation (such a good timing as I was working on my milestone project). This session was very helpful for me to overcome some issues I encountered at the end of my project. He also shared his code for his [second milestone project](https://github.com/steview-d/superhero-dashboard) which was also very useful to me and many other students!
- I deeply thank the contributors and authors of the [dc.js library](https://dc-js.github.io/dc.js/docs/html/index.html) and this very useful [FAQ page](https://github.com/dc-js/dc.js/wiki/FAQ). Those were basically my encyclopedia while buidling this project!
- And finally I would like to thank my dad who shared with me his passion for Astrophysics and inspired me for building this project on exoplanets.
- **Last but not least** many thanks to all the people that are passionate about Astronomy and have helped me understand so many things on our universe - of course Newton, Einstein, Planck... - but a **special thanks** to:
    - The NASA agency for providing so many free resources online available to the general public. 
    - The French physicist Christophe Galfard for writing his amazing book *The Universe in your hand*
    - The French aerospace engineer Thomas Pesquet for sharing his wonderful experience on the International Space Station and inspiring so many people to dream bigger!