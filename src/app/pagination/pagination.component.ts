import { Component, OnInit } from '@angular/core';
import { TodoService } from '../shared/todo.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  constructor(public todoService: TodoService) { }

  ngOnInit(): void {
  }

  changePage(num: number){
    this.todoService.changeActivePage(num)
  }
}
