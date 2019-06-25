# JavaScript testing

This section documents manual and semi-manual testing that was done on JS files for this project. 


## Script.js testing

This section documents the manual tests that were performed on the [script.js](../../static/js/script.js) file. 

This file uses jQuery to simplify DOM manipulation mostly to handle interactions with user input through the modal form. 

### Code Quality

[script.js](../../static/js/script.js) was passed through [JSHint](https://jshint.com/) by direct input to check for any issues in the JS code such as compatibility.

You can find below the output of this code quality check. 2 undefined variables were identified but refer to external libraries:
- **"$"** as I used jQuery for DOM manipulation
- **"dc"** which is used to reset the charts when the "reset filter" button is clicked

No further issues were identified. 

![JS Hint](../validators/jsscript.jpg)

### DOM Interaction testing

###### Testing case 1

*Check default DOM parametres when page has loaded*

Test scenario:
- Click on the refresh button of the browser and waits untill the page has fully loaded.
- The menu items in the navigation bar should display (in this specific order): home, discoveries, features and correlation. 
- Check that on the top right corner of the navigation bar there should only be one button "Reset Filters".
- Click on the "Start Here" button in the middle of the home page.
- A modal form should appears, check that:
    - the checkbox for "Data Table" is by default disabled
    - the checkbox for "Type of data is on "non-cumlative"
    - all correlations checkboxes should be enabled
- Close the modal form and got to the discovery section, check that the graph "detection per year" displays non-cumlative data. 

Test result: **Successful**

###### Testing case 2

*Testing the "restart" button*

Test scenario:
- Click on the refresh button of the browser and waits untill the page has fully loaded.
- Scroll down to the intro section, so that the home page is passed.
- A black "Restart Here" button on the top right corner of the navigation bar should appear next to the white "Reset Filters" button.
- When you click this button, the modal form should reopen.
- Scroll back to the top of the page (up to home section), the button should dispappear from the navigation bar.

Test result: **Successful**

###### Testing case 3

*Testing icon definition*

Test scenario:
- Click on the refresh button of the browser and waits untill the page has fully loaded.
- Go to discovery section and click on the question mark icon next to the title of the graph "detection method" (3rd graph of this section).
- Click the icon and check that you are being redirected to a wikipedia page in a new tab that provides you information on detection methods for exoplanets.
- Go to features section and click on the question mark icon next to the title of the graph "orbital period", a paragraph with a short definition should appear below the title.
- Click again on the question mark icon and the definition should disappear. 
- Follow the same steps for the "distance to the planetary system" graph, you should be able to toggle hide/show a definition for the 'parsecs' unit of measure. 

Test result: **Successful**

###### Testing case 4

*Testing the modal form interaction with the DOM*

Hypothesis: The user should go to the modal form either by clicking the "Start Here" button on the home page or the "Restart Here" button in the navigation bar.

Test scenario:
- in the modal form, perform the following tests:
- 1st part:
    - enable the "Data Table" checkbox and exit modal form
    - a new menu item in the navigation bar "Data Table" should have appeared
    - click it to get to the section and check that the table is appearing properly
    - double check that when you re-enter the modal form, and disable the "Data Table", the section and menu item should disappear
- 2nd part:
    - tick the "Type of Data" checkbox to cumulative and exit modal form
    - scroll down to the "detections per year" graph and check that the data are now on a cumulative basis
    - double check that when you re-enter the modal form, and put the data back to non-cumulative, the graph is back to displaying non-cumlative data
- 3rd part:
    - in the "Correlations Data" section of the modal form (at the very bottom), disable the first scatter plot "Mass vs. Radius Planet"
    - exit modal form and check in the correlation section that this corresponding scatter plot is no longer displayed in the dashboard
    - perform the same test for the other two scatter plots
    - check that when you disable the three correlations graphs in the modal form, the correlation section is no longer visible in the navigation bar and the dashboard
    - double check that when you re-enter the modal form, and enable the correlations graphs, the section should reappears in the navigation bar as well as the three scatter plots in the correlation section. 

Test result: **Successful**

###### Testing case 5

*Setting reset filters button*

Hypothesis: the user already applied specific filters to the dashboard either through the modal form or by directly clicking on the charts.

Test scenario:
- Open the modal form by clicking on the "Start Here" button of the home page.
- Put the following parameters:
    - click checkbox to enable data table
    - click checkbox to cumulative data
    - disable at least one of the correlation graphs 
    - add at least one filter by selecting a criteria on the sample
- Click on the "Reset Filters" button at the bottom of the modal form and check that the form is back to its default parametres (as described in test case 1). The dashboard should display the data for the entire sample.
- Follow the same steps but instead of clicking the "Reset Filters" button directly from the modal form, clicks the "Reset Filters" button from the navigation bar. The outcome should be the same. 

Test result: **Successful**


## Graphs.js testing

This section documents all the manual tests that were performed on the [graphs.js](../../static/js/graphs.js) file. 


### Code Quality

[graphs.js](../../static/js/graphs.js) was passed through [JSHint](https://jshint.com/) by direct input to check for any issues in the JS code such as compatibility.

You can find below the output of this code quality check. 

4 undefined variables were identified but refer to external libraries:
- **"queue"** is used to load the data
- **"crossfilter"** is used for handling the dataset
- **"d3"** is used for data vizualisation
- **"dc"** is used to leverage on d3

There were two warnings highlighted by JS Hint regarding the use of new ES6 syntax:
- 'let' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).
- 'for of' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).

