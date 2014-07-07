ng-gauge
========

A light weight tool to create gauge chart with AngularJs
##![Gauge Charts](https://raw.githubusercontent.com/vthinkxie/ng-gauge/master/example/example.png "Gauge Charts")

## Basic Quick Start 

    
### 1. Create basic [Angular.js](http://angularjs.org/) application

Create a html page and start with the following code.
```html
<!DOCTYPE html>
<meta charset="utf-8">
<html>
<head>
```

Include the downloaded dependencies in the ```<head>``` section of the html.

```html
<script src="ng-gauge/src/ng-gauge.js"></script>
<link rel="stylesheet" href="ng-gauge/src/ng-gauge.css">
```

### 2. Add ng-gauge to the app.js
for example
```html
angular.module('ng-gauge-example', [
  'ng-gauge'
])
```

### 3. Add ng-gauge in the html
```html
<ng-gauge t-value="{{example.tVal}}" b-value="{{example.bVal}}" t-label="Memory" b-label="HDD" unit="%"></ng-gauge>
```
t-value for the top value t-label for the top label  
same as the b-value and b-label  
unit is used for the value  
**More detail can be found in example file**
