import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs";
import { from } from "rxjs"

const TODO_ON_PAGE = 3
const URL_ROOT = 'https://mysterious-gorge-80747.herokuapp.com/todos/'

export type todo = {
  message: string,
  completed: boolean,
  _id: string
}

export type updateBody ={
  message?: string,
  completed?: boolean,
}

export type updateCallback = (el: todo)=>void

type todoArr = todo[]
type todoStore = todoArr[]|[][]

const pageCount = (num: number, elemOnPage: number): number => {
  return Math.ceil( num / elemOnPage )
}

const isLastPageFull = (numElements: number, elemOnPage: number): boolean => {
  return numElements % elemOnPage === 0
}

@Injectable({providedIn: 'root'})
export class TodoService{

  constructor(private http: HttpClient){
  }

  public isLoad = false
  public pageCount:number[] = [1]
  public todosStore: todoStore = [[]]
  public activePage: number = 1
  public renderList: todo[] = []
  public elementsCount: number = 0

  getTodos(page: number){
    this.isLoad = true
    this.http.get<todo[]>(`${URL_ROOT}?pages=${page}&limit=${TODO_ON_PAGE}`)
      .subscribe( (data: todo[]) =>{
        this.todosStore[page - 1] = data
        this.fillRenderList(data)
        this.isLoad = false
      })
  }

  initTodoStore(){
    this.isLoad = true
    this.http.get<number>(`${URL_ROOT}count`)
      .subscribe( (data: number) =>{
        this.elementsCount = data
        const pagesNum = pageCount(data, TODO_ON_PAGE)
        this.todosStore = new Array<todoArr>(pagesNum).fill([],0)
        this.getTodos(1)
        this.isLoad = false
      })
  }

  fillRenderList(arr: todoArr){
    this.renderList = arr
  }

  editTodo(id: string, body: updateBody, callback: updateCallback ){
    this.isLoad = true
    this.http.patch(`${URL_ROOT}${id}`, body)
    .subscribe(
      () => {
        this.todosStore[this.activePage - 1].forEach(callback)
        this.isLoad = false
      }
    )
  }

  deleteTodo(id: string){
    this.isLoad = true
    this.http.delete(`${URL_ROOT}${id}`)
    .subscribe(
      () => {
        this.elementsCount -=1
        const storeLength = this.todosStore.length
        if(this.activePage === storeLength && this.todosStore[storeLength-1].length === 1){
          if(this.elementsCount !== 1){
            this.changeActivePage(this.activePage -= 1)
            this.todosStore.pop()
          } else {
            this.todosStore = [[]]
            this.renderList = []
          }
        } else {
          this.todosStore.fill([], this.activePage - 1)
          this.getTodos(this.activePage)
          if(pageCount(this.elementsCount, TODO_ON_PAGE) < storeLength){
            this.todosStore.pop()
          }
        }
        this.isLoad = false
      }
    )
  }

  addTodo(value: string){
    this.isLoad = true
    this.http.post<todo>( URL_ROOT, {message: value})
      .subscribe(
        (newTodo) => {
          const lastIndex = this.todosStore.length - 1
          if(isLastPageFull(this.elementsCount, TODO_ON_PAGE)){
            this.todosStore.push([])
            this.todosStore[lastIndex + 1].push(newTodo)
          } else {
            this.todosStore[lastIndex].push(newTodo)
          }
          this.elementsCount += 1
          this.isLoad = false
        }
      )
  }

  changeActivePage(num: number){
    this.activePage = num
    if(this.todosStore[num - 1].length === 0){
      this.getTodos(num)
    } else {
      this.fillRenderList(this.todosStore[num - 1])
    }
  }
}