To fix this, I decided to change the use of "let" by "var" and then included the following comment at the beginning of my file: " // jshint esversion: 6 " for the second warning. 

No further issues were mentioned apart from an unused variable that was created only for testing purposes but that was then commented out. 

![JS Hint](../validators/jsgraph.jpg)


### Data consistency testing

For this section, I am going to go through each functions that are used to create data vizualisation and check their consistency using my testing file (using excel) that you can access [here](PATH TO ADD). 

I have indeed used this excel file to write my code and build graphs incrementally throughout this project. 

To simplify this testing protocol and prevent from missing any issues, I will follow the same order as my code is written in this file.

**Important notes on how to use this file:**
- The file is organized by tabs, each corresponding to testing the different section of the data dashboard by recreating the same graphs with excel. 
- The first tab is dedicated to testing the consistency of the data at sample level but is also used to test the selectors within the modal form. 
- The other tabs refer to each graphs in the data dashboard and are arranged by order of appearance within the website. Example: "pie chart 1" tab refers to the first pie chart in the dashboard which is the "discovery location" chart. 
- I tried to automate as much as Excel would allow me by using pivot tables and pivot charts. But sometimes the use of custom dimension forced me to build the graphs manually in excel. 

#### Helper functions

TRY AND AUTOMATE THIS PART USING JASMINE

###### function remove_blanks

###### function show_slice_percent
  
###### function accumulate_group

###### function convert_string_to_float

#### Selectors to filter charts

The data source contains 3972 rows which correspond to the instances of the 3972 discovered exoplanets in the file. This can easily be checked by comparing the number of exoplanets displayed in the data dashboard ("stats on our sample" in the intro section) when no filter is applied and the "count of pl_name" in the "Data sample" tab of my excel testing file. 

Please find below the instance of a test scenario that was used to check the consistency of data when filtering them using the modal form. To avoid repetition in this file, the test scenario is detailed below for the "show_kepler_selector" function, but all functions used to filter the sample went through the exact same testing procedure. 

###### function show_kepler_selector

**Test scenario:**
- In the website open the modal form, in the dropdown box for "Kepler selector", select "Exclude Kepler Scope". 
- Close the form and compare the "total number of exoplanets" displayed in the intro section (stats on our sample) with the "count of pl_name" in the "Data sample" tab of the testing file after applying filtering on 0 "pl_kepflag". 
- Follow the same steps to check the number of exoplanets that are within the Kepler scope. 
- Figures should be consistent and should add up to the total number of exoplanets in the sample. 

Test result: **Successful**

Same test scenario was applied to test the following functions and they were all succesfull. 
- ###### function show_location_selector(ndx) 
- ###### function show_facility_selector(ndx) 
- ###### function show_discovery_selector(ndx) 
- ###### function show_discovery_year_selector(ndx) 
 
#### Sample Satistics

