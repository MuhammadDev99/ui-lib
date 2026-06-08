'use client';
import '../../styles/global.css';
import clsx from 'clsx';
import { stringToRandom } from '../../utils';
import styles from './style.module.css';

export function AvatarImage({
  imageUrl,
  name,
  className,
  userId,
}: {
  imageUrl?: string | null;
  name: string;
  userId: string;
  className?: string;
}) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  const hue = stringToRandom(userId, 0, 360);
  return (
    <div
      className={clsx(styles.root, className)}
      style={{
        backgroundColor: `hsl(${hue} 100% 40%)`,
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className={styles.image} />
      ) : (
        <p className={styles.nameShort}>{initial}</p>
      )}
    </div>
  );
}
