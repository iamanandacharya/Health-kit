import { Component, OnInit } from '@angular/core';
import { HealthKit, HealthKitOptions } from '@awesome-cordova-plugins/health-kit/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  height: any;
  currentHeight = 'No Data';
  stepcount = 'No Data';
  workouts: any[] = [];
  constructor(
    private healthKit: HealthKit,
    private plt: Platform
  ) {
  }
  ngOnInit(): void {
    this.getHeathKitData();
    
  }
  getHeathKitData() {
   this.plt.ready().then(() => {
    this.healthKit.available().then((available) => {
      if(available) {
        var options: HealthKitOptions = {
          readTypes: ['HKQuantityTypeIdentifierHeight', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierDistanceCycling'],
          writeTypes: ['HKQuantityTypeIdentifierHeight', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierActiveEnergyBurned', 'HKQuantityTypeIdentifierDistanceCycling']
        } 
        this.healthKit.requestAuthorization(options).then(_ => {
          this.loadHealthData();
        })
      }
    })
   })  
  }
  // Save a new height
  saveHeight() {
    this.healthKit.saveHeight({ unit: 'cm', amount: this.height }).then(_ => {
      this.height = null;
      this.loadHealthData();
    })
  }
  // Save a new dummy workout
  saveWorkout() {
    let workout = {
      'activityType': 'HKWorkoutActivityTypeCycling',
      'quantityType': 'HKQuantityTypeIdentifierDistanceCycling',
      'startDate': new Date(), // now
      'endDate': null, // not needed when using duration
      'duration': 6000, //in seconds
      'energy': 400, //
      'energyUnit': 'kcal', // J|cal|kcal
      'distance': 5, // optional
      'distanceUnit': 'km'
    }
    this.healthKit.saveWorkout(workout).then(res => {
      this.loadHealthData();
    })
  }
  loadHealthData() {
    this.healthKit.readHeight({ unit: 'cm'}).then(val => {
      this.currentHeight = val.value;
    })

    var stepOptions = {
      startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      sampleType: 'HKQuantityTypeIdentifierStepCount',
      unit: 'count'
    }
    this.healthKit.querySampleType(stepOptions).then(data => {
      let stepSum = data.reduce((a: any, b: any) => a + b.quantity, 0);
      this.stepcount = stepSum;
    }, err => {
      console.log('No steps: ', err);
    });
    
    this.healthKit.findWorkouts().then(data => {
      this.workouts = data;
    }, err => {
      console.log('no workouts: ', err);
      // Sometimes the result comes in here, very strange.
      this.workouts = err;
    })
  }

}
