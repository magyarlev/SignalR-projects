import { Component, inject } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { Task } from '../interfaces';
import { TaskServiceService } from '../task-service.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskComponent, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  taskService = inject(TaskServiceService);
  tasks$: Observable<Task[]> = this.taskService.tasks$;
}
