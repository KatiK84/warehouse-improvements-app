import { generateId } from '../utils/id';
import { normalizeText } from '../utils/format';

export const createEmployee = ({ name, department = 'Складская логистика', active = true }) => ({
  id: generateId('emp'),
  name: normalizeText(name),
  department: normalizeText(department) || 'Складская логистика',
  active: Boolean(active),
  createdAt: new Date().toISOString()
});
