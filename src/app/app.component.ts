import { Component, OnInit } from '@angular/core';

import { todo, TodoService } from './shared/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public todoService: TodoService){}

  ngOnInit(){
    this.todoService.initTodoStore()
  }

}
