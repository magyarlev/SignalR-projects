using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;
using TaskManagerApp.Models;

namespace TaskManagerApp.Hubs
{
  public class TaskHub : Hub
  {
    /* 
        Itt tároljuk a backenden a Task-ok listáját.
    */
    private static List<TaskModel> Tasks = new List<TaskModel>();

    // a paraméterben átadott tasknak ad egy id-t, 
    //hozzáadja a Tasks Listhez 
    //minden clientnek publishol a TaskCreated topicra
    public async Task CreateTask(TaskModel task)
    {
      task.Id = System.Guid.NewGuid().ToString();
      Tasks.Add(task);
      await Clients.All.SendAsync("TaskCreated", task);
    }

    // megkeressük a paraméterben átadott taskot a Task List taskjai között
    // ha találunk ilyen taskot akkor annak a propertyjeit felülírjuk
    // értesítjük az összes clientet 
    public async Task UpdateTask(TaskModel task)
    {
      var existingTask = Tasks.Find(t => t.Id == task.Id);
      if (existingTask != null)
      {
        existingTask.Name = task.Name;
        existingTask.AssignedTo = task.AssignedTo;
        existingTask.IsCompleted = task.IsCompleted;
        await Clients.All.SendAsync("TaskUpdated", existingTask);
      }
    }

    // a paramban megkapott taskId alapján megkeressük a Tasklistben a taskot
    // ha találunk ilyet akkor töröljük a Listből
    // értesítjük az összes clientet
    public async Task DeleteTask(string taskId)
    {
      var task = Tasks.Find(t => t.Id == taskId);
      if (task != null)
      {
        Tasks.Remove(task);
        await Clients.All.SendAsync("TaskDeleted", taskId);
      }
    }

    // a teljes Tasks Listet elküldjük az összes clientnek
    public async Task GetAllTasks()
    {
      await Clients.Caller.SendAsync("ReceiveTasks", Tasks);
    }
  }
}
