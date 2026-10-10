export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found.' });
}

export function errorHandler(error, req, res, next) {
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((e) => e.message).join(' ');
    return res.status(400).json({ message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'That email is already registered.' });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body.' });
  }
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server.' });
}
