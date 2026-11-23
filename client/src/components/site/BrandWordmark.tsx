type BrandWordmarkProps = {
  className?: string;
};

export default function BrandWordmark({ className = "" }: BrandWordmarkProps) {
  return <span className={`brand-wordmark ${className}`.trim()}>
    <span className="brand-wordmark-prefix">auto</span><span>majorelle</span>
  </span>;
}
