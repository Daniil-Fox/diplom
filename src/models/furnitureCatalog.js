// Каталог мебели с их свойствами
export const furnitureCatalog = [
  {
    id: 'sofa',
    name: 'Диван',
    dimensions: { width: 2.2, depth: 0.9, height: 0.8 },
    color: '#8B4513',
    category: 'livingRoom'
  },
  {
    id: 'armchair',
    name: 'Кресло',
    dimensions: { width: 0.9, depth: 0.9, height: 0.8 },
    color: '#A0522D',
    category: 'livingRoom'
  },
  {
    id: 'coffeeTable',
    name: 'Журнальный столик',
    dimensions: { width: 1.2, depth: 0.6, height: 0.4 },
    color: '#D2B48C',
    category: 'livingRoom'
  },
  {
    id: 'diningTable',
    name: 'Обеденный стол',
    dimensions: { width: 1.6, depth: 0.9, height: 0.75 },
    color: '#8B4513',
    category: 'diningRoom'
  },
  {
    id: 'chair',
    name: 'Стул',
    dimensions: { width: 0.5, depth: 0.5, height: 0.9 },
    color: '#D2691E',
    category: 'diningRoom'
  },
  {
    id: 'bed',
    name: 'Кровать',
    dimensions: { width: 1.8, depth: 2.0, height: 0.5 },
    color: '#DEB887',
    category: 'bedroom'
  },
  {
    id: 'wardrobe',
    name: 'Шкаф',
    dimensions: { width: 1.2, depth: 0.6, height: 2.0 },
    color: '#CD853F',
    category: 'bedroom'
  },
  {
    id: 'desk',
    name: 'Рабочий стол',
    dimensions: { width: 1.4, depth: 0.7, height: 0.75 },
    color: '#A0522D',
    category: 'office'
  },
  {
    id: 'officeChair',
    name: 'Офисное кресло',
    dimensions: { width: 0.6, depth: 0.6, height: 1.0 },
    color: '#000000',
    category: 'office'
  },
  {
    id: 'bookshelf',
    name: 'Книжный шкаф',
    dimensions: { width: 1.0, depth: 0.3, height: 1.8 },
    color: '#8B4513',
    category: 'livingRoom'
  }
];

// Категории мебели
export const categories = [
  { id: 'livingRoom', name: 'Гостиная' },
  { id: 'diningRoom', name: 'Столовая' },
  { id: 'bedroom', name: 'Спальня' },
  { id: 'office', name: 'Офис' },
  { id: 'kitchen', name: 'Кухня' }
]; 