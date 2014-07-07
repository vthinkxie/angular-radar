(function() {
    'use strict';  angular.module('angular-radar', []).directive('radarChart', function () {
        return {
            restrict: 'E', 
            scope: { 
                maxValue:'=',
                val: '=',
                width:'=',
                height:'=',
                levels: '=',
                rotate: '=',
                chartScale: '=',
                legendScale: '=',
                colorFunction: '=',
                radians:'=',
                opacityArea:'=',
                fontSize:'=',
                tips:'@'
            },
            link: function (scope, element, attrs) {
                var colorFunction = function(i) {
                    var colorArray = ['#a00041','#d73c4c','#f66d3a','#ffaf59','#ffe185','#ffffbc','#e6f693','#aadea2','#62c3a5','#2c87bf','#5e4ca4'];
                    return colorArray[i];
                }
                var config = {
                     width:scope.width||element[0].parentElement.offsetWidth,
                     height:scope.height||element[0].parentElement.offsetHeight,
                     chartScale: scope.chartScale || 0.7,
                     legendScale: scope.legendScale||0.85,
                     levels: scope.levels||3,
                     maxValue: scope.maxValue || 0,
                     radians: scope.radians||2 * Math.PI,
                     rotate: scope.rotate*Math.PI||0 * Math.PI,
                     opacityArea: scope.opacityArea||0.6,
                     color: scope.colorFunction || colorFunction,
                     fontSize: scope.fontSize||14,
                     tips: scope.tips||"Less than 3 elements"
                };                  

                scope.render = function(data){
                    config.size = Math.min(config.width,config.height);
                    config.widthShift = (config.size - config.width)/2;
                    config.heightShift = (config.size - config.height)/2;
                    config.maxValue = Math.max(config.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
                    var allAxis = (data[0].map(function(i){return i.axis}));
                    var total = allAxis.length;
                    var radius = config.chartScale*config.size/2;
                    function getPosition(i, range, chartScale, func){
                        chartScale = chartScale || 1;
                        return range * (1 - chartScale * func(i * config.radians / total+config.rotate));
                    }
                    function getHorizontalPosition(i, range, chartScale){               
                        return getPosition(i, range, chartScale, Math.sin);
                    }
                    function getVerticalPosition(i, range, chartScale){                     
                        return getPosition(i, range, chartScale, Math.cos);
                    }                        

                    d3.select(element[0]).select("svg").remove();
                    var gRadar = d3.select(element[0]).append("svg").attr("width", config.width).attr("height", config.height).append("g");       

                    if(total>2){    

                         /*Draw Outer Line*/
                        for(var j=0; j<config.levels; j++){
                          var levelFactor = radius*((j+1)/config.levels);
                          var drawBasic = gRadar.selectAll(".levels").data(allAxis).enter().append("svg:line")
                             .attr("x1", function(d, i){return getHorizontalPosition(i, levelFactor);})
                             .attr("y1", function(d, i){return getVerticalPosition(i, levelFactor);})
                             .attr("x2", function(d, i){return getHorizontalPosition(i+1, levelFactor);})
                             .attr("y2", function(d, i){return getVerticalPosition(i+1, levelFactor);});
                          if(j===config.levels-1){
                             drawBasic.attr("class", "line").style("stroke", "#555").attr("transform", "translate(" + (config.size/2-levelFactor-config.widthShift) + ", " + (config.size/2-levelFactor-config.heightShift) + ")");        
                          }
                          else{
                             drawBasic.attr("class", "line").style("stroke", "#555").style("stroke-dasharray", ("3, 3")).attr("transform", "translate(" + (config.size/2-levelFactor-config.widthShift) + ", " + (config.size/2-levelFactor-config.heightShift) + ")");
                          }
                        }

                        /*Draw Text*/
                        var axis = gRadar.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");
                        axis.append("text").attr("class", "legend")
                            .text(function(d){return d})
                            .style("font-family", "Verdana").style("font-size", config.fontSize + "px")
                            .style("text-anchor", "middle")        
                            .attr("transform", function(d, i){
                              var p = getVerticalPosition(i, config.size / 2);
                              return p < config.fontSize ? "translate(0, " + (config.fontSize - p) + ")" : "";
                            })
                            .attr("x", function(d, i){return getHorizontalPosition(i, config.size / 2, config.legendScale);}).attr("transform", "translate(" + (-config.widthShift) + ", " + (-config.heightShift) + ")")
                            .attr("y", function(d, i){return getVerticalPosition(i, config.size / 2, config.legendScale);}).attr("transform", "translate(" + (-config.widthShift) + ", " + (-config.heightShift) + ")");

                        /*Draw Area*/
                        var series = 0;    
                        data.forEach(function(element, index){
                          var dataValues = [];
                          element.forEach(function(element, index){
                              dataValues.push([
                                getHorizontalPosition(index, config.size/2, (parseFloat(Math.max(element.value, 0))/config.maxValue)*config.chartScale),
                                getVerticalPosition(index, config.size/2, (parseFloat(Math.max(element.value, 0))/config.maxValue)*config.chartScale)
                              ]);
                            });
                          // dataValues.push(dataValues[0]);
                          // console.log(dataValues);
                          gRadar.selectAll(".area")
                             .data([dataValues])
                             .enter()
                             .append("polygon")
                             .attr("class", "radar-chart-serie"+series)
                             .attr("points",function(d) {
                                 var str="";
                                 for(var pti=0;pti<d.length;pti++){
                                     str=str+d[pti][0]+","+d[pti][1]+" ";
                                 }
                                 return str;
                              })
                             .style("fill", function(j, i){return config.color(series)})
                             .style("fill-opacity", config.opacityArea)
                             .attr("transform", "translate(" + (-config.widthShift) + ", " + (-config.heightShift) + ")")
                             .on('mouseover', function (d){
                                                var z = "polygon."+d3.select(this).attr("class");
                                                gRadar.selectAll("polygon").transition(200).style("fill-opacity", 0.1); 
                                                gRadar.selectAll(z).transition(200).style("fill-opacity", .7);
                                              })
                             .on('mouseout', function(){
                                                gRadar.selectAll("polygon").transition(200).style("fill-opacity", config.opacityArea);
                             });
                          series++;
                        });                              
                    }    
                    else{
                        gRadar.append("text").attr("class", "legend").text(config.tips)
                        .style("font-family", "Verdana").style("font-size", config.fontSize + "px")
                        .style("text-anchor", "middle")
                        .attr("transform", "translate(" + (config.size/2-config.widthShift) + ", " + (config.size/2-config.heightShift) + ")");
                    }   
                }
                
                scope.$watch('val', function(){
                  scope.render(scope.val);
                }, true);   
      
            }
        };
    });
}).call(this);