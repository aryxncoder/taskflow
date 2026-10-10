function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function TaskItem({ task, onToggle, onEdit, onDelete, busy }) {
  const isCompleted = task.status === 'Completed';
  const today = new Date().toLocaleDateString('en-CA');
  const isOverdue = !isCompleted && task.dueDate && task.dueDate.slice(0, 10) < today;
  const stateClass = isCompleted ? 'is-completed' : isOverdue ? 'is-overdue' : 'is-pending';

  return (
    <li className={`task-item ${stateClass}`}>
      <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        <p className="task-meta">
          <span className="status-badge">{isOverdue ? 'Overdue' : task.status}</span>
          {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
        </p>
      </div>
      <div className="task-actions">
        <button className="btn btn-small" onClick={() => onToggle(task)} disabled={busy}>
          {isCompleted ? 'Reopen' : 'Mark complete'}
        </button>
        <button className="btn btn-small btn-ghost" onClick={() => onEdit(task)} disabled={busy}>Edit</button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(task)} disabled={busy}>Delete</button>
      </div>
    </li>
  );
}
