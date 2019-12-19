import AppService from '../app.service';
import ProjectModel from '../models/project.model';
import ProjectsView from '../views/projects.view';
import TodoModel from '../models/todo.model';

class ProjectsController {
  constructor() {
    this.projects = JSON.parse(localStorage.getItem('projects')) || [new ProjectModel('Default')];
    this.renderView();
  }

  addProject(name) {
    this.projects.push(new ProjectModel(name));
    localStorage.setItem('projects', JSON.stringify(this.projects));
    this.renderView()
  }

  addTodo(projectId, todo) {
    this.projects.find(p => p.id === projectId).todos.push(todo);
    this.renderView();
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  removeTodo(projectId, todoId) {
    const project = this.projects.find(p => p.id === projectId);
    project.todos = project.todos.filter(t => t.id !== todoId);
    this.renderView();
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  editTodo(projectId, todoId, description, dueDate, priority) {
    const project = this.projects.find(p => p.id === projectId);
    const todo = project.todos.find(t => t.id === todoId);
    todo.description = description;
    todo.dueDate = dueDate ? new Date(dueDate) : null;
    todo.priority = priority;
    this.renderView();
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  toggleDoneState(projectId, todoId) {
    const project = this.projects.find(p => p.id === projectId);
    const todo = project.todos.find(t => t.id === todoId);
    todo.doneDate = todo.doneDate ? undefined : new Date();
    localStorage.setItem('projects', JSON.stringify(this.projects));
  }

  renderView() {
    ProjectsView.render(this.projects);

    document.querySelector('#add-todo > button')
      .addEventListener('click', ev => {
        const todo = new TodoModel(document.querySelector('#add-todo > input').value);
        this.addTodo(ev.target.dataset.id, todo);
      });

    document.querySelectorAll('#todo-actions > button.delete-todo').forEach(el => {
      el.addEventListener('click', ev => {
        this.removeTodo(ev.target.dataset.pid, ev.target.dataset.id);
      });
    });

    document.querySelectorAll('#todo-actions > button.edit-todo').forEach(el => {
      el.addEventListener('click', ev => {
        const form = document.getElementById(`todo-${ev.target.dataset.id}`);
        const description = form.querySelector('.description').value;
        const dueDate = form.querySelector('.due-date').value;
        const priority = form.querySelector('.priority').value;
        this.editTodo(ev.target.dataset.pid, ev.target.dataset.id,
          description, dueDate, priority);
      });
    });

    document.querySelectorAll('input.is-done').forEach(el => {
      el.addEventListener('click', ev => {
        this.toggleDoneState(ev.target.dataset.pid, ev.target.dataset.id);
      });
    });

    document.getElementById('add-project').addEventListener('click', ev => {
      const name = document.getElementById('new-project-name').value;
      this.addProject(name);
    })
  }
}

export default ProjectsController;
