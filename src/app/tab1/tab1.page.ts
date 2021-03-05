import { Component } from '@angular/core';
import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  tasks;
  progress: number;
  checkedItems = [];
  color: string;
  constructor(
    private tasksService: TasksService,
    public alertController: AlertController,
    private storage: Storage,
    public modalController: ModalController) { }

  ngOnInit() {
    //this.getTasks();
  }

  ionViewDidEnter() {
    this.getTasks();
  }

  getTasks() {
    this.storage.get('tasks').then(data => {
      this.tasks = data ? JSON.parse(data) : [];
      this.calculateProgres(this.tasks)
    });
  }

  calculateProgres(items) {
    this.progress = 0;
    let trueItems = [];
    this.tasks.forEach(element => {
      if (element.isDone == true) {
        trueItems.push(element);
        this.checkedItems.push(element)
      }
    });
    this.progress = trueItems.length / items.length;
    this.progress == 1 ? this.color = "success" : this.color = 'danger'
  }

  updateProgresBar(task) {
    this.checkedItems = [];
    this.calculateProgres(this.tasks)
    if (this.checkedItems.includes(task)) {
      this.checkedItems = this.checkedItems.filter((element) => element != task);
    } else {
      this.checkedItems.push(task)
    }
    this.tasksService.editTask(task)
    this.progress == 1 ? this.color = "success" : this.color = 'danger'

  }

  async presentAlert(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteTask(id);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteTask(id) {
    this.tasksService.deleteTask(id);
    this.tasks = this.tasks.filter(task => {
      return task.id !== id;
    });
    this.calculateProgres(this.tasks)
  }

  async presentModal(task) {
    const modal = await this.modalController.create({
      component: EditComponent,
      cssClass: 'my-custom-class',
      componentProps: { task },
    });
    return await modal.present();
  }

}
