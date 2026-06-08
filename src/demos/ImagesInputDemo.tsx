'use client';
import { useState } from 'react';
import { ImagesInput } from '../index';

export default function ImagesInputDemo() {
  const [images, setImages] = useState<(string | File)[]>([
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/A-Cat.jpg/3840px-A-Cat.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail',
  ]);

  return (
    <div>
      <p>ImagesInput</p>
      <ImagesInput
        images={images}
        onImagesChange={setImages}
        allowUrls
        maxImages={5}
      />
    </div>
  );
}
