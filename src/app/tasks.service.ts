import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private tasks: Task[] = [

  ]
  constructor(private storage: Storage) {
    let localStorageSelectedItems;
    this.storage.get('tasks').then(data => {
      localStorageSelectedItems = data;
      this.tasks = localStorageSelectedItems ? JSON.parse(localStorageSelectedItems) : [];
    });
  }


 

  editTask(task) {
    let updateItem = this.tasks.find(this.findIndexToUpdate, task.id);
    let index = this.tasks.indexOf(updateItem);
    this.tasks[index] = task;
    this.refreshLocalStorage();
  }

  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => {
      return task.id !== id;
    });
    this.refreshLocalStorage();
  }

  createTask(task) {
    this.tasks.push(task);
    this.refreshLocalStorage();
  }

 
  refreshLocalStorage() {
    this.storage.set('tasks', JSON.stringify(this.tasks));
  }
}
