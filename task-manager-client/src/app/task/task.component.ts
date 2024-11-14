import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Task } from '../interfaces';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatButtonModule, MatCheckboxModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() delete = new EventEmitter<Task['Id']>();
  @Output() create = new EventEmitter<Task>();
  @Output() update = new EventEmitter<Task>();

  deleteTask() {
    this.delete.emit(this.task.Id);
  }

  createTask() {
    this.create.emit({
      Name: this.taskName,
      Id: this.taskId,
      AssignedTo: this.taskAssignedTo,
      Completed: false,
    });
  }

  updateTask() {
    this.update.emit(this.task);
  }

  taskName: Task['Name'] = '';
  taskId: Task['Id'] = '';
  taskAssignedTo: Task['AssignedTo'] = '';
  taskCompleted: Task['Completed'] = false;
}
