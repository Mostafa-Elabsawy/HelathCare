const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTime(iso: string): string {
    if (!iso.includes('T')) return '--:--';
    const [h, m] = iso.split('T')[1].split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function extractDay(iso: string): string {
    return String(new Date(iso).getDate()).padStart(2, '0');
}

export function extractMonth(iso: string): string {
    return MONTHS[new Date(iso).getMonth()] ?? '';
}

export function isToday(iso: string): boolean {
    const today = new Date();
    const d = new Date(iso);
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
}
