import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { FlackPageComponent } from './flack-page/flack-page.component';

const routes: Routes = [
  {path: '', redirectTo: 'flack', pathMatch: 'full'},
  {path: 'flack', component: HomePageComponent},
  {path: 'chatPage', component: ChatPageComponent},
  {path: 'flackPage', component: FlackPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
