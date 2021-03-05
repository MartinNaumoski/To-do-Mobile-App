import { Component } from '@angular/core';
import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  task:Task = {
    id:  Math.random() * 100,
    content:'',
    isPriority:false,
    date:null,
    isDone:false
  };
  
  constructor(
    private tasksService : TasksService,
    public toastController: ToastController,
    private router: Router) {}

  createTask(){
    if(this.checkRequiredFIelds()){
      this.tasksService.createTask(this.task);
      this.presentToast();
      this.cleanTask();
      this.router.navigate(['/tabs/tab1']);
    }
    else{
      this.errToast();
    }
  }

  checkRequiredFIelds():boolean{
    if(this.task.content == '' || this.task.date == null){
      return false;
    }else { return true; }
  }

  cleanTask(){
    this.task = {
      id:  Math.random() * 100,
      content:'',
      isPriority:false,
      date:null,
      isDone:false
    };
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Task has been created.',
      duration: 2000,
      color:'success'
    });
    toast.present();
  }

  async errToast() {
    const toast = await this.toastController.create({
      message: 'Please fill all of the fields.',
      duration: 2000,
      color:'danger'
    });
    toast.present();
  }
}
