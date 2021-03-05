import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  tasks;
  progress: number = 0;
  checkedItems = [];

  constructor(
    private tasksService: TasksService,
    private storage: Storage,
    public alertController: AlertController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    //this.getTasks();
  }

  ionViewWillEnter(){
    this.getTasks();
  }

  getTasks() {
    let priorityTasks = [];
    this.storage.get('tasks').then(data => {
      this.tasks = data ? JSON.parse(data) : [];
      this.tasks.forEach(element => {
        element.isPriority == true ? priorityTasks.push(element) : '';
      });
      this.tasks = priorityTasks;
      this.calculateProgres(this.tasks)  
    });
  }

  calculateProgres(items) {
    this.progress = 0;
    let trueItems = [];
    this.tasks.forEach(element => {
      if(element.isDone == true){
        trueItems.push(element);
        this.checkedItems.push(element)
      }
    });
    this.progress = trueItems.length / items.length;
  }

  updateProgresBar(task, id?) {
    if (this.checkedItems.includes(task)) {
      this.checkedItems = this.checkedItems.filter((value) => value != task);
    } else {
      this.checkedItems.push(task)
    }
    this.tasksService.editTask(task)
    this.progress = this.checkedItems.length / this.tasks.length;
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
    this.getTasks();
  }

  async presentModal(task) {
    const modal = await this.modalController.create({
      component: EditComponent,
      cssClass: 'my-custom-class',
      componentProps:{task},
    });
    return await modal.present();
  }
}
