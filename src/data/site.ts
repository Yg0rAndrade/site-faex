// Dados fixos do site (extraídos do site original faex.edu.br)
import images from './site-images.json';

export const site = {
  name: 'FAEX - Faculdade de Extrema',
  description:
    'FAEX - Faculdade de Extrema. Cursos de Graduação, Pós-Graduação e Técnicos reconhecidos pelo MEC em Extrema, Minas Gerais.',
  logo: images.f6786241b_logo,
  ogImage: images['og-image'],
  favicon: images.favicon,
  phone: '(35) 3435-3988',
  phoneHref: 'tel:+553534353988',
  whatsapp: 'https://wa.me/5535998120307?text=Ol%C3%A1!',
  email: 'comercial@faex.edu.br',
  address: 'Avenida Paulo Migliorini, 303 - Barreiro, 37647-080 Extrema/MG',
  social: {
    instagram: 'https://www.instagram.com/faexoficial',
    facebook: 'https://facebook.com/faculdadedeextrema',
    youtube: 'https://www.youtube.com/channel/UC-BIilnELLe5QYECYX70_nQ',
  },
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const nav: NavItem[] = [
  { label: 'Início', href: '/' },
  {
    label: 'Institucional',
    href: '/sobre',
    children: [
      { label: 'A FAEX', href: '/sobre' },
      { label: 'Biblioteca', href: '/biblioteca' },
      { label: 'Clínica de Psicologia', href: '/clinica' },
      { label: 'NUPAC', href: '/nupac' },
      { label: 'CPA', href: '/cpa' },
      { label: 'Documentos', href: '/documentos' },
      { label: 'Ouvidoria', href: '/ouvidoria' },
      { label: 'Portal do Egresso', href: '/egresso' },
      { label: 'Núcleo de Estágio', href: '/empregos' },
      { label: 'Seja Parceiro', href: '/seja-parceiro' },
    ],
  },
  {
    label: 'Cursos',
    href: '/cursos',
    children: [
      { label: 'Todos os Cursos', href: '/cursos' },
      { label: 'Graduação', href: '/cursos/graduacao' },
      { label: 'Pós-Graduação', href: '/cursos/pos-graduacao' },
      { label: 'Técnico', href: '/cursos/tecnico' },
      { label: 'Formação Continuada', href: '/cursos/formacao-continuada' },
      { label: 'Capacitação Profissional', href: '/cursos/capacitacao-profissional' },
    ],
  },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Contato', href: '/contato' },
];

// Categorias de curso: slug da URL -> valor "tipo" da API
export const courseCategories = [
  { slug: 'graduacao', tipo: 'graduacao', label: 'Graduação' },
  { slug: 'pos-graduacao', tipo: 'pos_graduacao', label: 'Pós-Graduação' },
  { slug: 'tecnico', tipo: 'tecnico', label: 'Técnico' },
  { slug: 'formacao-continuada', tipo: 'formacao_continuada', label: 'Formação Continuada' },
  { slug: 'capacitacao-profissional', tipo: 'capacitacao_profissional', label: 'Capacitação Profissional' },
];

// Páginas ainda não construídas (aparecem como "em construção")
export const placeholderPages: Record<string, string> = {
  sobre: 'A FAEX',
  vestibular: 'Vestibular',
  contato: 'Contato',
  biblioteca: 'Biblioteca',
  clinica: 'Clínica de Psicologia',
  nupac: 'NUPAC',
  egresso: 'Portal do Egresso',
  oportunidades: 'Oportunidades',
  empregos: 'Núcleo de Estágio',
  cpa: 'CPA',
  documentos: 'Documentos',
  ouvidoria: 'Ouvidoria',
  'seja-parceiro': 'Seja Parceiro',
  'politica-de-privacidade': 'Política de Privacidade',
};
