# mPulse-client
A Node client for the SOSTA mPulse web API

## Why?

Because last we checked, the mPulse web UI had a hard limit of thirty-two days on how much information you can view at once.  That means if you want to look at a year's worth of data, you'll have to change the time frame eleven times.

This client gets past that because it's not limited by the web UI, instead using the SOSTA mPulse API.  Yes, you could use their data science work bench, but you may have to pony up a few extra bucks to do so.  If you're already a SOSTA mPulse user, then you can use their API at no additional cost.  But beware, it's possible for you to make too many requests to the API and be locked out for a month.  So query with care, as this client will make a lot of requests to give you large time spans.

## What does this do?

This will output comma-separated-values files, (.csv), which can be easily analyzed with spreadsheet software like Microsoft Excel.  You can change what folder they output to in configuration.json.

### Excel Macro

See the file [excel-vba/mPulseCsvChartModule.bas](excel-vba/mPulseCsvChartModule.bas) for an Excel macro you can use to quickly chart the data this tool produces.

### Pivot Dates

You can also compare time spans against each other, pivoting around one date.

### Page Group Parameter

On our platform, we had a naming convention for our page groups.  It looks like this: `${storeCode} ${capitalizedPageName} Page`.  Chances are, your setup will differ.  To make this work, you'll probably have to modify [lib/getPageGroupParameter.js](lib/getPageGroupParameter.js).  Don't worry, the code there is pretty simple.

## How?

Clone this repository, then run

    npm install

on the command line from the base folder.  Then see the help message like so

    node main.js --help

(again from the command line).

### storeCode

We use the term "storeCode" to refer to the web site you're querying against because this was originally used to analyze performance for eCommerce web-stores.  You'll need to modify "apiKeys.json" to provide the mapping between the web sites you're interested in, and their respective SOSTA mPulse API keys.

### your SOSTA mPulse login credentials

In configuration.json, there must be an entry named `"credentialsFilePath"`.
It must point to a readable json-format file containing the keys `"userName"` and `"password"`,
which are your SOSTA mPulse userName and password.
In configuration.json, there must be an entry named `"tokenFilePath"`.
It must point to a writable directory and a file name to be placed in that directory.

## Test Coverage

...is not what it could be.  We had to slap this stuff together pretty quickly to analyze our performance gain after a major project went live.  Had we more time and more performance improvement projects coming along, we'd go back and add more test coverage.