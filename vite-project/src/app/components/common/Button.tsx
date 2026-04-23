import { ReactNode, ButtonHTMLAttributes } from 'react';

/**
 * 공용 버튼 컴포넌트 props.
 *
 * HTML button 기본 속성을 그대로 상속하면서,
 * 프로젝트 내부에서 자주 쓰는 variant만 추가로 정의한다.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  children: ReactNode;
  className?: string;
}

/**
 * 프로젝트 공용 버튼.
 *
 * 특징:
 * - 기본 HTML button 속성을 모두 받을 수 있다.
 * - variant에 따라 미리 정의된 스타일 클래스가 바뀐다.
 * - className을 추가로 받아 세부 조정이 가능하다.
 *
 * 사용 목적:
 * 페이지마다 다른 버튼 마크업을 반복하지 않고,
 * 프로젝트 공통 버튼 패턴을 일관되게 유지하기 위함이다.
 */
export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    icon: 'btn-icon',
  }[variant];

  const baseClass = variant === 'icon' ? '' : 'btn';

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  className?: string;
}

/**
 * 아이콘 전용 버튼.
 *
 * 일반 텍스트 children 대신 `icon` prop을 받으며,
 * 접근성을 위해 `aria-label` 용도의 `label`을 필수로 받는다.
 *
 * 예:
 * - 닫기 버튼
 * - 검색 버튼
 * - 메뉴 토글 버튼
 */
export function IconButton({ icon, label, className = '', ...props }: IconButtonProps) {
  return (
    <button className={`btn-icon ${className}`} aria-label={label} {...props}>
      {icon}
    </button>
  );
}
