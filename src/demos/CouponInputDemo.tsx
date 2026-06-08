// packages/ui/src/demos/CouponInputDemo.tsx
'use client';

import { useState } from 'react';
import { CouponInput } from '../index';

type Coupon = { code: string; discount: number };

const mockValidate = async (code: string): Promise<Coupon> => {
  if (code === 'INVALID') throw new Error('Invalid coupon code');
  return { code, discount: 15 };
};

export default function CouponInputDemo() {
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  return (
    <>
      <p>CouponInput</p>
      <CouponInput<Coupon>
        validateCoupon={mockValidate}
        onApply={(c) => setCoupon(c)}
        onRemove={() => setCoupon(null)}
        appliedCoupon={coupon}
        getCouponCode={(c) => c.code}
      />
    </>
  );
}
