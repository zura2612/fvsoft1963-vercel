// content/MdxRenderer.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';

const components = {
  img: (props: any) => (
    <Image 
      src={props.src} 
      alt={props.alt || 'Image de réalisation'} 
      width={800} 
      height={450} 
      className="rounded-lg shadow-md object-cover my-4" 
      priority={false}
    />
  ),
};

export function MdxRenderer({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}