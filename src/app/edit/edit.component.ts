import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../task.model';
import { ModalController } from '@ionic/angular';
import { TasksService } from '../tasks.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  @Input() task: Task;
  flag:boolean = true;
  constructor(
    public modalController: ModalController,
    public tasksService: TasksService,
    public toastController: ToastController) { }

  ngOnInit() {
  }

  editTask() {
    var content = (<HTMLInputElement>document.getElementById('content')).value;
    var date = (<HTMLInputElement>document.getElementById('date')).value;
    var isPriority = (<HTMLInputElement>document.getElementById('isPriority'));
    let newDate = new Date(date)
    if(content != '' && date != ''){
      this.task.content = content;
      this.task.date = newDate;
      this.task.isPriority = isPriority.checked;
      this.tasksService.editTask(this.task);
      this.presentToast();
    }
    else{
      this.errToast();
    }


  }

  async errToast() {
    const toast = await this.toastController.create({
      message: 'Please fill all of the fields.',
      duration: 2000,
      color:'danger'
    });
    toast.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Task has been updated.',
      duration: 2000,
      color:'success'
    });
    toast.present();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
