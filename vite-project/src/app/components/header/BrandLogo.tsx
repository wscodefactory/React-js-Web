import { Link } from "react-router";

type BrandLogoProps = {
  brand: string;
};

export function BrandLogo({ brand }: BrandLogoProps) {
  return (
    <Link to="/" className="header-brand">
      <div className="header-brand-icon" />
      <span className="header-brand-text">{brand}</span>
    </Link>
  );
}
