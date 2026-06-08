// packages/ui/src/demos/AvatarImageDemo.tsx
import { AvatarImage } from '../index';
import { images } from '../images';

export default function AvatarImageDemo() {
  return (
    <>
      <p>AvatarImage</p>
      <AvatarImage name="Alice" userId="u21" imageUrl={images[0]} />
      <br />
      <AvatarImage name="Bob" userId="u22" imageUrl={null} />
    </>
  );
}
