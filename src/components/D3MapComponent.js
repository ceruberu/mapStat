'use strict';

import React from 'react';
import * as d3 from 'd3';
require('styles//D3Map.css');

class D3MapComponent extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			query : null
		}
	}


	componentDidMount(){
		let that = this;
		setTimeout(function(){
			that.setState({query:'asd'})
		}, 3000)
		var width = 1000;
		var height = 800;
		var rectScale = 6;
		var scale = 12 << 13;``
		// var scaleExtent = [1 << 10, 1 << 30]
		var center = [126.978, 37.6265];

		var canvas = d3.select('.mapComponent').append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('id', 'd3');

		d3.json('../data/Seoul.json', function(data){

			var group = canvas.selectAll('g')
	            .data(data.geometries)
	            .enter()
	            .append('g')
	            .attr('class',function(d){ return d.name})
	            .on('click', function(d){ console.log(d.name)
	            	            
		        });

	        var projection = d3.geoMercator().center(center).scale(scale);
	        var path = d3.geoPath(projection);
	        var areas= group.append('path')
	            .attr('d', path)
	            .attr('fill', 'white')
	            .attr('stroke', 'blue')
	            .attr('stroke-width', '2');
		})

		d3.select('#d3').append('g').attr('id','d3g')
			.attr('x',width-width/rectScale-30)
				.attr('y',height-height/rectScale-30)
				.attr('width', width/rectScale)
				.attr('height', height/rectScale)
			.append('rect')
				.attr('x',width-width/rectScale-30)
				.attr('y',height-height/rectScale-30)
				.attr('width', width/rectScale)
				.attr('height', height/rectScale)
				.attr('fill', 'white')
				.attr('rx',15)
				.attr('ry',15)

		var population = d3.select('#d3g')
				.append('text').text('Population')
				.attr('x',(width-width/rectScale)+40)
				.attr('y',(height-height/rectScale))
				.attr('fill','blue')
				.attr('font-size', 20)
				.attr('font-family', 'Verdana')
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'central')
				.attr('id','population')
		population.on('click',function(){
			if(that.state.query !== 'population' ){
				that.setState({
					query: 'population'
				})
			} else {
				that.setState({
					query: null
				})
			}
			
		})

	}

	render() {
		if(this.state.query === 'population'){
			let sizeStat = new Promise(function(resolve,reject){
				d3.json('../data/size.json', function(err, json){
					if(err) reject(err);
					resolve(json);
				})
			})
			let popuStat = new Promise(function(resolve,reject){
				d3.json('../data/popu.json', function(err, json){
					if(err) reject(err);
					resolve(json);
				})
			})
			Promise.all([sizeStat,popuStat]).then(function(results){
				let obj = {};
				results[0].forEach(function(item){
					obj[item['자치구']] = {size: item['면적']} 
				})
				let max = Number.NEGATIVE_INFINITY;
				let min = Number.POSITIVE_INFINITY;
				results[1].forEach(function(item){
					let pop = Math.floor(item['세대당인구']*100 * item['세대']);
					obj[item['자치구']].population = pop;
					obj[item['자치구']].density = pop/obj[item['자치구']].size;
					max = max > obj[item['자치구']].density ? max : obj[item['자치구']].density
					min = min < obj[item['자치구']].density ? min : obj[item['자치구']].density
				})

				var colorScale = d3.scaleLinear().domain([min,max]).range(['white','#4169e1']);
				let selection = d3.select('#d3').selectAll('g')
				selection.data(obj, function(d){ 
					d.data = obj[d.name]
					return d;})

					selection.selectAll('path')
						.transition()
							.duration(1500)
						.attr('fill', function(d){
							return colorScale(d.data.density);
						})
				var div;
					selection
						.on("mouseover", function(q,w,e){
						// console.log(q,w,e[0].nextElementSibling)
						div = d3.select('body')
						.append('div')
						.style("position", "absolute")
						.style("width", "200px")
						.style("height", "200px")
						.style("visibility", "hidden")
					    // .style("z-index", "10")
					    // .style("background-color","red")
					    // .style("visibility", "hidden")
					    .text(function(){
					    	return Math.round(parseInt(q.data.density))
					    })
						
						div
							// .transition()
			 				// .duration(200)		
			                .style("opacity", .9)	
			                .style("visibility", "visible")		
			                .style("left", (d3.event.pageX) + "px")		
			                .style("top", (d3.event.pageY - 28) + "px");
						// .style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px")
						// return tooltip.style("visibility", "visible");
					})
						.on("mousemove", function(q,w,e){
							if(div){
								div.style("top",(d3.event.pageY-10)+"px")
								   .style("left",(d3.event.pageX+10)+"px")
							}
						// div.
							// console.log(q,w,e)
							// e[0].nextElementSibling.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
						})
						.on("mouseout", function(){
							if(div){
								div.style("visibility","hidden")
							}
							// return tooltip.style("visibility", "hidden");
					});

			})
		} else if (this.state.query === null){
			d3.select('#d3').selectAll('g').selectAll('path').attr('fill','white')
		}
		
		return (
			  <div className='mapComponent'>
				
			  </div>
		);
	}
}

D3MapComponent.displayName = 'D3MapComponent';

// Uncomment properties you need
// D3MapComponent.propTypes = {};
// D3MapComponent.defaultProps = {};

export default D3MapComponent;
