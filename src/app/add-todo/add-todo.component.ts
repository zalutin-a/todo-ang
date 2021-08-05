import { Component, OnInit } from '@angular/core';
import { TodoService } from '../shared/todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {
  value = ''

  constructor(public todoService: TodoService) { }

  ngOnInit(): void {
  }
  changeValue(value: string){
    this.value = value
  }
  addTodo(){
    this.todoService.addTodo(this.value)
    this.value = ''
  }
}
