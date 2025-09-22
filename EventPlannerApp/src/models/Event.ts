export interface EventItem {
  id: string;
  title: string;
  date: string;
  category?: string;
  userId: string; // 👈 add this
}
