import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  login_flack: boolean = false;
 

  constructor(private router: Router, private user_service: UsersService, private http: HttpClient){}

    ngOnInit() {
    
    }

  login_page(){
    this.login_flack = true;
  }

  front_page(){
    this.login_flack = false;
  }

  login_to_flack(data:any){
    console.log(data  )
    this.user_service.check_email_id(data.email_id).subscribe((result) => {
      console.log(result)
      if (Array.isArray(result) && result.length > 0){
        const user = result[0];
        localStorage.setItem('login_user', JSON.stringify(user))
       this.router.navigate(['/chatPage'])
      }
    })
    
  }

  



}
