## Disclaimer
This tool is not an official OSIsoft solution.  As such, it will not be supported.  If you have issues, please contact me and I will try my best to help you.

## Background
PI Vision offers a form of Element Relativity but many users, ourselves included, felt that the Element Relative Display from PI ProcessBook had some advantages over its PI Vision counterpart.  With this in mind, we decided to develop a PI Vision toolbar that has features similar to what was available in ProcessBook. 

## Features
- Quickly swap between elements with a single click 
- Elements of Interest persistent across multiple sessions 
- Elements of Interest unique to each display 
- Minimal set-up 
- Robust search to populate list of Elements of Interest

## Asset Picker pane

<img src="https://github.com/osipmartin/PI-Coresight-Custom-Symbols/blob/master/Community%20Samples/CoolTeam/Example.png" />

## Setup (Required)

1. In Windows Explorer, navigate to the "%PIHOME%\PIVision\Scripts\app\editor\tools\ext" on your PI Vision web server; typically, it's located in "C:\Program Files\PIPC\PIVision\Scripts\app\editor\tools\ext".
If this folder doesn't exist, create it.
2. Copy contents of this repository into the above folder.  You may exclude "Example.png" and "README.MD"

## Setup (Optional)

In order to utilize the Elements of Interest unique to each display, an AF database is created to store the configuration strings for each display. The creation of the AF database, elements, and attributes is done automatically once the AF Server has been specified.

The AF Server where the configuration is stored must be specified in the setup.json file located in the %pihome%\PIVision\Scripts\app\editor\Tools\Ext\ folder. With JSON format, such as the below: 
>{
	“AFServer”:"YourAFServerName” 
} 

Where YourAFServerName is replaced with whatever AF Server you’d like to store the configuration in.

<b>Please note</b>: This setup is required for the saving of elements of interest pane feature and is optional. It should not affect the functionality described below. Additionally, this feature requires that the user be able to read from the AF Server when loading pages and write to the AF Server when saving the list in order to update the configuration.

## Procedures 

### Adding Elements to the Elements of Interest Pane 
1. Select a server from the list 
2. Verify the server connection was successful:

<img src="http://imgur.com/ra3xpQG.png" />

3. Specify search parameters: 
    1. <b>Database (required)</b>: Which database should we search for elements in. 
    2. <b>Root Element</b>: Search only for elements below a particular element.  Default value searches entire database.  
    3. <b>Element Name</b>: Search only for elements with a particular name.  Wildcards (*) supported.  Default value is “*” 
    4. <b>Template Name</b>: Search only for elements with a particular template.  Default value is all templates. 
    5. <b>Category Name</b>: Search only for elements in a particular category.  Default value is all categories. 
    6. <b>Add to Existing Results</b>: Should the results of this search be added to the existing elements in the Elements of Interest.
    
### Removing Elements from the Elements of Interest Pane 
1. Click the trash icon next to the element you want to remove from the list. 
2. Display attributes for Element of Interest 
3. Click anywhere on the row for the element you want to view 

## A word about requirements

This symbol uses PI Web API to send data to the PI System.

This means that if you use a self-signed certificate for PI Web API, each client machine needs to install that certificate. 
Here is a video on how to install certificates for PI Web API: https://www.youtube.com/watch?list=PLMcG1Hs2JbcvGH0VCE4o-CjjaUkTiW5_D&v=KvYsF5MMQMU#t=04m18s

And since the PI Web API requests are made from within PI Coresight server, you may (read: definitely will) run into CORS issues.
I found the following video helpful when trying get CORS working without having to throw my server security wide open
 (i.e. without CorsHeaders=\*, CorsMethods=\* and CorsOrigins=*): https://www.youtube.com/watch?v=EyxieRFRPRw&index=10&list=PLMcG1Hs2JbcvGH0VCE4o-CjjaUkTiW5_D

## Quick Demo Video

(This is a video of the slightly older version of the symbol with different styling. Core functionality didn't change.) 
<a href="https://youtu.be/3cOMefteQlE" target="_blank"><img src="http://img.youtube.com/vi/3cOMefteQlE/0.jpg" 
alt="Asset Picker for PIVision" width="500" height="300" border="10" /></a>
