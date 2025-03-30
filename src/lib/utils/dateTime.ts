export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString();
}

export function isExamActive(startTime: string, endTime: string) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  return now >= start && now <= end;
}

export function getTimeRemaining(endTime: string) {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return '00:00:00';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}