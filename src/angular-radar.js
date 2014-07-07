(function() {
    'use strict';  angular.module('angular-radar', []).directive('radarChart', function () {
        return {
            restrict: 'E', 
            scope: { 
                max:'=',
                val: '=',
                size:'=',
                levels: '=',
                colorFunction: '='
            },
            link: function (scope, element, attrs) {

                var config = {
                     size:scope.size||600,
                     factor: .7,
                     factorLegend: .85,
                     levels: 3,
                     maxValue: scope.max || 0,
                     radians: 2 * Math.PI,
                     opacityArea: 0.6,
                     color: scope.colorFunction || d3.scale.category10(),
                     fontSize: 16
                };                  

                scope.render = function(data){

                    config.maxValue = Math.max(config.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
                    var allAxis = (data[0].map(function(i){return i.axis}));
                    var total = allAxis.length;
                    var radius = config.factor*config.size/2;
                    function getPosition(i, range, factor, func){
                        factor = typeof factor !== 'undefined' ? factor : 1;
                        return range * (1 - factor * func(i * config.radians / total));
                    }
                    function getHorizontalPosition(i, range, factor){               
                        return getPosition(i, range, factor, Math.sin);
                    }
                    function getVerticalPosition(i, range, factor){                     
                        return getPosition(i, range, factor, Math.cos);
                    }                        

                    d3.select(element[0]).select("svg").remove();
                    var gRadar = d3.select(element[0]).append("svg").attr("width", config.size).attr("height", config.size).append("g");       

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
                             drawBasic.attr("class", "line").style("stroke", "#555").attr("transform", "translate(" + (config.size/2-levelFactor) + ", " + (config.size/2-levelFactor) + ")");        
                          }
                          else{
                             drawBasic.attr("class", "line").style("stroke", "#555").style("stroke-dasharray", ("3, 3")).attr("transform", "translate(" + (config.size/2-levelFactor) + ", " + (config.size/2-levelFactor) + ")");
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
                            .attr("x", function(d, i){return getHorizontalPosition(i, config.size / 2, config.factorLegend);})
                            .attr("y", function(d, i){return getVerticalPosition(i, config.size / 2, config.factorLegend);});

                        /*Draw Area*/
                        var series = 0;    
                        data.forEach(function(y, x){
                          var dataValues = [];
                          gRadar.selectAll(".nodes")
                            .data(y, function(j, i){
                              dataValues.push([
                                getHorizontalPosition(i, config.size/2, (parseFloat(Math.max(j.value, 0))/config.maxValue)*config.factor),
                                getVerticalPosition(i, config.size/2, (parseFloat(Math.max(j.value, 0))/config.maxValue)*config.factor)
                              ]);
                            });
                          dataValues.push(dataValues[0]);
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
                        gRadar.append("text").attr("class", "legend").text("Less than 3 elements").attr("transform", "translate(" + (config.size/2) + ", " + (config.size/2) + ")").style('text-anchor', 'middle');
                    }   
                }

                scope.$watch('val', function(){
                  scope.render(scope.val);
                }, true);   
      
            }
        };
    });
}).call(this);