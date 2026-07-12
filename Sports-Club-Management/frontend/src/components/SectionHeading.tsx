import { useReveal } from '../hooks/useReveal';

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
  align?: 'center' | 'left';
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  align = 'center',
}: Props) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${visible ? 'is-visible' : ''} ${
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'
      }`}
    >
      <span
        className={`inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider ${
          light
            ? 'bg-white/80 text-brand-700'
            : 'bg-brand-50 text-brand-700'
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl ${
          light ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? 'text-slate-700' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
