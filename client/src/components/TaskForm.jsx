import { useState } from 'react';

export default function TaskForm({ task, onSave, onCancel, saving, error }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Pending',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setValidationError('Give the task a title.');
      return;
    }
    setValidationError('');
    onSave({ ...form, title: form.title.trim(), dueDate: form.dueDate || null });
  };

  const message = validationError || error;

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>{task ? 'Edit task' : 'New task'}</h2>
      {message && <p className="alert alert-error" role="alert">{message}</p>}

      <label htmlFor="task-title">Title</label>
      <input id="task-title" name="title" type="text" maxLength={100} value={form.title} onChange={handleChange} autoFocus />

      <label htmlFor="task-description">Description</label>
      <textarea id="task-description" name="description" rows={3} maxLength={500} value={form.description} onChange={handleChange} />

      <div className="form-row">
        <div>
          <label htmlFor="task-status">Status</label>
          <select id="task-status" name="status" value={form.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-due">Due date</label>
          <input id="task-due" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : task ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  );
}
