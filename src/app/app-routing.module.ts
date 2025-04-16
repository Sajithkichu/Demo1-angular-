import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitalBookingComponent } from './hospital-booking/hospital-booking.component';

const routes: Routes = [
  { path: '', component: HospitalBookingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
