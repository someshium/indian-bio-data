export type BorderArtId =
  | 'silver-vine'
  | 'golden-mandala'
  | 'silver-arch'
  | 'golden-arch'
  | 'minimal-hairline'
  | 'double-frame'
  | 'soft-corner';

/** Above About: centered stack vs horizontal flex (photo + identity). Below About: centered vs ledger (left-aligned in a centered column). */
export type PreviewLayoutKind = 'stack' | 'split-top' | 'split-top-ledger';

export interface BioDataTheme {
  pageBg: string;
  /** Optional CSS gradient e.g. linear-gradient(...) — overrides flat pageBg when set */
  pageGradient?: string;
  ink: string;
  inkSoft: string;
  muted: string;
  accent: string;
  accentSoft: string;
  cream: string;
  creamDeep: string;
  /** Inset for ledger layout (body + optional header alignment) */
  ledgerInset?: string;
}

export interface BioDataDesign {
  id: string;
  name: string;
  subtitle: string;
  borderArtId: BorderArtId;
  layout: PreviewLayoutKind;
  theme: BioDataTheme;
}

export const BIO_DATA_DESIGNS: BioDataDesign[] = [
  {
    id: 'ivory-veil',
    name: 'Ivory Veil',
    subtitle: 'Silver florals · all centered',
    borderArtId: 'silver-vine',
    layout: 'stack',
    theme: {
      pageBg: '#faf7f1',
      pageGradient: 'linear-gradient(180deg, #fdfbf6 0%, #faf7f1 42%, #f3ebe0 100%)',
      ink: '#2a2318',
      inkSoft: 'rgba(42, 35, 24, 0.78)',
      muted: 'rgba(42, 35, 24, 0.52)',
      accent: '#8b7344',
      accentSoft: 'rgba(139, 115, 68, 0.35)',
      cream: '#faf7f1',
      creamDeep: '#f0e6d8',
      ledgerInset: '9mm',
    },
  },
  {
    id: 'horizon-gold',
    name: 'Horizon Gold',
    subtitle: 'Warm gold mandala · all centered',
    borderArtId: 'golden-mandala',
    layout: 'stack',
    theme: {
      pageBg: '#fbf6ec',
      pageGradient: 'linear-gradient(165deg, #fff9ef 0%, #f7ecdc 55%, #f3e4d0 100%)',
      ink: '#2c2418',
      inkSoft: 'rgba(44, 36, 24, 0.82)',
      muted: 'rgba(44, 36, 24, 0.5)',
      accent: '#9a7340',
      accentSoft: 'rgba(154, 115, 64, 0.38)',
      cream: '#fbf6ec',
      creamDeep: '#f2e3cf',
      ledgerInset: '9mm',
    },
  },
  {
    id: 'ledger-arch',
    name: 'Arch Ledger',
    subtitle: 'Top row flex · body left margin',
    borderArtId: 'silver-arch',
    layout: 'split-top-ledger',
    theme: {
      pageBg: '#f8f6f2',
      pageGradient: 'linear-gradient(180deg, #faf8f4 0%, #f4f0e8 100%)',
      ink: '#252019',
      inkSoft: 'rgba(37, 32, 25, 0.78)',
      muted: 'rgba(37, 32, 25, 0.5)',
      accent: '#6f7d86',
      accentSoft: 'rgba(111, 125, 134, 0.35)',
      cream: '#f8f6f2',
      creamDeep: '#ebe6dc',
      ledgerInset: '11mm',
    },
  },
  {
    id: 'gilded-arch-ledger',
    name: 'Gilded Arch Ledger',
    subtitle: 'Gold arch frame · ledger body',
    borderArtId: 'golden-arch',
    layout: 'split-top-ledger',
    theme: {
      pageBg: '#fbf6ec',
      pageGradient: 'linear-gradient(165deg, #fff9ef 0%, #f7ecdc 55%, #f3e4d0 100%)',
      ink: '#2c2418',
      inkSoft: 'rgba(44, 36, 24, 0.82)',
      muted: 'rgba(44, 36, 24, 0.5)',
      accent: '#9a7340',
      accentSoft: 'rgba(154, 115, 64, 0.38)',
      cream: '#fbf6ec',
      creamDeep: '#f2e3cf',
      ledgerInset: '11mm',
    },
  },
  {
    id: 'midnight-line',
    name: 'Midnight Line',
    subtitle: 'Hairline frame · dark luxury',
    borderArtId: 'minimal-hairline',
    layout: 'split-top',
    theme: {
      pageBg: '#171512',
      pageGradient: 'linear-gradient(165deg, #1c1915 0%, #141210 50%, #0f0e0c 100%)',
      ink: '#ede9e0',
      inkSoft: 'rgba(237, 233, 224, 0.78)',
      muted: 'rgba(237, 233, 224, 0.45)',
      accent: '#c4a85a',
      accentSoft: 'rgba(196, 168, 90, 0.35)',
      cream: '#171512',
      creamDeep: '#1f1c18',
      ledgerInset: '9mm',
    },
  },
  {
    id: 'pearl-duo',
    name: 'Pearl Duo',
    subtitle: 'Double frame · cool minimal',
    borderArtId: 'double-frame',
    layout: 'stack',
    theme: {
      pageBg: '#f4f3f0',
      pageGradient: 'linear-gradient(180deg, #fafaf8 0%, #f0eeea 100%)',
      ink: '#32322e',
      inkSoft: 'rgba(50, 50, 46, 0.76)',
      muted: 'rgba(50, 50, 46, 0.48)',
      accent: '#5c5a56',
      accentSoft: 'rgba(92, 90, 86, 0.3)',
      cream: '#f4f3f0',
      creamDeep: '#e8e6e1',
      ledgerInset: '9mm',
    },
  },
  {
    id: 'mist-ledger',
    name: 'Mist Ledger',
    subtitle: 'Soft corners · ledger body',
    borderArtId: 'soft-corner',
    layout: 'split-top-ledger',
    theme: {
      pageBg: '#eef1f4',
      pageGradient: 'linear-gradient(180deg, #f2f5f8 0%, #e9eef3 100%)',
      ink: '#283038',
      inkSoft: 'rgba(40, 48, 56, 0.78)',
      muted: 'rgba(40, 48, 56, 0.48)',
      accent: '#6a7a86',
      accentSoft: 'rgba(106, 122, 134, 0.32)',
      cream: '#eef1f4',
      creamDeep: '#e2e8ee',
      ledgerInset: '11mm',
    },
  },
];

export type BioDataDesignId = (typeof BIO_DATA_DESIGNS)[number]['id'];

export function bioDataDesignById(id: string): BioDataDesign {
  return BIO_DATA_DESIGNS.find((d) => d.id === id) ?? BIO_DATA_DESIGNS[0];
}
