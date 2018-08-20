import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
canvas: any; 
ctx;//Canvas Rendering Context 2D


height = 300;
width = 300;
data = [
  [10, 20],
  [12, 11],
  [23, 44],
  [15, 35],
  [52, 25],
  [63, 16],
  [11, 61],

  [71, 36],
  [86, 26],
  [16, 14],
  [17, 14],
  [18, 11],
  [19, 23],

  [10, 82],
  [29, 10],
  [27, 28],
  [27, 9],
  [82, 11],
  [92, 49],
];

means = [];
assignments = [];
dataExtremes;
dataRange;
drawDelay = 2000;
disEnd: string = "Clustering";


  constructor(public navCtrl: NavController) {

  }

  setup() {

   
    this.disEnd = 'Running';

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    
  
    this.dataExtremes = this.getDataExtremes(this.data);
    this.dataRange = this.getDataRanges(this.dataExtremes);
    this.means = this.initMeans(2);
  
    this.makeAssignments();
    this.draw();
    
    this.run();
  
    //setTimeout(this.run, this.drawDelay);  // Quan comment

    //this.disEnd = 'Finish';
  }
  
  getDataRanges(extremes) {
    var ranges = [];
  
    for (var dimension in extremes) {
      ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
    }
  
    return ranges;
  
  }
  
  getDataExtremes(points) {
  
    var extremes = [];
  
    for (var i in this.data) {
      var point = this.data[i];
  
      for (var dimension in point) {
        if (!extremes[dimension]) {
          extremes[dimension] = {
            min: 1000,
            max: 0
          };
        }
  
        if (point[dimension] < extremes[dimension].min) {
          extremes[dimension].min = point[dimension];
        }
  
        if (point[dimension] > extremes[dimension].max) {
          extremes[dimension].max = point[dimension];
        }
      }
    }
  
    return extremes;
  
  }
  
  initMeans(k) {
    this.means = [];
  
    if (!k) {
      k = 2;
    }
  
    while (k--) {
      var mean = [];
  
      for (var dimension in this.dataExtremes) {
        mean[dimension] = this.dataExtremes[dimension].min + (Math.random() * this.dataRange[dimension]);
      }
  
      this.means.push(mean);
    }
  
    return this.means;
  
  };
  
  makeAssignments() {

    
     
    for (var i in this.data) {
      var point = this.data[i];
      var distances = [];
     // console.log("Assigment");
     // console.log(i);
     // console.log(this.data[i]);
  
      for (var j in this.means) {
        var mean = this.means[j];
        var sum = 0;
  
        for (var dimension in point) {
          var difference = point[dimension] - mean[dimension];
          difference *= difference;
          sum += difference;
        }
  
        distances[j] = Math.sqrt(sum);
      }
  
      this.assignments[i] = distances.indexOf(Math.min.apply(null, distances));
      console.log("cluster", i, this.assignments[i]);
    }
  
  }
  
  moveMeans(): Boolean {
    var moved =true;

    console.log("MoveMean");
  
    this.makeAssignments();
  
    var sums = Array(this.means.length);
    var counts = Array(this.means.length);
    var moved = false;
  
    for (var j in this.means) {
      counts[j] = 0;
      sums[j] = Array(this.means[j].length);
      for (var dimension in this.means[j]) {
        sums[j][dimension] = 0;
      }
    }
  
    for (var point_index in this.assignments) {
      let mean_index = this.assignments[point_index];
      var point = this.data[point_index];
      var mean = this.means[mean_index];
  
      counts[mean_index]++;
  
      for (var dimension in mean) {
        sums[mean_index][dimension] += point[dimension];
      }
    }
  
    for (var mean_index in sums) {
      console.log(counts[mean_index]);
      if (0 === counts[mean_index]) {
        sums[mean_index] = this.means[mean_index];
        console.log("Mean with no points");
        console.log(sums[mean_index]);
  
        for (var dimension in this.dataExtremes) {
          sums[mean_index][dimension] = this.dataExtremes[dimension].min + (Math.random() * this.dataRange[dimension]);
        }
        continue;
      }
  
      for (var dimension in sums[mean_index]) {
        sums[mean_index][dimension] /= counts[mean_index];
      }
    }
  
    if (this.means.toString() !== sums.toString()) {
      moved = true;
    }
  
    this.means = sums;
  
    return moved;
  
  }
  
 run() { setTimeout(()=>{
  console.log("Run");
  
  var moved = this.moveMeans();
  //let moved = true;

  console.log(moved);
  this.draw();

  if (moved) {
  //   setTimeout(this.run, this.drawDelay);
  this.run();
  console.log("o here");
  
  }
  else {
    this.disEnd = 'Finished - Click for Clustering Again';
  }
  

 }, this.drawDelay)
  
 
  }
  
  draw() {
  
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.globalAlpha = 1;


    for (var point_index in this.assignments) {
      var mean_index = this.assignments[point_index];
      var point = this.data[point_index];
      var mean = this.means[mean_index];
  
      this.ctx.save();
  
      this.ctx.strokeStyle = 'blue';
      this.ctx.beginPath();
      this.ctx.moveTo(
        (point[0] - this.dataExtremes[0].min + 1) * (this.width / (this.dataRange[0] + 2)),
        (point[1] - this.dataExtremes[1].min + 1) * (this.height / (this.dataRange[1] + 2))
      );
      this.ctx.lineTo(
        (mean[0] - this.dataExtremes[0].min + 1) * (this.width / (this.dataRange[0] + 2)),
        (mean[1] - this.dataExtremes[1].min + 1) * (this.height / (this.dataRange[1] + 2))
      );
      this.ctx.stroke();
      this.ctx.closePath();
  
      this.ctx.restore();
    }
    this.ctx.globalAlpha = 1;
  
    for (var i in this.data) {
      this.ctx.save();
  
      var point = this.data[i];
  
      var x = (point[0] - this.dataExtremes[0].min + 1) * (this.width / (this.dataRange[0] + 2));
      var y = (point[1] - this.dataExtremes[1].min + 1) * (this.height / (this.dataRange[1] + 2));
  
      this.ctx.strokeStyle = '#333333';
      this.ctx.translate(x, y);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
      this.ctx.stroke();
      this.ctx.closePath();
  
      this.ctx.restore();
    }
  
    for (var i in this.means) {
      this.ctx.save();
  
      let point = this.means[i];
  
      var x = (point[0] - this.dataExtremes[0].min + 1) * (this.width / (this.dataRange[0] + 2));
      var y = (point[1] - this.dataExtremes[1].min + 1) * (this.height / (this.dataRange[1] + 2));
  
      this.ctx.fillStyle = 'green';
      this.ctx.translate(x, y);
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 5, 0, Math.PI * 2, true);
      this.ctx.fill();
      this.ctx.closePath();
  
      this.ctx.restore();
  
    }
  
  }
  
   

}
