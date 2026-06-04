export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().replace(/\.\d{3}Z$/, "+00:00"); 
};