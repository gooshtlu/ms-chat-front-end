import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class ChatPageComponent implements OnInit {

  login_user_name: any;
  login_user_id: any;
  user_name: any;
  chat_users_names: any[] = [];
  to_user_uuid: any;
  from_user_uuid: any;
  message_contents: any[] = [];
  created_dates: string[] = [];
  username: any[] = [];
  group_names: any[] = [];
  group_messges_keys: any[] = [];
  group_message_sender_name: any[] = [];
  group_chat_history: any;
  message_content: string = '';
  particular_chat_id: any;
  some_data: any;
  login_user_email_id: any;
  group_reader_name: any[] = [];
  display_message_input: boolean = true;
  sent_user_messages_boolean: boolean = false;
  sent_group_messages_boolean: boolean = false;
  group_id: any;
  search_name: any;
  user_names: any[] = [];
  names: any[] = [];
  search_user_names: any[] = [];
  show_search_users: boolean = false;
  show_chat_div: boolean = true;
  show_names_div: boolean = true;
  visible: boolean = true;
  admins_list: any[] = [];
  manegers_list: any[] = [];
  writers_list: any[] = [];
  readers_list: any[] = [];
  permission_dialog_boolean: boolean = false;
  add_user_dialog_boolean: boolean = false;
  change_permissions_boolean: boolean = false;
  roles: any[] = [];
  current_role: any;
  filetered_roles: any[] = [];
  current_user: any;
  login_user_role: any;
  messages: Message[] | undefined;
  group_result: any[] = [];


  constructor(private user_service: UsersService, private router: Router, private messageService: MessageService) {
    this.updatePageVisibility(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updatePageVisibility(event.target.innerWidth); // Update page visibility on window resize
  }

  ngOnInit(): void {
    this.login_user_name = localStorage.getItem('login_user');
    this.login_user_name = this.login_user_name && JSON.parse(this.login_user_name);
    this.user_name = this.login_user_name.username;
    this.login_user_id = this.login_user_name._id;
    this.from_user_uuid = this.login_user_name._id;
    this.login_user_email_id = this.login_user_name.email_id;
    this.user_chat_history(this.login_user_id);
    this.display_flack_group_names();
    this.get_all_users();
  }

  updatePageVisibility(screenWidth: number) {
    if (screenWidth < 768) {
      this.router.navigate(['/flackPage']);
    }
    else {
      this.router.navigate(['/chatPage'])
    }
  }

  user_chat_history(login_user_id: any) {
    this.user_service.user_chat_history(login_user_id).subscribe((result) => {
      if (Array.isArray(result)) {
        for (let item of result) {
          let names = [item.to_user_uuid, item.from_user_uuid];
          for (let user of names) {
            this.user_service.get_user_by_uuid(user).subscribe((userResult: any) => {
              if (userResult[0].username != this.user_name) {
                this.chat_users_names.push(userResult[0].username)
              }
            });
          }

        }
      }

    });
  }

  display_user_messages(item: any) {
    this.sent_user_messages_boolean = true;
    this.sent_group_messages_boolean = false;
    this.user_name = item;
    this.some_data = item;
    this.user_service.get_user_by_name(item).subscribe((result: any) => {
      this.to_user_uuid = result[0]._id;
      this.user_service.get_particular_user_chat(this.from_user_uuid, this.to_user_uuid).subscribe((result: any) => {
        let messages = result;
        this.particular_chat_id = result;
        for (const data of messages) {
          const chatHistory = data.chat_history;
          this.message_contents = [];
          for (let chat_keys of Object.keys(chatHistory)) {
            const key = chatHistory[chat_keys];
            this.message_contents.push(key);
          }

        }
        for (let message_key of this.message_contents) {
          this.user_service.get_user_by_uuid(message_key.from_user_uuid).subscribe((result: any) => {
            message_key['username'] = result[0].username;
          });
        }

      });

    });
  }



  send_direct_messages() {
    const from_user_uuid = this.login_user_id;
    const to_user_uuid = this.to_user_uuid;
    const message_content = this.message_content;
    const created_date = new Date();

    let user_chat_schema: any = {
      to_user_uuid: to_user_uuid,
      user_id: from_user_uuid,
      from_user_uuid: from_user_uuid,
      message_content: message_content,
      created_date: created_date
    };

    const send_messages = {
      to_user_uuid: to_user_uuid,
      from_user_uuid: from_user_uuid,
      chat_history: {}
    };

    if (this.particular_chat_id[0]._id) {
      this.user_service.update_chat_messages(this.particular_chat_id[0]._id, user_chat_schema)
        .subscribe(
          (result) => {
            this.display_user_messages(this.some_data);
          },
          (error) => {
            console.error('Update chat messages error:', error);
          }
        );
    } else {
      console.log("No communication has happened");
      this.user_service.send_direct_messages(from_user_uuid, to_user_uuid, send_messages)
        .subscribe(
          (result) => {
            console.log(result);
          },
          (error) => {
            console.error('Send direct messages error:', error);
          }
        );
    }

    this.message_content = '';
  }

  display_flack_group_names() {
    this.user_service.get_flack_group_names().subscribe((result: any) => {
      let data = result;
      for (const item of data) {
        this.group_names.push(item.group_name);
      }
    });
  }

  send_messages() {
    if (this.sent_user_messages_boolean) {
      this.send_direct_messages();
    }
    if (this.sent_group_messages_boolean) {
      this.send_group_messages(this.group_id);
    }

  }

  display_all_group_messages(item: any) {
    this.sent_user_messages_boolean = false;
    this.sent_group_messages_boolean = true;
    this.user_name = item;
    this.user_service.get_flack_group_messages(item).subscribe((result: any) => {
      this.group_result = result;
      this.admins_list = result[0].admins;
      this.manegers_list = result[0].managers;
      this.writers_list = result[0].writers;
      this.readers_list = result[0].readers;

      this.group_reader_name = (result[0].readers);
      this.group_id = result[0]._id;

      for (let item of this.group_reader_name) {
        if (item == this.login_user_email_id) {
          this.display_message_input = false;
        }
      }
      for (let data of result) {
        const history = result[0].chat_history;
        this.message_contents = [];
        for (let chat_keys of Object.keys(history)) {
          const key = history[chat_keys];
          this.message_contents.push(key);
        }
      }

      for (let message_key of this.message_contents) {
        console.log()
        this.user_service.check_email_id(message_key.from_email_id).subscribe((result: any) => {
          message_key['username'] = result[0].username;
        });
      }

    });
  }


  generateUniqueId(): string {
    const timestamp = Date.now().toString(36); // Use timestamp as part of the ID
    const randomChars = Math.random().toString(36).substr(2, 9); // Generate random characters
    return `${timestamp}-${randomChars}`; // Combine timestamp and random characters
  }


  send_group_messages(to_user_id: any) {
    let group_chat_schema = {
      from_email_id: this.login_user_email_id,
      message_content: this.message_content,
      created_date: new Date()
    }

    this.user_service.send_group_messages(to_user_id, group_chat_schema).subscribe((result) => {
      this.display_all_group_messages(this.user_name)
      console.log(this.user_name)
    });

    this.message_content = '';

  }

  get_all_users() {
    this.user_service.get_all_users().subscribe((result: any) => {
      this.user_names = result;
    });
  }

  search_user_name() {
    this.show_search_users = true;
    let lower_search_name = this.search_name.toLowerCase();

    this.names = this.user_names.filter((item) => {
      return item.username && item.username.toLowerCase().includes(lower_search_name);
    });
    this.search_user_names = this.names.map((item) => item.username);
    if (lower_search_name === '') {
      this.search_user_names = [];
      this.show_search_users = false;
    }
  }

  display_permission_dialog_box() {
    if (this.sent_group_messages_boolean) {
      this.permission_dialog_boolean = true;
    }
  }

  add_user() {
    this.add_user_dialog_boolean = true;
    this.permission_dialog_boolean = false;
  }

  change_permissions(data: any) {
    this.current_user = data;
    this.add_user_dialog_boolean = false;
    this.change_permissions_boolean = true;
    this.permission_dialog_boolean = false;

    if (this.admins_list.includes(data)) {
      this.current_role = "admin";
    }
    else if (this.manegers_list.includes(data)) {
      this.current_role = "manager"
    }
    else if (this.writers_list.includes(data)) {
      this.current_role = "writer";
    }
    else if (this.readers_list.includes(data)) {
      this.current_role = "reader"
    }

    this.roles = ["admin", "manager", "writer", "reader"];

    this.roles.filter((role) => {
      if (role != this.current_role) {
        this.filetered_roles.push(role);
      }
      else {
        this.current_role = role;
      }
    });

    if (this.admins_list.includes(this.login_user_email_id)) {
      console.log("admin");
      this.login_user_role = "admin"
    }
    else if (this.manegers_list.includes(this.login_user_email_id)) {
      console.log("manager")
      this.login_user_role = "manager"
    }
    else if (this.writers_list.includes(this.login_user_email_id)) {
      console.log("writer")
      this.login_user_role = "writer"
    }
    else if (this.readers_list.includes(this.login_user_email_id)) {
      console.log("reader")
      this.login_user_role = "reader"
    }
  }

  change_user_permission(data: any) {
    let change_user = {
      user: this.login_user_email_id,
      change_user_role: this.current_user,
      role: data
    }
    if (this.login_user_role === "admin") {
      this.user_service.change_users_permissions_in_group(this.group_id, change_user).subscribe((result) => {
        console.log(result)
      }, (error) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
      });
    }
    else if (this.login_user_role === "manager" && this.current_role != "admin") {
      this.user_service.change_users_permissions_in_group(this.group_id, change_user).subscribe((result) => {
        console.log(result)
      }, (error) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
      });
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'Success', detail: 'Message Content' });
      console.log("You don't have to access to change the permissions")
    }

  }

  add_new_user_to_group(item: any) {
    this.user_service.get_user_by_name(item).subscribe((result: any) => {
      let dict_data = {
        email_id: result[0].email_id
      }

      let is_admin = result[0].email_id.includes(this.admins_list);
      console.log(is_admin)
      let is_manager = result[0].email_id.includes(this.manegers_list);
      console.log(is_manager)
      let is_writer = result[0].email_id.includes(this.writers_list);
      console.log(is_writer)
      let is_reader = result[0].email_id.includes(this.readers_list);
      console.log(is_reader)

      if (is_admin || is_manager || is_writer || is_reader) {
       alert("This user is already exists in this group!")
      }
      else {
        this.user_service.add_user_to_group(this.group_id, dict_data).subscribe((result) => {
          this.search_name = '';
          alert("new user is added in this group")
          this.add_user_dialog_boolean = false;

        });
      }
    });
  }

}
