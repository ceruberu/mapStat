'use strict';

import React from 'react';
import topojson from 'topojson';
import { Map } from 'react-d3-map';
import { Polygon } from 'react-d3-map-core';
// import Seoul from 'json!../data/Seoul.json';
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
		var scaleExtent = [1 << 10, 1 << 30]
		var center = [126.978, 37.6265];

		var canvas = d3.select(".mapComponent").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "d3");

		d3.json("../data/Seoul.json", function(data){
			        var area = 1;

			var group = canvas.selectAll("g")
	            .data(data.geometries)
	            .enter()
	            .append("g")
	            .attr("class",function(d){ return d.name})
	            .on("click", function(d){ console.log(d.name)});

	        var projection = d3.geoMercator().center(center).scale(scale);
	        var path = d3.geoPath(projection);
	        var areas = group.append("path")
	            .attr("d", path)
	            .attr("fill", "white")
	            .attr("stroke", "blue")
	            .attr("stroke-width", "2");
		})

		d3.select("#d3").append("g").attr("id","d3g")
			.attr("x",width-width/rectScale-30)
				.attr("y",height-height/rectScale-30)
				.attr("width", width/rectScale)
				.attr("height", height/rectScale)
			.append("rect")
				.attr("x",width-width/rectScale-30)
				.attr("y",height-height/rectScale-30)
				.attr("width", width/rectScale)
				.attr("height", height/rectScale)
				.attr("fill", "white")
				.attr("rx",15)
				.attr("ry",15)

		var population = d3.select('#d3g')
				.append("text").text("Population")
				.attr("x",(width-width/rectScale)+40)
				.attr("y",(height-height/rectScale))
				.attr("fill","blue")
				.attr("font-size", 20)
				.attr("font-family", "Verdana")
				.attr("text-anchor", "middle")
				.attr("alignment-baseline", "central")
				.attr("id","population")
		population.on("click",function(){
			that.setState({
				query: 'population'
			})
		})
	}

	render() {
		if(this.state.query === "population"){
			let sizeStat = new Promise(function(resolve,reject){
				d3.json("../data/size.json", function(json){
					resolve(json);
				})
			})
			let popuStat = new Promise(function(resolve,reject){
				d3.json("../data/popu.json", function(json){
					resolve(json);
				})
			})
			Promise.all([sizeStat,popuStat]).then(function(results){
				let obj = {};
				results[0].forEach(function(item){
					obj[item["자치구"]] = {size: item["면적"]} 
				})
				let max = Number.NEGATIVE_INFINITY;
				let min = Number.POSITIVE_INFINITY;
				results[1].forEach(function(item){
					let pop = Math.floor(item["세대당인구"]*100 * item["세대"]);
					obj[item["자치구"]].population = pop;
					obj[item["자치구"]].density = pop/obj[item["자치구"]].size;
					max = max > obj[item["자치구"]].density ? max : obj[item["자치구"]].density
					min = min < obj[item["자치구"]].density ? min : obj[item["자치구"]].density
				})

				var colorScale = d3.scaleLinear().domain([min,max]).range(["white","#4169e1"]);
				console.log(colorScale)
				let selection = d3.select('#d3').selectAll('g')
				selection.data(obj, function(d){ 
					console.log(d);
					d.data = obj[d.name]
					return d;})

					selection.selectAll('path').attr("fill", function(d){
						console.log(d,d.data.density)
						return colorScale(d.data.density);
					})

				console.log('selection:',selection)
			})


		}
		
		return (
			  <div className="mapComponent">
				
			  </div>
		);
	}
}

D3MapComponent.displayName = 'D3MapComponent';

// Uncomment properties you need
// D3MapComponent.propTypes = {};
// D3MapComponent.defaultProps = {};

export default D3MapComponent;
