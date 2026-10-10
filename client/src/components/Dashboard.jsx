import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api.js';
import TaskForm from './TaskForm.jsx';
import TaskItem from './TaskItem.jsx';

const FILTERS = ['All', 'Pending', 'Completed'];

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formTask, setFormTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [busyTaskId, setBusyTaskId] = useState(null);
  const [actionError, setActionError] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const params = filter === 'All' ? {} : { status: filter };
      const response = await api.get('/tasks', { params });
      setTasks(response.data.tasks);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const openForm = (task = null) => {
    setFormTask(task);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormTask(null);
  };

  const handleSave = async (data) => {
    setSaving(true);
    setFormError('');
    try {
      if (formTask) {
        await api.put(`/tasks/${formTask._id}`, data);
      } else {
        await api.post('/tasks', data);
      }
      closeForm();
      await loadTasks();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const runTaskAction = async (task, action) => {
    setBusyTaskId(task._id);
    setActionError('');
    try {
      await action();
      await loadTasks();
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setBusyTaskId(null);
    }
  };

  const handleToggle = (task) =>
    runTaskAction(task, () =>
      api.put(`/tasks/${task._id}`, { status: task.status === 'Completed' ? 'Pending' : 'Completed' })
    );

  const handleDelete = (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    runTaskAction(task, () => api.delete(`/tasks/${task._id}`));
  };

  return (
    <div className="dashboard">
      <header className="topbar">
        <span className="brand">TaskFlow</span>
        <div className="topbar-user">
          <span className="user-name">{user.name}</span>
          <button className="btn btn-small btn-ghost" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <main className="content">
        <div className="content-header">
          <h1>Your tasks</h1>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => openForm()}>New task</button>
          )}
        </div>

        {showForm && (
          <TaskForm
            key={formTask?._id || 'new'}
            task={formTask}
            onSave={handleSave}
            onCancel={closeForm}
            saving={saving}
            error={formError}
          />
        )}

        <div className="filters" role="group" aria-label="Filter tasks by status">
          {FILTERS.map((name) => (
            <button
              key={name}
              className={`filter-button ${filter === name ? 'active' : ''}`}
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {actionError && <p className="alert alert-error" role="alert">{actionError}</p>}

        {loading ? (
          <p className="list-status">Loading tasks…</p>
        ) : loadError ? (
          <div className="alert alert-error" role="alert">
            {loadError}{' '}
            <button className="link-button" onClick={loadTasks}>Try again</button>
          </div>
        ) : tasks.length === 0 ? (
          <p className="list-status">
            {filter === 'All'
              ? 'No tasks yet. Add your first one with “New task”.'
              : `No ${filter.toLowerCase()} tasks.`}
          </p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                busy={busyTaskId === task._id}
                onToggle={handleToggle}
                onEdit={openForm}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
