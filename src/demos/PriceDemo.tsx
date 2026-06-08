// packages/ui/src/demos/PriceDemo.tsx
import { Price } from '../index';

export default function PriceDemo() {
  return (
    <>
      <p>Price</p>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Price value={99.99} currency="USD" />
        <Price value={250.0} currency="SAR" discount={20} />
      </div>
    </>
  );
}
