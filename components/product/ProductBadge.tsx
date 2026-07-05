// components/product/ProductBadge.tsx
interface Props {
  label: string
}

export default function ProductBadge({ label }: Props) {
  return (
    <span className="absolute left-3 top-3 rounded-sm bg-brand-accent px-2 py-0.5 text-xs font-semibold tracking-wide text-white uppercase">
      {label}
    </span>
  )
}
