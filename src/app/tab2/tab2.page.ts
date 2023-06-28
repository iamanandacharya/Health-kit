import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  ActivityData,
  CapacitorHealthkit,
  OtherData,
  QueryOutput,
  SampleNames,
  SleepData,
} from '@perfood/capacitor-healthkit';

const READ_PERMISSIONS = ['calories', 'stairs', 'activity', 'steps', 'distance', 'duration', 'weight'];

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  constructor(
    private plt: Platform

  ) {
  }
  ngOnInit(): void {    
    this.requestAuthorization();
  }
  async  requestAuthorization(){
    this.plt.ready().then(() => { 
      try {
        CapacitorHealthkit.requestAuthorization({
          all: [''],
          read: READ_PERMISSIONS,
          write: [''],
        });
        this.getActivityData();
  
      } catch (error) {
        console.error('[HealthKitService] Error getting Authorization:', error);
      }
  
    });
  }

  private async getActivityData() {
    try {
      const queryOptions = {
        sampleName: SampleNames.WORKOUT_TYPE,
        startDate:  new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        limit: 0,
      };
      await alert(CapacitorHealthkit.queryHKitSampleType<ActivityData>(queryOptions))
      return await CapacitorHealthkit.queryHKitSampleType<ActivityData>(queryOptions);
    } catch (error) {
      console.error(error);

      return undefined;
    }
  }

}
