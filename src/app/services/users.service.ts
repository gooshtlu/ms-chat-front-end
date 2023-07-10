import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements OnInit{

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    
  }

  check_email_id(email_id: any){
   return this.http.get(`http://localhost:8080/check_email/${(email_id)}`);
  }

  user_chat_history(login_user_id: any){
    return this.http.get(`http://localhost:8080/flack-chat/${login_user_id}`);
  }

  get_user_by_uuid(to_user_id: any){
    return this.http.get(`http://localhost:8080/get-user-by-id/${to_user_id}`);
  }

  get_user_by_name(username: any){
    return this.http.get(`http://localhost:8080/get-user-by-name/${username}`)
  }

  get_particular_user_chat(from_uuid: any, to_uuid: any){
    return this.http.get(`http://localhost:8080/particular-user-chat/${from_uuid}/${to_uuid}`)
  }

  get_flack_group_names(){
    return this.http.get(`http://localhost:8080/all-groups`)
  }

  get_flack_group_messages(group_name: any){
    return this.http.get(`http://localhost:8080/group-messages/${group_name}`)
  }

  send_direct_messages(data: any, from_user_uuid: any, to_user_uuid: any, chat_id?: any) {
    let url = `http://localhost:8080/users-chat/${from_user_uuid}/${to_user_uuid}`;
  
    if (chat_id) {
      url += `/${chat_id}`;
    }
  
    return this.http.post(url, data);
  }

  update_chat_messages(chat_user_uuid: any, data: any){
    console.log(chat_user_uuid)
    return this.http.put(`http://localhost:8080/update-chat/${chat_user_uuid}`, data);
  }

  send_group_messages(group_id: any, data: any){
    return this.http.post(`http://localhost:8080/send-group-messages/${group_id}`, data);
  }

  get_all_users(){
    return this.http.get(`http://localhost:8080/get-all-users`);
  }

  add_user_to_group(group_id:any, data:any){
    return this.http.post(`http://localhost:8080/add-user-to-group/${group_id}`, data)
  }

  change_users_permissions_in_group(group_id:any, data:any){
    return this.http.post(`http://localhost:8080/change-role/${group_id}`, data)
  }
 
}
