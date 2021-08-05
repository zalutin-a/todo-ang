import { ɵAnimationGroupPlayer } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { todo, TodoService, updateCallback } from '../shared/todo.service';




@Component({
  selector: '[app-todo-item]',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() curentTodo!: todo ;
  // @Output() changeTodoComplete = new EventEmitter<string>()
  editMode = false
  textContent = ''

  constructor(public todoService: TodoService) {
  }

  ngOnInit(): void {
    this.textContent = this.curentTodo.message
  }


  changeComplete(event: Event){
    this.todoService.editTodo(
      this.curentTodo._id,
      {completed: !this.curentTodo.completed},
      el => el._id === this.curentTodo._id ? el.completed = !el.completed : null
    )
  }

  changeEditMode(event: Event){
    if(this.editMode || this.textContent !== this.curentTodo.message){
      this.todoService.editTodo(
        this.curentTodo._id,
        {message: this.textContent},
        el => el._id === this.curentTodo._id ? el.message = this.textContent : null
        )
    }
    this.editMode = !this.editMode
  }

  changeTextContent(value: string){
    this.textContent = value
  }

  deleteTodo(event: Event){
    this.todoService.deleteTodo(this.curentTodo._id)
  }
}
